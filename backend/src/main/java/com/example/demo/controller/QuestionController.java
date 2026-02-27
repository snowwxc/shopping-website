package com.example.demo.controller;

import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger; // Import Logger
import org.slf4j.LoggerFactory; // Import LoggerFactory


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private static final Logger logger = LoggerFactory.getLogger(QuestionController.class); // Logger instance

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping
    public Question askQuestion(@RequestBody Question question) {
        logger.info("Asking question for product {}: {}", question.getProductId(), question.getQuestionText()); // Log
        question.setAskedDate(LocalDateTime.now());
        return questionRepository.save(question);
    }

    @GetMapping("/product/{productId}")
    public List<Question> getQuestionsForProduct(@PathVariable Long productId) {
        logger.info("Fetching questions for product id: {}", productId); // Log
        return questionRepository.findByProductId(productId);
    }

    @PutMapping("/{id}/answer")
    @PreAuthorize("hasRole('ADMIN')") // Only admin can answer questions
    public ResponseEntity<Question> answerQuestion(@PathVariable Long id, @RequestBody String answerText) {
        logger.info("Answering question with id: {} with answer: {}", id, answerText); // Log
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            question.setAnswerText(answerText);
            question.setAnsweredDate(LocalDateTime.now());
            logger.info("Question with id: {} answered successfully", id); // Log
            return ResponseEntity.ok(questionRepository.save(question));
        } else {
            logger.warn("Question with id: {} not found for answering", id); // Log
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Only admin can view all questions
    public List<Question> getAllQuestions() {
        logger.info("Fetching all questions (admin view)"); // Log
        return questionRepository.findAll();
    }
}
