package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageUploadService {

    private static final Logger logger = LoggerFactory.getLogger(ImageUploadService.class);
    // Dummy directory for storing uploaded images. In a real app, this would be cloud storage.
    private final Path uploadDirectory; // Changed to Path

    public ImageUploadService() {
        this(Paths.get("uploads")); // Default to "uploads" directory
    }

    public ImageUploadService(Path uploadPath) {
        this.uploadDirectory = uploadPath;
        try {
            if (!Files.exists(uploadDirectory)) {
                Files.createDirectories(uploadDirectory);
                logger.info("Created upload directory: {}", uploadDirectory.toAbsolutePath());
            }
        } catch (IOException e) {
            logger.error("Could not create upload directory", e);
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to upload empty file " + file.getOriginalFilename());
        }
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = this.uploadDirectory.resolve(fileName); // Use uploadDirectory
        Files.copy(file.getInputStream(), filePath);
        String imageUrl = "/images/" + fileName; // Dummy URL for access
        logger.info("Uploaded image: {} to {}", fileName, imageUrl);
        return imageUrl;
    }
}
