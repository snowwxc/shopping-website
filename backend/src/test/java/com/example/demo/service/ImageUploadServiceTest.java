package com.example.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class ImageUploadServiceTest {

    @TempDir
    Path tempDir;

    private ImageUploadService imageUploadService;

    @BeforeEach
    void setUp() {
        // Initialize the service with the temporary directory for uploads
        imageUploadService = new ImageUploadService(tempDir);
    }

    @Test
    void testUploadImage_success() throws IOException {
        String originalFileName = "test.jpg";
        MockMultipartFile file = new MockMultipartFile(
                "file",
                originalFileName,
                "image/jpeg",
                "test data".getBytes()
        );

        // Call the real uploadImage method
        String imageUrl = imageUploadService.uploadImage(file);

        assertThat(imageUrl).startsWith("/images/");
        // The service generates a UUID, so we only check the extension
        assertThat(imageUrl).contains(".jpg"); 
        // We need to check for the file in the tempDir with a UUID prefix
        assertThat(Files.list(tempDir).anyMatch(path -> path.getFileName().toString().contains(".jpg"))).isTrue();
    }

    @Test
    void testUploadImage_emptyFile() {
        String originalFileName = "empty.png";
        MockMultipartFile file = new MockMultipartFile(
                "file",
                originalFileName,
                "image/png",
                new byte[0]
        );

        assertThrows(IOException.class, () -> imageUploadService.uploadImage(file));
    }
}
