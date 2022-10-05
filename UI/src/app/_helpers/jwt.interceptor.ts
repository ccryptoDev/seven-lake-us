import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, switchMap, tap } from "rxjs/operators";
import { UserService } from "../_services";
import { environment } from "src/environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  token: string;

  getToken(): Observable<any> {
    const token = localStorage.getItem('accessToken')
    const expiresIn = localStorage.getItem('expiresIn')

    const currentDate = new Date()
    const expiresDate = new Date(expiresIn)

    if (token && expiresIn && expiresDate > currentDate) {
      return of({
        tokenResponse: {
          access_token: token
        }
      })
    }
    return this.http.post(`${environment.APIUrl}/api/leads/zohoToken`, null);
  }

  public constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private userService: UserService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('zohoToken') !== -1) {
      return next.handle(req).pipe(tap((response) => {
        if (response.type) {
          const body = (response as HttpResponse<any>).body
          if (!body.tokenResponse.error) {
            localStorage.setItem('accessToken', body.tokenResponse.access_token)
            if (body.tokenResponse.expires_in) {
              let date = new Date()
              
              // seconds substracted from token expires in value
              // to avoid fetch lag between API's and client
              const DELAY_CORRECTION = 30

              date.setSeconds(date.getSeconds() + body.tokenResponse.expires_in - DELAY_CORRECTION)
              localStorage.setItem('expiresIn', date.toISOString())
            }
          }
        }
      }));
    }

    this.spinner.show();

    return this.getToken().pipe(switchMap((token) => {
      let responseToken = token.tokenResponse.access_token
      if (responseToken) {
        this.token = responseToken
        this.userService.token = responseToken
      }
      responseToken = responseToken || this.token || ''

      let url: URL = new URL(req.url)
      let params = new HttpParams() // params are immutable, set/append modiefies new value
      const keys = Array.from(url.searchParams.entries()).map(([key, value]) => key)
      const values = Array.from(url.searchParams.entries()).map(([key, value]) => value)
      for (let i = 0; i < keys.length; i++) { 
        params = params.append(keys[i], values[i]) // clone params from url
      }
      req.params.keys().forEach(key => {
        params = params.set(key, req.params.get(key)) // clone params from param object
      })
      params = params.set('code', responseToken) // add zoho token if not present

      const updatedRequest = req.clone({
        url: req.url.split('?')[0],
        params: params
      })

      return next.handle(updatedRequest)
    }), finalize(() => {
      this.spinner.hide();
    }))
  }

}
