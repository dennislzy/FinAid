package org.financial.financialaibackend.Dto.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MappingToDatabaseText {

    private String text;

    private String socialWorkerEmail;
}
