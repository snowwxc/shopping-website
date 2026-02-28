import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService, Question } from '../../core/question.service';
import { ProductService, Product } from '../../core/product.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css']
})
export class AskQuestionComponent implements OnInit {
  questionForm: FormGroup;
  productId: number | null = null;
  product: Product | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private productService: ProductService
  ) {
    this.questionForm = this.fb.group({
      questionText: ['', Validators.required]
    });
  }

  get questionText() { return this.questionForm.get('questionText'); }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.productService.getProduct(this.productId).subscribe(product => {
          this.product = product;
        });
      } else {
        this.router.navigate(['/shop/products']);
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
        this.router.navigate(['/shop/product', this.productId]);
      });
    }
  }

  cancel(): void {
    if (this.productId) {
      this.router.navigate(['/shop/product', this.productId]);
    } else {
      this.router.navigate(['/shop/products']);
    }
  }
}
