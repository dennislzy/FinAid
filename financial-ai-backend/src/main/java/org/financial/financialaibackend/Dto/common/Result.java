package org.financial.financialaibackend.Dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result {

    public long total;

    public List<?> rows;

    public int totalPages;
}
