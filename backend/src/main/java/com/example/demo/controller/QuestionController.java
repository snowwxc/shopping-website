package com.example.demo.controller;

import com.example.demo.entity.Question;
import com.example.demo.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping
    public Question askQuestion(@RequestBody Question question) {
        question.setAskedDate(LocalDateTime.now());
        return questionRepository.save(question);
    }

    @GetMapping("/product/{productId}")
    public List<Question> getQuestionsForProduct(@PathVariable Long productId) {
        return questionRepository.findByProductId(productId);
    }

    @PutMapping("/{id}/answer")
    @PreAuthorize("hasRole('ADMIN')") // Only admin can answer questions
    public ResponseEntity<Question> answerQuestion(@PathVariable Long id, @RequestBody String answerText) {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            question.setAnswerText(answerText);
            question.setAnsweredDate(LocalDateTime.now());
            return ResponseEntity.ok(questionRepository.save(question));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Only admin can view all questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
}
