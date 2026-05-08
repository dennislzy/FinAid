package org.financial.financialaibackend.Enums.converter;

import org.financial.financialaibackend.Enums.HouseholdRegistrationPeriod;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class HouseholdRegistrationPeriodConverter implements AttributeConverter<HouseholdRegistrationPeriod, String> {

    @Override
    public String convertToDatabaseColumn(HouseholdRegistrationPeriod attribute) {
        return attribute != null ? attribute.getValue() : null;
    }

    @Override
    public HouseholdRegistrationPeriod convertToEntityAttribute(String dbData) {
        return dbData != null ? HouseholdRegistrationPeriod.fromValue(dbData) : null;
    }
}
