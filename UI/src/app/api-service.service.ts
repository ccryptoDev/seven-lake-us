import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient) { }

  saveUser(data: object) {
    return this.http.post('http://localhost:8082/api/user/createAgent', data);
  }



  postData(token, query): Observable<any> {
    const url = `${environment.APIUrl}/api/leads/zohoAddLeads?code=${token}`;
    return this.http.post<any>(url, query)
      .pipe(
        catchError(err => this.handleError(err)));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = error.error.msg;
    }
    return throwError(errorMessage);
  }
}
