import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id?: number;
  productId: number;
  questionText: string;
  answerText?: string;
  askedDate?: Date;
  answeredDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = '/api/questions'; // Proxy will redirect this to the backend

  constructor(private http: HttpClient) { }

  askQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  getQuestionsForProduct(productId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/product/${productId}`);
  }

  answerQuestion(id: number, answerText: string): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}/answer`, answerText, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }
}
