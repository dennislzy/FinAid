package org.financial.financialaibackend.config.Async;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class AsyncConfig {

    @Bean(destroyMethod = "shutdown")
    public ExecutorService audioProcessingExecutorService() {
        // I/O 密集型(WebClient呼叫AI服務、FFmpeg切割),放寬執行緒數
        return Executors.newFixedThreadPool(20);
    }
}
