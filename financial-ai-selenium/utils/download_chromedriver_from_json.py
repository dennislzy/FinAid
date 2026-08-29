import json
import requests
import os
import zipfile
import platform
from io import BytesIO


def download_chromedriver_from_json():
    # 创建下载目录
    download_dir = os.path.join(os.path.expanduser("~"), "chromedriver_custom")
    os.makedirs(download_dir, exist_ok=True)

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
    zip_file.extractall(download_dir)

    # 找到chromedriver可执行文件
    chromedriver_path = None
    for root, dirs, files in os.walk(download_dir):
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