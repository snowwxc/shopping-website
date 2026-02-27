package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.CheckoutService; // Import CheckoutService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession; // Import HttpSession

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CheckoutService checkoutService; // Inject CheckoutService

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Only admin can view all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only admin can view specific order
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/checkout") // Endpoint for creating orders
    public ResponseEntity<Order> checkout(@RequestParam String customerName, @RequestParam String customerAddress, HttpSession session) {
        String sessionId = session.getId();
        Optional<Order> order = checkoutService.createOrderFromCart(sessionId, customerName, customerAddress);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.badRequest().build());
    }
}
