import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  get baseURL(): string {
    return localStorage.getItem('url') ? localStorage.getItem('url') : 'https://diarde.com';
  }

  set baseURL(url: string) {
    localStorage.setItem('url', url);
  }

  get email(): string {
    return localStorage.getItem('email')? localStorage.getItem('email') : '';
  }

  set email(email: string) {
    localStorage.setItem('email', email);
  }

  get password(): string {
    return localStorage.getItem('password')? localStorage.getItem('password') : '';
  }

  set password(password: string) {
    localStorage.setItem('password', password);
  }

}
