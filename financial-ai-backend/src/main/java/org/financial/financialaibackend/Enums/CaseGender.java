package org.financial.financialaibackend.Enums;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.AttributeConverter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum CaseGender {
    MALE("男"),
    FEMALE("女"),
    OTHER("其他");

    private final String value;

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static CaseGender fromValue(String v) {
        if (v == null || v.isEmpty()) {
            return null; // 或返回 OTHER 作為默認值
        }
        for (CaseGender c : CaseGender.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + v);
    }

    @jakarta.persistence.Converter(autoApply = true)
    public static class Converter implements AttributeConverter<CaseGender, String> {
        @Override
        public String convertToDatabaseColumn(CaseGender attribute) {
            return attribute != null ? attribute.getValue() : ""; // 存儲為空字串
        }

        @Override
        public CaseGender convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isEmpty()) {
                return null; // 或返回 OTHER
            }
            return CaseGender.fromValue(dbData);
        }
    }
}
