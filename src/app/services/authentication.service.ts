import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import * as URL from 'url';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router, private config: ConfigService) {
  }

  login(email: string, password: string) {
    const url = URL.resolve(this.config.baseURL, '/_api/login');
    return this.http.post<any>(url, { email, password })
      .pipe(map(response => {
        return response;
      }));
  }

  signup(email: string, password: string, confirmPassword: string): Promise<any> {
    const url = URL.resolve(this.config.baseURL, '/_api/signup');
    const retPromise = this.http.post<any>(url, { email, password, confirmPassword }).toPromise();
    retPromise.catch(() => { /* Handled elsewhere */ });
    return retPromise;
  }

  logout(): Promise<any> {
    const url = URL.resolve(this.config.baseURL, '/_api/logout');
    const retPromise = this.http.get<any>(url).toPromise();
    retPromise.catch(() => { /* Handled elsewhere */ });
    this.router.navigate(['/login']);
    return retPromise;
  }

  getLogin() {
    const retPromise = this.http.get<any>('/_api/getLogin').toPromise();
    return retPromise;
  }

}
