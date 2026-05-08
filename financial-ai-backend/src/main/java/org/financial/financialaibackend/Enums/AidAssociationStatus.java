package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.AttributeConverter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum AidAssociationStatus {

    ALIVE("活會"),   // 活會
    DECEASED("死會"); // 死會

    private final String value;

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static AidAssociationStatus fromValue(String value) {
        // 處理空值或空字串
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        for (AidAssociationStatus status : AidAssociationStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("無效的狀態: " + value);
    }

    @jakarta.persistence.Converter(autoApply = true)
    public static class AidAssociationStatusConverter implements AttributeConverter<AidAssociationStatus, String> {

        @Override
        public String convertToDatabaseColumn(AidAssociationStatus attribute) {
            // 如果屬性為 null，存入資料庫時返回 null
            return attribute != null ? attribute.getValue() : null;
        }

        @Override
        public AidAssociationStatus convertToEntityAttribute(String dbData) {
            // 如果資料庫欄位為 null 或空字串，返回 null
            return dbData != null && !dbData.trim().isEmpty() ? AidAssociationStatus.fromValue(dbData) : null;
        }
    }
}
