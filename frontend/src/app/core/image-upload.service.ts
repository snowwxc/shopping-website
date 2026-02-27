import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private apiUrl = '/api/images'; // Backend API for image upload

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl + '/upload', formData, {responseType: 'text'});
  }
}
