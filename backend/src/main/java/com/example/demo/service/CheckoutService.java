package com.example.demo.service;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CheckoutService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Transactional
    public Optional<Order> createOrderFromCart(String sessionId, String customerName, String customerAddress) {
        Optional<Cart> optionalCart = cartRepository.findBySessionId(sessionId);
        if (optionalCart.isEmpty() || optionalCart.get().getItems().isEmpty()) {
            return Optional.empty(); // Cart is empty or not found
        }

        Cart cart = optionalCart.get();

        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setCustomerName(customerName);
        order.setCustomerAddress(customerAddress);
        
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice()); // Capture price at time of order
            orderItem.setOrder(order);
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);
        double totalAmount = orderItems.stream()
                .mapToDouble(item -> item.getQuantity() * item.getPrice())
                .sum();
        order.setTotalAmount(totalAmount);

        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        // Clear the cart after order creation
        cart.getItems().clear();
        cartRepository.save(cart);

        return Optional.of(order);
    }
}
