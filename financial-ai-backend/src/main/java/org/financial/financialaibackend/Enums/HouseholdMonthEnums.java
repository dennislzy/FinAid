package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public class HouseholdMonthEnums {

    // Financial Category Enum
    public enum FinancialCategory {
        INCOME("收入"),
        EXPENSE("支出"),
        ASSETS("資產"),
        LIABILITY("負債");

        private final String value;

        FinancialCategory(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static FinancialCategory fromValue(String v) {
            for (FinancialCategory c : FinancialCategory.values()) {
                if (c.value.equals(v)) {
                    return c;
                }
            }
            throw new IllegalArgumentException("無效的值: " + v);
        }
    }

    // Financial Type Enum for Income
    public enum FinancialTypeIncome {
        SALARY("薪資"),
        // ALLOWANCE("津貼"),
        // SUBSIDY("補助"),
        // INVESTMENT("投資收入"),
        OTHER_MONTH_INCOME("其他收入");

        private final String value;

        FinancialTypeIncome(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static FinancialTypeIncome fromValue(String v) {
            for (FinancialTypeIncome c : FinancialTypeIncome.values()) {
                if (c.value.equals(v)) {
                    return c;
                }
            }
            throw new IllegalArgumentException("無效的值: " + v);
        }
    }

    // Financial Type Enum for Expense
    public enum FinancialTypeExpense {
        FOOD("食物"),
        CLOTHING("衣服"),
        HOUSE("房租(貸)"),
        TRANSPORTATION("交通"),
        EDUCATION("教育費用"),
        ENTERTAINMENT("娛樂"),
        HEALTH("醫療"),
        TELECOMMUNICATION("電信費用"),
        CHILDREN("孩童費用"),
        ELDER_SUPPORT("孝親費用"),
        SOCIAL_INSURANCE("社會保險"),
        COMMERCIAL_INSURANCE("商業保險"),
        RETIREMENT_FUND("自提勞退"),
        // SAVINGS("儲蓄"),
        // INVESTMENT("投資"),
        // PERSONAL_LOAN("信用卡"),
        // CAR_LOAN("車貸"),
        // FRIEND("朋友"),
        OTHER_MONTH_EXPENSE("其他費用");

        private final String value;

        FinancialTypeExpense(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static FinancialTypeExpense fromValue(String v) {
            for (FinancialTypeExpense c : FinancialTypeExpense.values()) {
                if (c.value.equals(v)) {
                    return c;
                }
            }
            throw new IllegalArgumentException("無效的值: " + v);
        }
    }

    // Financial Type Enum for Assets
    // public enum FinancialTypeAssets {
    //     CASH("現金"),
    //     CURRENT_ACCOUNT("活存"),
    //     FIXED_DEPOSIT("定存"),
    //     // INSURANCE_VALUE("壽險"),
    //     INVESTMENT_VALUE("投資現額"),
    //     // VEHICLE_VALUE("汽(機)車"),
    //     OTHER_MONTH_ASSET("其他資產");

    //     private final String value;

    //     FinancialTypeAssets(String value) {
    //         this.value = value;
    //     }

    //     @JsonValue
    //     public String getValue() {
    //         return value;
    //     }

    //     @JsonCreator
    //     public static FinancialTypeAssets fromValue(String v) {
    //         for (FinancialTypeAssets c : FinancialTypeAssets.values()) {
    //             if (c.value.equals(v)) {
    //                 return c;
    //             }
    //         }
    //         throw new IllegalArgumentException("無效的值: " + v);
    //     }
    // }

    // Financial Type Enum for Liability
    // public enum FinancialTypeLiability {
    //     CREDIT_CARD_DEBT("信用卡未還餘額"),
    //     INSTALLMENT_LOANS("信貸未還餘額"),
    //     CAR_LOAN("車貸未還餘額"),
    //     PERSONAL_LOANS("朋友借款"),
    //     OTHER_MONTH_LIABILITY("其他負債");

    //     private final String value;

    //     FinancialTypeLiability(String value) {
    //         this.value = value;
    //     }

    //     @JsonValue
    //     public String getValue() {
    //         return value;
    //     }

    //     @JsonCreator
    //     public static FinancialTypeLiability fromValue(String v) {
    //         for (FinancialTypeLiability c : FinancialTypeLiability.values()) {
    //             if (c.value.equals(v)) {
    //                 return c;
    //             }
    //         }
    //         throw new IllegalArgumentException("無效的值: " + v);
    //     }
    // }

    // Converter for FinancialCategory
    @Converter(autoApply = true)
    public static class FinancialCategoryConverter implements AttributeConverter<FinancialCategory, String> {

        @Override
        public String convertToDatabaseColumn(FinancialCategory attribute) {
            return attribute != null ? attribute.getValue() : null;
        }

        @Override
        public FinancialCategory convertToEntityAttribute(String dbData) {
            return dbData != null ? FinancialCategory.fromValue(dbData) : null;
        }
    }
}
