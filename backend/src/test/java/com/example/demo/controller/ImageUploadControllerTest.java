package com.example.demo.controller;

import com.example.demo.service.ImageUploadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.io.IOException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ImageUploadController.class)
@Import(ImageUploadControllerTest.TestSecurityConfig.class)
@WithMockUser // Assuming image upload is for authenticated users
public class ImageUploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ImageUploadService imageUploadService;

    @Test
    void testUploadImage_success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "hello.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello, World!".getBytes()
        );

        String imageUrl = "/images/hello.txt";
        when(imageUploadService.uploadImage(any())).thenReturn(imageUrl);

        mockMvc.perform(multipart("/api/images/upload")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(imageUrl));
    }

    @Test
    void testUploadImage_failure() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "error.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Error data".getBytes()
        );

        when(imageUploadService.uploadImage(any())).thenThrow(new IOException("Failed to save file"));

        mockMvc.perform(multipart("/api/images/upload")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Failed to upload image: Failed to save file"));
    }

    @TestConfiguration
    @EnableMethodSecurity
    static class TestSecurityConfig {
        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/api/images/**").authenticated() // Image upload requires authentication
                    .anyRequest().authenticated()
                );
            return http.build();
        }
    }
}
