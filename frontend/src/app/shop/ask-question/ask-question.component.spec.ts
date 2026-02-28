import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { AskQuestionComponent } from './ask-question.component';
import { ProductService } from '../../core/product.service';
import { QuestionService } from '../../core/question.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AskQuestionComponent', () => {
  let component: AskQuestionComponent;
  let fixture: ComponentFixture<AskQuestionComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let questionService: jasmine.SpyObj<QuestionService>;
  let router: Router;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    productServiceSpy.getProduct.and.returnValue(of({ id: 1, name: 'Test' }));
    const questionServiceSpy = jasmine.createSpyObj('QuestionService', ['askQuestion']);
    questionServiceSpy.askQuestion.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [ AskQuestionComponent ],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: QuestionService, useValue: questionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskQuestionComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    questionService = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize productId from route params', () => {
    expect(component.productId).toBe(1);
  });

  it('should call askQuestion on submit and navigate', () => {
    component.questionForm.setValue({ questionText: 'Test question' });
    component.onSubmit();
    expect(questionService.askQuestion).toHaveBeenCalledWith({
      productId: 1,
      questionText: 'Test question'
    });
    // The component navigates to /shop/product/:id
    expect(router.navigate).toHaveBeenCalledWith(['/shop/product', 1]);
  });

  it('should navigate on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/shop/product', 1]);
  });
});
