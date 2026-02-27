package com.example.demo.service;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList; // Added import for ArrayList
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CheckoutServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @InjectMocks
    private CheckoutService checkoutService;

    private String sessionId;
    private Cart cart;
    private Product product;
    private CartItem cartItem;

    @BeforeEach
    void setUp() {
        sessionId = UUID.randomUUID().toString();

        product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(10.0);
        product.setStock(10);

        cartItem = new CartItem();
        cartItem.setId(1L);
        cartItem.setProduct(product);
        cartItem.setQuantity(2);

        cart = new Cart();
        cart.setId(1L);
        cart.setSessionId(sessionId);
        cart.setItems(new ArrayList<>(Arrays.asList(cartItem)));
        cartItem.setCart(cart); // Ensure bidirectional link
    }

    @Test
    void createOrderFromCart_success() {
        when(cartRepository.findBySessionId(sessionId)).thenReturn(Optional.of(cart));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(1L); // Simulate ID generation
            return order;
        });
        when(orderItemRepository.saveAll(anyList())).thenReturn(Collections.emptyList());

        Optional<Order> order = checkoutService.createOrderFromCart(sessionId, "Test Customer", "Test Address");

        assertThat(order).isPresent();
        assertThat(order.get().getCustomerName()).isEqualTo("Test Customer");
        assertThat(order.get().getTotalAmount()).isEqualTo(20.0);
        assertThat(order.get().getOrderItems()).hasSize(1);
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(orderItemRepository, times(1)).saveAll(anyList());
        verify(cartRepository, times(1)).save(any(Cart.class)); // Verify cart cleared
        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void createOrderFromCart_cartNotFound() {
        when(cartRepository.findBySessionId(sessionId)).thenReturn(Optional.empty());

        Optional<Order> order = checkoutService.createOrderFromCart(sessionId, "Test Customer", "Test Address");

        assertThat(order).isEmpty();
        verify(orderRepository, never()).save(any(Order.class));
        verify(orderItemRepository, never()).saveAll(anyList());
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    void createOrderFromCart_cartEmpty() {
        cart.setItems(Collections.emptyList());
        when(cartRepository.findBySessionId(sessionId)).thenReturn(Optional.of(cart));

        Optional<Order> order = checkoutService.createOrderFromCart(sessionId, "Test Customer", "Test Address");

        assertThat(order).isEmpty();
        verify(orderRepository, never()).save(any(Order.class));
        verify(orderItemRepository, never()).saveAll(anyList());
        verify(cartRepository, never()).save(any(Cart.class));
    }
}
