package com.example.demo.repository;

import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class OrderRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private OrderRepository orderRepository;

    private Product product;

    @BeforeEach
    public void setup() {
        product = new Product();
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(10.0);
        product.setStock(100);
        entityManager.persist(product);
        entityManager.flush();
    }

    @Test
    public void whenFindById_thenReturnOrder() {
        // given
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setCustomerName("Test Customer");
        order.setCustomerAddress("123 Test St");
        order.setTotalAmount(100.0);
        entityManager.persist(order);
        entityManager.flush();

        // when
        Optional<Order> found = orderRepository.findById(order.getId());

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getCustomerName()).isEqualTo(order.getCustomerName());
    }

    @Test
    public void whenSaveOrderWithItems_thenItemsArePersisted() {
        // This test requires OrderItem entity to be available and correctly configured
        // Will be implemented after OrderItemRepositoryTest
    }
}
