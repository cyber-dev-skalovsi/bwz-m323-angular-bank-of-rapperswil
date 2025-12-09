import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationResourceService } from './core/resources/authentication-resource.service';
import { LoginInfo } from './core/resources/dto/login-info';
import { RegistrationInfo } from './core/resources/dto/registration-info';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AuthenticationResourceService);
  private router = inject(Router);

  currentUser = signal<any>(this.getUserFromStorage());

  login(credentials: LoginInfo) {
    return this.api.login(credentials).pipe(
      tap(data => {
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.owner));
          this.currentUser.set(data.owner);
          this.router.navigate(['/dashboard']); //will use it later or smth
        }
      })
    );
  }

  register(info: RegistrationInfo) {
    return this.api.register(info).pipe(
      tap(account => {
        if (account) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  private getUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
