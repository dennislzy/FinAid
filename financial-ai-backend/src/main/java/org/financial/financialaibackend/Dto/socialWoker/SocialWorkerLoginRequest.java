package org.financial.financialaibackend.Dto.socialWoker;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SocialWorkerLoginRequest {
        @NotNull
        public String socialWorkerEmail;

        @NotBlank
        public String socialWorkerPassword;
}
