import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuestionService, Question } from './question.service';
import { HttpHeaders } from '@angular/common/http';

describe('QuestionService', () => {
  let service: QuestionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuestionService]
    });
    service = TestBed.inject(QuestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should ask a question', () => {
    const newQuestion: Question = { productId: 1, questionText: 'Test Question' };
    const mockQuestion: Question = { id: 1, askedDate: new Date(), ...newQuestion };

    service.askQuestion(newQuestion).subscribe(question => {
      expect(question).toEqual(mockQuestion);
    });

    const req = httpMock.expectOne('/api/questions');
    expect(req.request.method).toBe('POST');
    req.flush(mockQuestion);
  });

  it('should get questions for a product', () => {
    const mockQuestions: Question[] = [
      { id: 1, productId: 1, questionText: 'Q1' },
      { id: 2, productId: 1, questionText: 'Q2' }
    ];

    service.getQuestionsForProduct(1).subscribe(questions => {
      expect(questions.length).toBe(2);
      expect(questions).toEqual(mockQuestions);
    });

    const req = httpMock.expectOne('/api/questions/product/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockQuestions);
  });

  it('should answer a question', () => {
    const questionId = 1;
    const answerText = 'Test Answer';
    const mockAnsweredQuestion: Question = { id: 1, productId: 1, questionText: 'Q1', answerText: 'Test Answer', answeredDate: new Date() };

    service.answerQuestion(questionId, answerText).subscribe(question => {
      expect(question).toEqual(mockAnsweredQuestion);
    });

    const req = httpMock.expectOne(`/api/questions/${questionId}/answer`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe('text/plain');
    req.flush(mockAnsweredQuestion);
  });

  it('should get all questions', () => {
    const mockQuestions: Question[] = [
      { id: 1, productId: 1, questionText: 'Q1' },
      { id: 2, productId: 2, questionText: 'Q2' }
    ];

    service.getAllQuestions().subscribe(questions => {
      expect(questions.length).toBe(2);
      expect(questions).toEqual(mockQuestions);
    });

    const req = httpMock.expectOne('/api/questions');
    expect(req.request.method).toBe('GET');
    req.flush(mockQuestions);
  });
});
