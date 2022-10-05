import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment as env } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class PaymentService {
  authorizeURL: string; // Authorize.net
  apiURL: string; // API

  constructor(private http: HttpClient) {
    this.authorizeURL = env.authorizeURL;
    this.apiURL = env.APIUrl + '/api/payment'
  }

  authorizeCC(paramDetails: any): Observable<any> {
    return this.http.post(this.authorizeURL, paramDetails);
  }

  debitamountFromBank(paramDetails: any): Observable<any> {
    return this.http.post(this.authorizeURL, paramDetails);
  }

  CreditamountToBank(paramDetails: any): Observable<any> {
    return this.http.post(this.authorizeURL, paramDetails);
  }

  storePaymentTransId(data: any): Observable<any> {
    return this.http.post(this.apiURL, data)
  }

  getPaymentTransId(): Observable<any> {
    return this.http.get(this.apiURL);
  }
}