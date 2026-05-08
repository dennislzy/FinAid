package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum InsuranceType {
    LIFE("壽險"),
    MEDICAL("醫療險"),
    ACCIDENT("意外險");

    private final String value;

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static InsuranceType fromValue(String v) {
        // 處理 null 或空字串
        if (v == null || v.trim().isEmpty()) {
            return null; // 如果接收到 null 或空值，返回 null
        }

        for (InsuranceType c : InsuranceType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + v);
    }

    @jakarta.persistence.Converter(autoApply = true)
    public static class Converter implements AttributeConverter<InsuranceType, String> {
        @Override
        public String convertToDatabaseColumn(InsuranceType attribute) {
            // 如果值為 null，返回 null
            return attribute != null ? attribute.getValue() : null;
        }

        @Override
        public InsuranceType convertToEntityAttribute(String dbData) {
            // 如果資料庫欄位為 null，返回 null
            return dbData != null && !dbData.trim().isEmpty() ? InsuranceType.fromValue(dbData) : null;
        }
    }
}
