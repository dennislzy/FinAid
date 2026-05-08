package org.financial.financialaibackend.Dto;

import java.util.Date;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubsidyInsertRequest {

    @NotBlank(message = "補助名稱不可為空")
    private String subsidyName;

    @NotNull(message = "補助金額不可為空")
    @Min(value = 0, message = "補助金額不得為負數")
    private Integer money;

    @NotNull(message = "申請時間不可為空")
    private Date applyTime;

    @NotNull(message = "領取時間不可為空")
    private Date receiveTime;

    public String getSubsidyName() {
        return subsidyName;
    }

    public void setSubsidyName(String subsidyName) {
        this.subsidyName = subsidyName;
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

    public Date getReceiveTime() {
        return receiveTime;
    }

    public void setReceiveTime(Date receiveTime) {
        this.receiveTime = receiveTime;
    }
}
