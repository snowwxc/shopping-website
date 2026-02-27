import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuestionListComponent } from './question-list.component';
import { Question } from '../../core/question.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuestionService } from '../../core/question.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;
  let questionService: jasmine.SpyObj<QuestionService>;

  const mockQuestions: Question[] = [
    { id: 1, productId: 1, questionText: 'Q1', askedDate: new Date() },
    { id: 2, productId: 1, questionText: 'Q2', answerText: 'A2', answeredDate: new Date(), askedDate: new Date() }
  ];

  beforeEach(async () => {
    const questionServiceSpy = jasmine.createSpyObj('QuestionService', ['getAllQuestions', 'getQuestionsForProduct', 'answerQuestion']);
    questionServiceSpy.getAllQuestions.and.returnValue(of(mockQuestions));
    questionServiceSpy.getQuestionsForProduct.and.returnValue(of(mockQuestions));
    questionServiceSpy.answerQuestion.and.returnValue(of(mockQuestions[0]));

    await TestBed.configureTestingModule({
      declarations: [QuestionListComponent],
      imports: [
        MatExpansionModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: QuestionService, useValue: questionServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    questionService = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all questions if no productId is provided', fakeAsync(() => {
    expect(questionService.getAllQuestions).toHaveBeenCalled();
    tick();
    expect(component.questions).toEqual(mockQuestions);
  }));

  it('should fetch product-specific questions if productId is provided', fakeAsync(() => {
    component.productId = 1;
    component.ngOnInit(); // Manually call ngOnInit to re-trigger data fetch
    expect(questionService.getQuestionsForProduct).toHaveBeenCalledWith(1);
    tick();
    expect(component.questions).toEqual(mockQuestions);
  }));

  it('should toggle answer form visibility', () => {
    component.toggleAnswerForm(1);
    expect(component.selectedQuestionId).toBe(1);
    component.toggleAnswerForm(1);
    expect(component.selectedQuestionId).toBeNull();
  });

  it('should submit answer and refresh questions', fakeAsync(() => {
    component.questions = mockQuestions; // Initialize questions
    component.selectedQuestionId = 1;
    component.answerForm.patchValue({ answerText: 'New Answer' });
    component.submitAnswer(1);

    expect(questionService.answerQuestion).toHaveBeenCalledWith(1, 'New Answer');
    tick();
    expect(questionService.getAllQuestions).toHaveBeenCalledTimes(2); // Initial and refresh
    expect(component.selectedQuestionId).toBeNull();
  }));
});
