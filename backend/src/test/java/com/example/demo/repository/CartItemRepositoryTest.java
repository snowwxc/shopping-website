package com.example.demo.repository;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class CartItemRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CartItemRepository cartItemRepository;

    private Product product;
    private Cart cart;

    @BeforeEach
    public void setup() {
        product = new Product();
        product.setName("Test Product");
        product.setDescription("Description");
        product.setPrice(10.0);
        product.setStock(100);
        entityManager.persist(product);

        cart = new Cart();
        cart.setSessionId(UUID.randomUUID().toString());
        entityManager.persist(cart);
        entityManager.flush();
    }

    @Test
    public void whenFindById_thenReturnCartItem() {
        // given
        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(1);
        item.setCart(cart);
        entityManager.persist(item);
        entityManager.flush();

        // when
        Optional<CartItem> found = cartItemRepository.findById(item.getId());

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getProduct().getName()).isEqualTo(product.getName());
    }
}
