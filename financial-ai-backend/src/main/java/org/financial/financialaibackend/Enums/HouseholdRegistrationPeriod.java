package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum HouseholdRegistrationPeriod {
    ONE_TO_THREE_MONTHS("約1~3個月"),
    FOUR_TO_FIVE_MONTHS("約4~5個月"),
    SIX_TO_NINE_MONTHS("約6~9個月"),
    TEN_TO_ELEVEN_MONTHS("約10~11個月"),
    TWELVE_MONTHS_OR_MORE("約12個月以上");

    private final String value;

    HouseholdRegistrationPeriod(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static HouseholdRegistrationPeriod fromValue(String v) {
        for (HouseholdRegistrationPeriod period : HouseholdRegistrationPeriod.values()) {
            if (period.value.equals(v)) {
                return period;
            }
        }
        throw new IllegalArgumentException("無效的值: " + v);
    }
}
