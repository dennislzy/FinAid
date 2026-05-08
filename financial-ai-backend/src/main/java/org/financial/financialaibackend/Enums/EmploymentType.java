package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum EmploymentType {
    FULL_TIME("全職"),
    PART_TIME("兼職"),
    SELF_EMPLOYED("自營"),
    TEMPORARY("打工"),
    UNEMPLOYED("無業");

    private final String value;

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static EmploymentType fromValue(String v) {
        if (v == null || v.isEmpty()) {
            return null;
        }
        for (EmploymentType e : EmploymentType.values()) {
            if (e.value.equals(v)) {
                return e;
            }
        }
        throw new IllegalArgumentException("Unknown employment type: " + v);
    }

    @jakarta.persistence.Converter(autoApply = true)
    public static class Converter implements AttributeConverter<EmploymentType, String> {
        @Override
        public String convertToDatabaseColumn(EmploymentType attribute) {
            return attribute != null ? attribute.getValue() : "";
        }

        @Override
        public EmploymentType convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isEmpty()) {
                return null;
            }
            return EmploymentType.fromValue(dbData);
        }
    }
}
