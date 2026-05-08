package org.financial.financialaibackend.Dto.file;

import java.time.LocalDate;

import org.financial.financialaibackend.Entity.CaseInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {

    private Integer fileId; 

    private CaseInfo caseInfo;

    private LocalDate updateTime; 

    private String title; 

    private String summary; 
    
    private String totalText; 

    private String duration; // 時長 (HH:mm:ss)
}
