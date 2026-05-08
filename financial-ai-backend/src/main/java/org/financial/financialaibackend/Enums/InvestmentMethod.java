package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum InvestmentMethod {
    REGULARINVESTMENT("定"),
    SINGLEINVESTMENT("單");

    private final String value;

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static InvestmentMethod fromValue(String v) {
        // 處理空值或空字串的情況
        if (v == null || v.trim().isEmpty()) {
            return null;
        }
        for (InvestmentMethod method : InvestmentMethod.values()) {
            if (method.value.equals(v)) {
                return method;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + v);
    }

    @jakarta.persistence.Converter(autoApply = true)
    public static class Converter implements AttributeConverter<InvestmentMethod, String> {
        @Override
        public String convertToDatabaseColumn(InvestmentMethod attribute) {
            // 如果值為 null，返回 null
            return attribute != null ? attribute.getValue() : null;
        }

        @Override
        public InvestmentMethod convertToEntityAttribute(String dbData) {
            // 如果資料庫欄位為 null 或空字串，返回 null
            return dbData != null && !dbData.trim().isEmpty() ? InvestmentMethod.fromValue(dbData) : null;
        }
    }
}
