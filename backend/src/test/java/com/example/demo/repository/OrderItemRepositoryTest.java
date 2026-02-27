package com.example.demo.repository;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
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
public class OrderItemRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private OrderItemRepository orderItemRepository;

    private Order order;
    private Product product;

    @BeforeEach
    public void setup() {
        product = new Product();
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(10.0);
        product.setStock(100);
        entityManager.persist(product);

        order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setCustomerName("Test Customer");
        order.setCustomerAddress("123 Test St");
        order.setTotalAmount(10.0);
        entityManager.persist(order);

        entityManager.flush();
    }

    @Test
    public void whenFindById_thenReturnOrderItem() {
        // given
        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(1);
        orderItem.setPrice(product.getPrice());
        orderItem.setOrder(order);
        entityManager.persist(orderItem);
        entityManager.flush();

        // when
        Optional<OrderItem> found = orderItemRepository.findById(orderItem.getId());

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getProduct().getName()).isEqualTo(product.getName());
    }
}
