import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { AskQuestionComponent } from './ask-question.component';
import { QuestionService, Question } from '../../core/question.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AskQuestionComponent', () => {
  let component: AskQuestionComponent;
  let fixture: ComponentFixture<AskQuestionComponent>;
  let questionService: jasmine.SpyObj<QuestionService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockQuestion: Question = { productId: 1, questionText: 'Test Question' };

  beforeEach(async () => {
    const questionServiceSpy = jasmine.createSpyObj('QuestionService', ['askQuestion']);
    questionServiceSpy.askQuestion.and.returnValue(of(mockQuestion));

    await TestBed.configureTestingModule({
      declarations: [AskQuestionComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: QuestionService, useValue: questionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AskQuestionComponent);
    component = fixture.componentInstance;
    questionService = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize productId from route params', () => {
    fixture.detectChanges();
    expect(component.productId).toBe(1);
  });

  it('should call askQuestion on submit and navigate', () => {
    fixture.detectChanges();
    component.questionForm.patchValue({ questionText: 'New Question' });
    component.onSubmit();
    expect(questionService.askQuestion).toHaveBeenCalledWith({ productId: 1, questionText: 'New Question' });
    expect(router.navigate).toHaveBeenCalledWith(['/products', 1]);
  });

  it('should navigate on cancel', () => {
    fixture.detectChanges();
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/products', 1]);
  });
});
