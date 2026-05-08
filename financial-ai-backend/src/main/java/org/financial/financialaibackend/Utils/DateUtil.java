package org.financial.financialaibackend.Utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 日期工具类
 */
public class DateUtil {

    /**
     * 将字符串日期转换为 Date 对象
     *
     * @param date 字符串日期，格式为 "yyyy-MM-dd"
     * @return 转换后的 Date 对象
     * @throws RuntimeException 如果日期解析失败
     */
    public static Date convertToDate(String date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date dateObj = null;
        try {
            dateObj = formatter.parse(date);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        return dateObj;
    }

    public static String formatDuration(double durationInSeconds) {
        int hours = (int) (durationInSeconds / 3600);
        int minutes = (int) ((durationInSeconds % 3600) / 60);
        int seconds = (int) (durationInSeconds % 60);
        
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }
}