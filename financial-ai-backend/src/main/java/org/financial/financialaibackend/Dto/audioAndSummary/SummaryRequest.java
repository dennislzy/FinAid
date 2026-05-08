package org.financial.financialaibackend.Dto.audioAndSummary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryRequest {

    public String summaryTexts;

    public String fileName;
}
