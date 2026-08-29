import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import config
import json
import requests
import os
import zipfile
import platform
from io import BytesIO
import tempfile
import shutil
from urllib.parse import urlparse  # 导入URL解析函数

def download_chromedriver():
    """下载并返回最新的ChromeDriver路径"""
    # 创建临时下载目录
    temp_dir = tempfile.mkdtemp(prefix="chromedriver_")

    try:
        # 获取最新版本信息的JSON
        json_url = "https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json"
        response = requests.get(json_url)
        data = json.loads(response.text)

        # 获取最新的稳定版本
        latest_version = data['versions'][-1]['version']
        downloads = data['versions'][-1]['downloads']

        # 确定操作系统平台
        system = platform.system().lower()
        if system == "windows":
            platform_name = "win64"
        elif system == "darwin":  # macOS
            platform_name = "mac-x64" if platform.machine() != "arm64" else "mac-arm64"
        else:  # Linux
            platform_name = "linux64"

        # 找到对应平台的ChromeDriver下载URL
        chromedriver_url = None
        for item in downloads.get('chromedriver', []):
            if item['platform'] == platform_name:
                chromedriver_url = item['url']
                break

        if not chromedriver_url:
            raise Exception(f"找不到平台 {platform_name} 的ChromeDriver下载链接")

        # 下载ChromeDriver
        print(f"下载ChromeDriver版本 {latest_version}...")
        response = requests.get(chromedriver_url)

        # 解压ZIP文件
        zip_file = zipfile.ZipFile(BytesIO(response.content))
        zip_file.extractall(temp_dir)

        # 找到chromedriver可执行文件
        chromedriver_path = None
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                if file == "chromedriver.exe" or file == "chromedriver":
                    chromedriver_path = os.path.join(root, file)
                    break
            if chromedriver_path:
                break

        if not chromedriver_path:
            raise Exception("无法在解压后的文件中找到chromedriver可执行文件")

        # 确保文件可执行
        if system != "windows":
            os.chmod(chromedriver_path, 0o755)

        print(f"ChromeDriver已下载到: {chromedriver_path}")
        return chromedriver_path

    except Exception as e:
        print(f"下载ChromeDriver时出错: {e}")
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise


@pytest.fixture(scope="function")
def driver():
    """创建WebDriver实例的fixture"""
    driver = None
    temp_dir = None

    try:
        browser_type = config.BROWSER_TYPE

        if browser_type.lower() == "chrome":
            options = webdriver.ChromeOptions()

            # 添加选项以改善稳定性
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")

            try:
                # 尝试使用标准方法
                driver = webdriver.Chrome(options=options)
            except Exception as e:
                print(f"标准方法失败，尝试自定义下载: {e}")
                # 使用自定义下载函数
                chromedriver_path = download_chromedriver()
                service = Service(chromedriver_path)
                driver = webdriver.Chrome(service=service, options=options)
                # 保存临时目录路径以便之后清理
                temp_dir = os.path.dirname(os.path.dirname(chromedriver_path))

        elif browser_type.lower() == "firefox":
            options = webdriver.FirefoxOptions()
            driver = webdriver.Firefox(options=options)

        elif browser_type.lower() == "edge":
            options = webdriver.EdgeOptions()
            driver = webdriver.Edge(options=options)

        else:
            raise ValueError(f"不支持的浏览器类型: {browser_type}")

        # 设置窗口大小和隐式等待
        driver.maximize_window()
        driver.implicitly_wait(config.IMPLICIT_WAIT)
        try:
            # 首先访问网站（必须先访问相关域名才能设置cookies）
            driver.get(config.BASE_FRONTED_URL)

            # 从URL解析域名，以便正确设置cookie的domain
            parsed_url = urlparse(config.BASE_FRONTED_URL)
            domain = parsed_url.netloc

            # 移除端口号，如果有的话
            if ":" in domain:
                domain = domain.split(":")[0]

            # 根据环境设置cookie
            if domain == "localhost" or domain.startswith("127.0.0.1"):
                # 本地环境
                cookie = {
                    'name': 'user',
                    'value': config.SOCIAL_WORKER_EMAIL,
                    'path': '/'
                }
            else:
                # 非本地环境
                cookie = {
                    'name': 'user',
                    'value': config.SOCIAL_WORKER_EMAIL,
                    'domain': domain,
                    'path': '/'
                }

            # 添加cookie
            driver.add_cookie(cookie)

            # 可选：添加其他必要的cookies
            # driver.add_cookie({'name': 'sessionid', 'value': '你的会话ID', 'path': '/'})
            # driver.add_cookie({'name': 'token', 'value': '你的认证令牌', 'path': '/'})

            # 刷新页面使cookies生效
            driver.refresh()
            print("已成功设置用户cookie: test5@gmail.com")

        except Exception as e:
            print(f"设置cookie时出错，但继续执行测试: {e}")
            # 继续执行，不让cookie错误中断测试

        yield driver

    except Exception as e:
        print(f"创建WebDriver失败: {e}")
        raise

    finally:
        # 清理资源
        if driver:
            driver.quit()

        # 删除临时目录（如果有）
        if temp_dir and os.path.exists(temp_dir):
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
            except:
                pass