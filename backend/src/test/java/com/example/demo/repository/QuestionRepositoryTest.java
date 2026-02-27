package com.example.demo.repository;

import com.example.demo.entity.Question;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class QuestionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private QuestionRepository questionRepository;

    @Test
    public void whenFindByProductId_thenReturnQuestions() {
        // given
        Long productId = 1L;
        Question q1 = new Question();
        q1.setProductId(productId);
        q1.setQuestionText("Question 1 for product 1");
        q1.setAskedDate(LocalDateTime.now());
        entityManager.persist(q1);

        Question q2 = new Question();
        q2.setProductId(productId);
        q2.setQuestionText("Question 2 for product 1");
        q2.setAskedDate(LocalDateTime.now());
        entityManager.persist(q2);

        Question q3 = new Question(); // For a different product
        q3.setProductId(2L);
        q3.setQuestionText("Question for product 2");
        q3.setAskedDate(LocalDateTime.now());
        entityManager.persist(q3);
        entityManager.flush();

        // when
        List<Question> foundQuestions = questionRepository.findByProductId(productId);

        // then
        assertThat(foundQuestions).hasSize(2);
        assertThat(foundQuestions.get(0).getQuestionText()).isEqualTo(q1.getQuestionText());
        assertThat(foundQuestions.get(1).getQuestionText()).isEqualTo(q2.getQuestionText());
    }

    @Test
    public void whenSaveQuestion_thenQuestionIsPersisted() {
        Question question = new Question();
        question.setProductId(1L);
        question.setQuestionText("New Question");
        question.setAskedDate(LocalDateTime.now());
        entityManager.persist(question);
        entityManager.flush();

        Optional<Question> found = questionRepository.findById(question.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getQuestionText()).isEqualTo("New Question");
    }
}
