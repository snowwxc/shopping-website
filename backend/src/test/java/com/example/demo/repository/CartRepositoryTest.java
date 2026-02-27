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
public class CartRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CartRepository cartRepository;

    private Product product;

    @BeforeEach
    public void setup() {
        product = new Product();
        product.setName("Test Product");
        product.setDescription("Description");
        product.setPrice(10.0);
        product.setStock(100);
        entityManager.persist(product);
        entityManager.flush();
    }

    @Test
    public void whenFindBySessionId_thenReturnCart() {
        // given
        String sessionId = UUID.randomUUID().toString();
        Cart cart = new Cart();
        cart.setSessionId(sessionId);
        entityManager.persist(cart);
        entityManager.flush();

        // when
        Optional<Cart> found = cartRepository.findBySessionId(sessionId);

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getSessionId()).isEqualTo(sessionId);
    }

    @Test
    public void whenSaveCartWithItems_thenItemsArePersisted() {
        // given
        String sessionId = UUID.randomUUID().toString();
        Cart cart = new Cart();
        cart.setSessionId(sessionId);
        entityManager.persist(cart);

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(2);
        item.setCart(cart);
        cart.getItems().add(item);

        entityManager.persist(item);
        entityManager.flush();

        // when
        Optional<Cart> foundCart = cartRepository.findBySessionId(sessionId);

        // then
        assertThat(foundCart).isPresent();
        assertThat(foundCart.get().getItems()).hasSize(1);
        assertThat(foundCart.get().getItems().get(0).getProduct().getName()).isEqualTo(product.getName());
    }
}
