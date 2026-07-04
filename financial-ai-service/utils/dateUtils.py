from datetime import datetime
def is_valid_date(date_str: str) -> bool:
    try:
        # 嘗試使用指定格式解析日期
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        # 如果解析失敗，說明格式不正確
        return False

def response_time(begin_time,end_time):

    return round(end_time-begin_time,2)

