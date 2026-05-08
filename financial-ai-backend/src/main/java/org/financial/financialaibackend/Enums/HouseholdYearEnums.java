package org.financial.financialaibackend.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;


public class HouseholdYearEnums {

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
        YEARENDBOND("年終紅利"),
        DIVIDENDS("股息"),
        DEPOSIT_INTEREST("存款利息"),
        BOUND_INTEREST("債券利息"),
        OTHERANNUAL_INCOME("其他年收入");

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
        INCOME_TAX("所得稅"),
        HOUSE_TAX("房屋稅"),
        LAND_TAX("地價稅"),
        VEHICLE_TAX("車輛稅"),
        INSURANCE("保險"),
        OTHER_ANNUAL_EXPAND("其他年度支出");

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
    public enum FinancialTypeAssets {
        DEMAND_DEPOSIT("活期存款"),
        FIXED_DEPOSIT("定期存款"),
        // CHECK_DEPOSIT("支票"),
        // SHORT_TERM("短期投資"),
        // HOUSING_VALUE("房產價值"),
        VEHICLE_VALUE("車輛價值"),
        COLLECTIBLES("收藏品"),
        // OTHER_CURRENT_ASSET("其他流動資產"),
        // STOCKS("股票"),
        // CORPORATE_BOND("公司債券"),
        // DOMESTIC_FUND("國內基金"),
        // FOREIGN_FUND("國外基金"),
        // ACTIVE_ASSOCIATION("活期存款合作金"),
        LOAN_INDIVIDUAL("個人貸款"),
        PRECIOUS_METAL("貴重金屬"),
        REAL_ESTATE("不動產"),
        OTHER_INVEST_ASSET("其他資產");

        private final String value;

        FinancialTypeAssets(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static FinancialTypeAssets fromValue(String v) {
            for (FinancialTypeAssets c : FinancialTypeAssets.values()) {
                if (c.value.equals(v)) {
                    return c;
                }
            }
            throw new IllegalArgumentException("無效的值: " + v);
        }
    }

    // Financial Type Enum for Liability
    public enum FinancialTypeLiability {
        CREDIT_CARD("信用卡債"),
        // INSTALLMENT_LOAN("分期付款"),
        CONSUMER_LOAN("消費性貸款"),
        // LIFE_INSURANCE_LOAN("壽險借款"),
        // DEAD_ASSOC("死會金額"),
        HOUSE_LOAN("房屋貸款"),
        CAR_LOAN("汽車貸款"),
        PERSONAL_LOANS("朋友借款"),
        OTHER_LOAN("其他貸款");

        private final String value;

        FinancialTypeLiability(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static FinancialTypeLiability fromValue(String v) {
            for (FinancialTypeLiability c : FinancialTypeLiability.values()) {
                if (c.value.equals(v)) {
                    return c;
                }
            }
            throw new IllegalArgumentException("無效的值: " + v);
        }
    }

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
