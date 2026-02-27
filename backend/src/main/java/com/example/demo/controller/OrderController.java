package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.CheckoutService; // Import CheckoutService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession; // Import HttpSession
import org.slf4j.Logger; // Import Logger
import org.slf4j.LoggerFactory; // Import LoggerFactory


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class); // Logger instance

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CheckoutService checkoutService; // Inject CheckoutService

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Only admin can view all orders
    public List<Order> getAllOrders() {
        logger.info("Fetching all orders"); // Log
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only admin can view specific order
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        logger.info("Fetching order with id: {}", id); // Log
        Optional<Order> order = orderRepository.findById(id);
        return order.map(o -> {
            logger.info("Found order: {}", o.getId()); // Log
            return ResponseEntity.ok(o);
        }).orElseGet(() -> {
            logger.warn("Order with id: {} not found", id); // Log
            return ResponseEntity.notFound().build();
        });
    }

    @PostMapping("/checkout") // Endpoint for creating orders
    public ResponseEntity<Order> checkout(@RequestParam String customerName, @RequestParam String customerAddress, HttpSession session) {
        logger.info("Checkout request for customer: {} to address: {}", customerName, customerAddress); // Log
        String sessionId = session.getId();
        Optional<Order> order = checkoutService.createOrderFromCart(sessionId, customerName, customerAddress);
        return order.map(o -> {
            logger.info("Order {} created successfully for customer: {}", o.getId(), customerName); // Log
            return ResponseEntity.ok(o);
        }).orElseGet(() -> {
            logger.error("Failed to create order for customer: {} (cart empty or not found)", customerName); // Log
            return ResponseEntity.badRequest().build();
        });
    }
}
