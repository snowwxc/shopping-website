import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService, Question } from '../../core/question.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {
  questionForm: FormGroup;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService
  ) {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required]
    });
  }

  // Getter for easy access to form controls
  get questionText() { return this.questionForm.get('questionText'); }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
      } else {
        // Handle case where no product ID is provided (e.g., redirect to home)
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(): void {
    if (this.questionForm.valid && this.productId !== null) {
      const newQuestion: Question = {
        productId: this.productId,
        questionText: this.questionForm.value.questionText
      };
      this.questionService.askQuestion(newQuestion).subscribe(() => {
        console.log('Question asked successfully!');
        this.router.navigate(['/products', this.productId]); // Navigate back to product detail page
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products', this.productId]); // Navigate back to product detail page
  }
}
