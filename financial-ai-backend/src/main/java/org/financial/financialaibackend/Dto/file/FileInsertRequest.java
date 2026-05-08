package org.financial.financialaibackend.Dto.file;

import java.time.LocalDate;

import org.financial.financialaibackend.Enums.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileInsertRequest {

    private String fileName;

    private String summary; 

    private String totalText;

    private String duration;
    
    private LocalDate createTime;

    private Status status;
}
