package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum AnalysisType {
    RISK("風險評估"),
    WELFARE("補助查詢");

    private final String value;

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static AnalysisType fromValue(String v) {
        if (v == null || v.isEmpty()) {
            return null;
        }
        for (AnalysisType a : AnalysisType.values()) {
            if (a.value.equals(v)) {
                return a;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + v);
    }

    @jakarta.persistence.Converter(autoApply = true)
    public static class AnalysisTypeConverter implements AttributeConverter<AnalysisType, String> {
        @Override
        public String convertToDatabaseColumn(AnalysisType attribute) {
            return attribute != null ? attribute.getValue() : "";
        }

        @Override
        public AnalysisType convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isEmpty()) {
                return null;
            }
            return AnalysisType.fromValue(dbData);
        }
    }
}
