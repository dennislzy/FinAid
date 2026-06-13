package org.financial.financialaibackend.Controller;

import java.util.Map;

import org.financial.financialaibackend.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file) throws java.io.IOException {

        String key = s3Service.upload(file);
        return ResponseEntity.ok(Map.of("key", key));
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestParam String key) {
        s3Service.delete(key);
        return ResponseEntity.noContent().build();
    }
}