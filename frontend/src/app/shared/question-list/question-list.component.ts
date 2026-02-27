import { Component, OnInit, Input } from '@angular/core';
import { Question, QuestionService } from '../../core/question.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {
  @Input() productId: number | undefined; // Optional input for product-specific questions
  questions: Question[] = [];
  answerForm: FormGroup;
  selectedQuestionId: number | null = null;

  constructor(
    private questionService: QuestionService,
    private fb: FormBuilder
  ) {
    this.answerForm = this.fb.group({
      answerText: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.productId) {
      this.questionService.getQuestionsForProduct(this.productId).subscribe(questions => {
        this.questions = questions;
      });
    } else {
      // For admin view, fetch all questions
      this.questionService.getAllQuestions().subscribe(questions => {
        this.questions = questions;
      });
    }
  }

  toggleAnswerForm(questionId: number): void {
    this.selectedQuestionId = this.selectedQuestionId === questionId ? null : questionId;
    if (this.selectedQuestionId === questionId && this.answerForm) {
      this.answerForm.reset();
    }
  }

  submitAnswer(questionId: number): void {
    if (this.answerForm.valid) {
      const answerText = this.answerForm.value.answerText;
      this.questionService.answerQuestion(questionId, answerText).subscribe(() => {
        // Refresh questions after answering
        if (this.productId) {
          this.questionService.getQuestionsForProduct(this.productId).subscribe(questions => {
            this.questions = questions;
          });
        } else {
          this.questionService.getAllQuestions().subscribe(questions => {
            this.questions = questions;
          });
        }
        this.selectedQuestionId = null; // Close the form
      });
    }
  }
}
