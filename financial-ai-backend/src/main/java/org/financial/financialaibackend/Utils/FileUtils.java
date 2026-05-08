package org.financial.financialaibackend.Utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
@Slf4j
public class FileUtils {

    public static Path checkDirectories(String dir) {
        Path uploadPath = Paths.get(dir);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return uploadPath;
    }

    public static FileResponse  saveFile(MultipartFile multipartFile,Path path,String folder) throws IOException {
        // 生成檔案名稱
        String filename = StringUtils.cleanPath(multipartFile.getOriginalFilename());

        // 儲存檔案
        Path filePath = path.resolve(filename);
        Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String url="http://localhost:8080/"+folder+"/"+filename;
        return new FileResponse(url,multipartFile.getContentType());
    }

    public static boolean checkIsAudio(MultipartFile multipartFile) {
        log.info("audio"+multipartFile.getContentType());
        if (Objects.equals(multipartFile.getContentType(), "audio/mpeg") || Objects.equals(multipartFile.getContentType(), "audio/mp4")) {
            return true;
        }else{
            return false;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileResponse{

        public String url;

        public String contentType;

    }
}
