package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger; // Import Logger
import org.slf4j.LoggerFactory; // Import LoggerFactory


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class); // Logger instance

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        logger.info("Fetching all products"); // Log
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        logger.info("Fetching product with id: {}", id); // Log
        Optional<Product> product = productRepository.findById(id);
        return product.map(p -> {
            logger.info("Found product: {}", p.getName()); // Log
            return ResponseEntity.ok(p);
        }).orElseGet(() -> {
            logger.warn("Product with id: {} not found", id); // Log
            return ResponseEntity.notFound().build();
        });
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        logger.info("Creating new product: {}", product.getName()); // Log
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        logger.info("Updating product with id: {}", id); // Log
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setStock(productDetails.getStock());
            logger.info("Product with id: {} updated successfully", id); // Log
            return ResponseEntity.ok(productRepository.save(product));
        } else {
            logger.warn("Product with id: {} not found for update", id); // Log
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("Deleting product with id: {}", id); // Log
        productRepository.deleteById(id);
        logger.info("Product with id: {} deleted successfully", id); // Log
        return ResponseEntity.noContent().build();
    }
}
