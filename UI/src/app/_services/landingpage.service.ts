import { environment } from "../../environments/environment";
import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WINDOW } from '../window.providers';
import { LandingPage } from "../types/landingPage.type";
import { LandingTemplate } from "../types/landingTemplate.type";
@Injectable({ providedIn: "root" })
export class LandinPageService {
  Api_url: string;
  Email_Api_url: string;
  constructor(@Inject(WINDOW) private window: Window, private http: HttpClient) {
    this.Api_url = environment.APIUrl;
  }

  getLandingPages(email = ''): Observable<LandingPage[]> {
    let url = this.Api_url + `/api/landing/page?` + new URLSearchParams({ email })
    return this.http.get<LandingPage[]>(url);
  }

  addLandingPage(formDetails: any): Observable<LandingPage> {
    const url = this.Api_url + '/api/landing/page'
    return this.http.post<LandingPage>(url, formDetails);
  }

  updateLandingPage(formDetails: FormData | object, pageId: string): Observable<LandingPage> {
    const url = this.Api_url + `/api/landing/page/${pageId}`
    return this.http.put<LandingPage>(url, formDetails);
  }

  addLandingTemplate(formDetails: any): Observable<LandingTemplate> {
    const url = this.Api_url + '/api/landing/template'
    return this.http.post<LandingTemplate>(url, formDetails);
  }
  
  getLandingTemplates(): Observable<LandingTemplate[]> {
    const url = this.Api_url + '/api/landing/template'
    return this.http.get<LandingTemplate[]>(url);
  }

  updateLandingTemplate(formDetails: any): Observable<LandingTemplate> {
    const url = this.Api_url + `/api/updateLandingTemplateDetails/${formDetails.id}`
    return this.http.put<LandingTemplate>(url, formDetails);
  }

  getHostname(): string {
    return this.window.location.hostname;
  }
}
