
import { Injectable, InjectionToken } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    request = request.clone({
      headers: request.headers.set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTgzODgzMjYsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcwNzgvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA3OC8ifQ.c4DwJajd2ZF4i7ddyowTO984NJcRSw2taf0s99LwlWQ'),
      });
      
    return next.handle(request);
  }
}
  

export class HttpInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next);
  }
}

export const HTTP_INTERCEPTORSs = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS');

Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}