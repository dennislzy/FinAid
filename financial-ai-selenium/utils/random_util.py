import random
import string
import time

def generate_random_string(prefix=None, suffix=None):
    # 使用 ascii_letters 和 digits 生成隨機字符串
    chars = string.ascii_letters + string.digits
    random_chars = "".join(random.choice(chars) for _ in range(4))

    # UNIX Timestamp
    timestamp = str(int(time.time()))

    # 根據有無前綴和後綴組合結果
    result = ""
    if prefix:
        result += prefix
    result += timestamp + random_chars
    if suffix:
        result += suffix

    return result