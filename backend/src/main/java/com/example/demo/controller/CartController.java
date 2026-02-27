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

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public static final String CART_SESSION_KEY = "cartSessionId";

    @GetMapping
    public ResponseEntity<Cart> getCart(HttpSession session) {
        String sessionId = session.getId();
        Optional<Cart> cart = cartRepository.findBySessionId(sessionId);
        return cart.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Cart> addProductToCart(@PathVariable Long productId, @RequestParam(defaultValue = "1") int quantity, HttpSession session) {
        String sessionId = session.getId();
        Cart cart = cartRepository.findBySessionId(sessionId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setSessionId(sessionId);
            return cartRepository.save(newCart);
        });

        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Product product = optionalProduct.get();

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItemRepository.save(cartItem);
        } else {
            CartItem newCartItem = new CartItem();
            newCartItem.setProduct(product);
            newCartItem.setQuantity(quantity);
            newCartItem.setCart(cart);
            cart.getItems().add(newCartItem);
        }

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<Cart> updateCartItemQuantity(@PathVariable Long productId, @RequestParam int quantity, HttpSession session) {
        String sessionId = session.getId();
        Optional<Cart> optionalCart = cartRepository.findBySessionId(sessionId);
        if (optionalCart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Cart cart = optionalCart.get();

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingCartItem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        CartItem cartItem = existingCartItem.get();
        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeProductFromCart(@PathVariable Long productId, HttpSession session) {
        String sessionId = session.getId();
        Optional<Cart> optionalCart = cartRepository.findBySessionId(sessionId);
        if (optionalCart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Cart cart = optionalCart.get();

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingCartItem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        CartItem cartItem = existingCartItem.get();
        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem); // Also delete from repository

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @PostMapping("/clear")
    public ResponseEntity<Cart> clearCart(HttpSession session) {
        String sessionId = session.getId();
        Optional<Cart> optionalCart = cartRepository.findBySessionId(sessionId);
        if (optionalCart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Cart cart = optionalCart.get();
        cart.getItems().clear();
        cartItemRepository.deleteAll(cart.getItems()); // Clear items from repository
        return ResponseEntity.ok(cartRepository.save(cart));
    }
}
