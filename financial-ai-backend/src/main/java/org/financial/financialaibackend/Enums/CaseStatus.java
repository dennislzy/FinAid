package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.AttributeConverter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum CaseStatus {
    OWN("自住"),
    RENT("租屋"),
    HOMELESS("居無定所"),
    OTHER("其他");

    private final String value;

    /**
     * 獲取 Enum 的對應值
     *
     * @return 對應的字串值
     */
    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * 根據值返回對應的 Enum
     *
     * @param v 字串值
     * @return 對應的 Enum 值
     */
    @JsonCreator
    public static CaseStatus fromValue(String v) {
        if (v == null || v.isEmpty()) {
            return OTHER; // 默認為 OTHER
        }
        for (CaseStatus c : CaseStatus.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + v);
    }

    /**
     * JPA 屬性轉換器
     */
    @jakarta.persistence.Converter(autoApply = true)
    public static class Converter implements AttributeConverter<CaseStatus, String> {
        /**
         * 將 Enum 轉換為資料庫的值
         *
         * @param attribute Enum 值
         * @return 字串值
         */
        @Override
        public String convertToDatabaseColumn(CaseStatus attribute) {
            return attribute != null ? attribute.getValue() : ""; // 存儲為空字串
        }

        /**
         * 將資料庫的值轉換為 Enum
         *
         * @param dbData 資料庫值
         * @return 對應的 Enum 值
         */
        @Override
        public CaseStatus convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isEmpty()) {
                return OTHER; // 默認為 OTHER
            }
            return CaseStatus.fromValue(dbData);
        }
    }
}


