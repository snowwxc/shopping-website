package com.example.demo.controller;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@WebMvcTest(CartController.class)
@Import(CartControllerTest.TestSecurityConfig.class)
@WithMockUser // All cart operations are for authenticated users (even if anonymous)
public class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CartRepository cartRepository;

    @MockBean
    private CartItemRepository cartItemRepository;

    @MockBean
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Product testProduct;
    private Cart testCart;
    private CartItem testCartItem;
    private String testSessionId;

    @BeforeEach
    void setUp() {
        testSessionId = UUID.randomUUID().toString();

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(10.0);
        testProduct.setStock(10);

        testCart = new Cart();
        testCart.setId(1L);
        testCart.setSessionId(testSessionId);

        testCartItem = new CartItem();
        testCartItem.setId(1L);
        testCartItem.setProduct(testProduct);
        testCartItem.setQuantity(1);
        testCartItem.setCart(testCart);

        testCart.setItems(new ArrayList<>(Collections.singletonList(testCartItem)));
    }

    private MockHttpServletRequestBuilder requestBuilder(MockHttpServletRequestBuilder builder) {
        return builder.sessionAttr(CartController.CART_SESSION_KEY, testSessionId)
                .with(csrf());
    }

    @Test
    void testGetCart() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.of(testCart));

        mockMvc.perform(requestBuilder(get("/api/cart")))
                .andDo(print()) // Print response
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists()); // Check for cart ID existence
    }

    @Test
    void testGetCartNotFound() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(requestBuilder(get("/api/cart")))
                .andExpect(status().isNotFound());
    }

    @Test
    void testAddProductToNewCart() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.empty());
        when(productRepository.findById(any(Long.class))).thenReturn(Optional.of(testProduct));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart); // New cart with product

        mockMvc.perform(requestBuilder(post("/api/cart/add/1")))
                .andDo(print()) // Print response
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists()); // Check for cart ID existence
        verify(cartRepository, times(2)).save(any(Cart.class)); // Verify cart save
    }

    @Test
    void testAddProductToExistingCart() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.of(testCart));
        when(productRepository.findById(any(Long.class))).thenReturn(Optional.of(testProduct));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart); // Updated cart
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(testCartItem); // Updated item

        mockMvc.perform(requestBuilder(post("/api/cart/add/1")))
                .andDo(print()) // Print response
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists()); // Check for cart ID existence
        verify(cartItemRepository).save(any(CartItem.class)); // Verify item update
    }

    @Test
    void testAddProductToCartProductNotFound() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.of(testCart));
        when(productRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        mockMvc.perform(requestBuilder(post("/api/cart/add/999")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateCartItemQuantity() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(testCartItem);

        mockMvc.perform(requestBuilder(put("/api/cart/update/1").param("quantity", "2")))
                .andExpect(status().isOk());
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void testUpdateCartItemQuantityCartNotFound() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(requestBuilder(put("/api/cart/update/1").param("quantity", "2")))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateCartItemQuantityItemNotFound() throws Exception {
        testCart.setItems(Collections.emptyList()); // No items in cart
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.of(testCart));

        mockMvc.perform(requestBuilder(put("/api/cart/update/1").param("quantity", "2")))
                .andExpect(status().isNotFound());
    }


    @Test
    void testRemoveProductFromCart() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart); // Updated cart
        // Mocking delete is tricky with void methods, just verify interaction
        // when(cartItemRepository.delete(any(CartItem.class))).thenReturn(null);

        mockMvc.perform(requestBuilder(delete("/api/cart/remove/1")))
                .andExpect(status().isOk());
        verify(cartItemRepository).delete(any(CartItem.class));
    }

    @Test
    void testRemoveProductFromCartNotFound() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(requestBuilder(delete("/api/cart/remove/1")))
                .andExpect(status().isNotFound());
    }

    @Test
    void testRemoveProductFromCartItemNotFound() throws Exception {
        testCart.setItems(Collections.emptyList()); // No items in cart
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.of(testCart));

        mockMvc.perform(requestBuilder(delete("/api/cart/remove/1")))
                .andExpect(status().isNotFound());
    }

    @Test
    void testClearCart() throws Exception {
        when(cartRepository.findBySessionId(anyString())).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        mockMvc.perform(requestBuilder(post("/api/cart/clear")))
                .andExpect(status().isOk());
        verify(cartItemRepository).deleteAll(any());
    }

    @TestConfiguration
    @EnableMethodSecurity
    static class TestSecurityConfig {
        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for test for simplicity
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers("/api/cart/**").permitAll() // Allow unauthenticated access to cart endpoints
                    .anyRequest().authenticated()
                );
            return http.build();
        }
    }
}
