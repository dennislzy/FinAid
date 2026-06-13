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

    public String upload(MultipartFile file) throws  java.io.IOException {
        String key = "uploads/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        s3Template.upload(bucket, key, file.getInputStream());
        return key;
    }

    public void delete(String key) {
        s3Template.deleteObject(bucket, key);
    }
}
