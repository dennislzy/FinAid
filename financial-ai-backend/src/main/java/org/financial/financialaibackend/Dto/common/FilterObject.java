package org.financial.financialaibackend.Dto.common;

import lombok.Data;

@Data
public class FilterObject {

    public int page;

    public int size;

    public String sortBy;

    public String order;

    public String query;
}
