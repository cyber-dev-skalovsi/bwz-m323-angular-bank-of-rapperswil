import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationResourceService } from './core/resources/authentication-resource.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AuthenticationResourceService);
  private router = inject(Router);
  currentUser = signal(JSON.parse(localStorage.getItem('user') || 'null'));

  login(data: any) {
    return this.api.login(data).pipe(tap(d => {
      if (d?.token) {
        localStorage.setItem('token', d.token);
        localStorage.setItem('user', JSON.stringify(d.owner));
        this.currentUser.set(d.owner);
        this.router.navigate(['/dashboard']);
      }
    }));
  }

  register(data: any) {
    return this.api.register(data).pipe(tap(account => {
      if (account) {
        this.login({ login: data.login, password: data.password }).subscribe();
      }
    }));
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
