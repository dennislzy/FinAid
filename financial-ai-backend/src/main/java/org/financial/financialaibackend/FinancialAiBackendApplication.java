package org.financial.financialaibackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FinancialAiBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinancialAiBackendApplication.class, args);
    }

}
