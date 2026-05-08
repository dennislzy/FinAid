package org.financial.financialaibackend.Dto.audioAndSummary;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioTextRequest {

    @NotBlank
    public String audioTexts;
}
