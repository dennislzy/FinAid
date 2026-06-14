package org.financial.financialaibackend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Template s3Template;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${spring.cloud.aws.region}")
    private String region;

    public String upload(MultipartFile file,String folderName,String fileName) throws java.io.IOException {
        String key = folderName + "/" + fileName;
        s3Template.upload(bucket, key, file.getInputStream());
        
        // 回傳完整 S3 URL
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, key);
    }

    public void delete(String key) {
        s3Template.deleteObject(bucket, key);
    }
}
