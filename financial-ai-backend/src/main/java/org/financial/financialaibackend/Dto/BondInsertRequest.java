package org.financial.financialaibackend.Dto;

import java.util.Date;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BondInsertRequest {

    @NotBlank(message = "債券名稱不可為空")
    private String bondName;

    @NotBlank(message = "公司名稱不可為空")
    private String companyName;

    @NotNull(message = "投資金額不可為空")
    @Min(value = 0, message = "投資金額不得為負數")
    private Integer money;

    @NotNull(message = "申請時間不可為空")
    private Date applyTime;

    public String getBondName() {
        return bondName;
    }

    public void setBondName(String bondName) {
        this.bondName = bondName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getMoney() {
        return money;
    }

    public void setMoney(Integer money) {
        this.money = money;
    }

    public Date getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(Date applyTime) {
        this.applyTime = applyTime;
    }
}
