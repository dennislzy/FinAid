package org.financial.financialaibackend.config.Web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.file-dir:${user.dir}/src/main/resources/static/files}")
    private String filesDir;

    @Value("${file.upload.audio-dir:${user.dir}/src/main/resources/static/audios}")
    private String audioDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 取消 static 目錄的快取
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0); // 設置快取為 0

        // 額外配置 uploads 目錄
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:" + filesDir + "/")
                .setCachePeriod(0);

        // 額外配置 uploads 目錄
        registry.addResourceHandler("/audios/**")
                .addResourceLocations("file:" + audioDir + "/")
                .setCachePeriod(0);
    }
}
