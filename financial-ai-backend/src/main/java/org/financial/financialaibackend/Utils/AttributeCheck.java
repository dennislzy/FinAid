package org.financial.financialaibackend.Utils;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.Date;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The {@code AttributeCheck} class provides utility methods for
 * common attribute validations such as checking for null values
 * and validating email addresses.
 */
public class AttributeCheck {

    /**
     * Checks if none of the provided objects are {@code null}.
     *
     * @param objects A variable-length array of objects to be checked.
     * @return {@code true} if all objects are not null; {@code false} otherwise.
     */
    public static boolean notNull(Object... objects) {
        for (Object object : objects) {
            // If any object is null, return false
            if (Objects.isNull(object)) {
                return false;
            }
        }
        return true; // All objects are not null
    }

    /**
     * Validates whether a given string is a valid email address.
     * <p>
     * The method checks if the email conforms to a standard format using a regular expression.
     * An email is considered valid if it follows the pattern: "local-part@domain".
     * </p>
     *
     * @param email The email address to validate.
     * @return {@code true} if the email is valid; {@code false} otherwise.
     */
    public static boolean isValidEmail(String email) {
        // Check for null or empty string
        if (email == null || email.isEmpty()) {
            return false;
        }

        // Define the regex pattern for a valid email address
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

        // Create a pattern and matcher to validate the email
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);

        return matcher.matches(); // Return whether the email matches the regex
    }

    public static boolean isValidTaiwanMobile(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return false;
        }
        // Regular expression to match Taiwanese mobile numbers
        String taiwanMobileRegex = "^09\\d{8}$";
        return phoneNumber.matches(taiwanMobileRegex);
    }

    public static boolean isValidTaiwanLandline(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return false;
        }
        // Regular expression to match Taiwanese landline numbers
        String taiwanLandlineRegex = "^(0[2-8]\\d{7}|0[3-8]\\d{6}|0[2-9]\\d{5,9})$";
        return phoneNumber.matches(taiwanLandlineRegex);
    }

    public static boolean notNullObject(Object object) {
        if (object == null) {
            return false; // 如果物件本身為 null，直接返回 false
        }

        Field[] fields = object.getClass().getDeclaredFields(); // 獲取所有字段
        for (Field field : fields) {
            field.setAccessible(true); // 設置可訪問私有字段
            try {
                Object value = field.get(object); // 獲取字段的值

                // 判斷字段是否為 null 或空
                if (value == null) {
                    return false;
                } else if (value instanceof String && ((String) value).trim().isEmpty()) {
                    return false;
                } else if (value instanceof Collection && ((Collection<?>) value).isEmpty()) {
                    return false;
                } else if (value instanceof Integer && (Integer) value == 0) {
                    return false; // 假設 Integer 為 0 時視為無效
                } else if (value instanceof Date && ((Date) value).getTime() == 0) {
                    return false; // 假設 Date 為 Unix epoch 時視為無效
                }
                // 可擴展其他類型（例如 Map 或 Array）根據需求處理
            } catch (IllegalAccessException e) {
                e.printStackTrace();
                return false; // 如果反射失敗，視為檢查不通過
            }
        }

        return true; // 所有字段都不為 null 或空
    }
}
