package com.example.demo.controller;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger; // Import Logger
import org.slf4j.LoggerFactory; // Import LoggerFactory


import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class); // Logger instance

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public static final String CART_SESSION_KEY = "cartSessionId";

    @GetMapping
    public ResponseEntity<Cart> getCart(HttpSession session) {
        logger.info("Fetching cart for session id: {}", session.getId()); // Log
        String sessionId = session.getId();
        Optional<Cart> cart = cartRepository.findBySessionId(sessionId);
        return cart.map(c -> {
            logger.info("Found cart with {} items for session: {}", c.getItems().size(), sessionId); // Log
            return ResponseEntity.ok(c);
        }).orElseGet(() -> {
            logger.warn("Cart not found for session id: {}", sessionId); // Log
            return ResponseEntity.notFound().build();
        });
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Cart> addProductToCart(@PathVariable Long productId, @RequestParam(defaultValue = "1") int quantity, HttpSession session) {
        logger.info("Adding product {} with quantity {} to cart for session id: {}", productId, quantity, session.getId()); // Log
        String sessionId = session.getId();
        Cart cart = cartRepository.findBySessionId(sessionId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setSessionId(sessionId);
            logger.info("Created new cart for session id: {}", sessionId); // Log
            return cartRepository.save(newCart);
        });

        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            logger.warn("Product with id: {} not found when adding to cart.", productId); // Log
            return ResponseEntity.badRequest().build();
        }
        Product product = optionalProduct.get();

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        int currentQuantity = existingCartItem.map(CartItem::getQuantity).orElse(0);
        if (currentQuantity + quantity > product.getStock()) {
            logger.warn("Insufficient stock for product id {}. Requested: {}, Available: {}", productId, currentQuantity + quantity, product.getStock());
            return ResponseEntity.badRequest().build();
        }

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItemRepository.save(cartItem);
            logger.info("Updated quantity for product {} in cart {}.", productId, cart.getId()); // Log
        } else {
            CartItem newCartItem = new CartItem();
            newCartItem.setProduct(product);
            newCartItem.setQuantity(quantity);
            newCartItem.setCart(cart);
            cart.getItems().add(newCartItem);
            logger.info("Added new product {} to cart {}.", productId, cart.getId()); // Log
        }

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<Cart> updateCartItemQuantity(@PathVariable Long productId, @RequestParam int quantity, HttpSession session) {
        logger.info("Updating quantity of product {} to {} in cart for session id: {}", productId, quantity, session.getId()); // Log
        String sessionId = session.getId();
        Optional<Cart> optionalCart = cartRepository.findBySessionId(sessionId);
        if (optionalCart.isEmpty()) {
            logger.warn("Cart not found for session id: {} when updating quantity.", sessionId); // Log
            return ResponseEntity.notFound().build();
        }
        Cart cart = optionalCart.get();

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingCartItem.isEmpty()) {
            logger.warn("Cart item for product {} not found in cart {} when updating quantity.", productId, cart.getId()); // Log
            return ResponseEntity.notFound().build();
        }
        
        CartItem cartItem = existingCartItem.get();
        if (quantity > cartItem.getProduct().getStock()) {
            logger.warn("Insufficient stock for product id {}. Requested: {}, Available: {}", productId, quantity, cartItem.getProduct().getStock());
            return ResponseEntity.badRequest().build();
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        logger.info("Updated product {} quantity to {} in cart {}.", productId, quantity, cart.getId()); // Log

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeProductFromCart(@PathVariable Long productId, HttpSession session) {
        logger.info("Removing product {} from cart for session id: {}", productId, session.getId()); // Log
        String sessionId = session.getId();
        Optional<Cart> optionalCart = cartRepository.findBySessionId(sessionId);
        if (optionalCart.isEmpty()) {
            logger.warn("Cart not found for session id: {} when removing product.", sessionId); // Log
            return ResponseEntity.notFound().build();
        }
        Cart cart = optionalCart.get();

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingCartItem.isEmpty()) {
            logger.warn("Cart item for product {} not found in cart {} when removing.", productId, cart.getId()); // Log
            return ResponseEntity.notFound().build();
        }
        CartItem cartItem = existingCartItem.get();
        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem); // Also delete from repository
        logger.info("Removed product {} from cart {}.", productId, cart.getId()); // Log

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @PostMapping("/clear")
    public ResponseEntity<Cart> clearCart(HttpSession session) {
        logger.info("Clearing cart for session id: {}", session.getId()); // Log
        String sessionId = session.getId();
        Optional<Cart> optionalCart = cartRepository.findBySessionId(sessionId);
        if (optionalCart.isEmpty()) {
            logger.warn("Cart not found for session id: {} when clearing cart.", sessionId); // Log
            return ResponseEntity.notFound().build();
        }
        Cart cart = optionalCart.get();
        cart.getItems().clear();
        cartItemRepository.deleteAll(cart.getItems()); // Clear items from repository
        logger.info("Cart {} cleared for session id: {}", cart.getId(), sessionId); // Log
        return ResponseEntity.ok(cartRepository.save(cart));
    }
}
