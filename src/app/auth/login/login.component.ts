import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="container">
      <h2>Login</h2>
      <form #form="ngForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Username</label>
          <input type="text" name="login" [(ngModel)]="model.login" required minlength="4">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" [(ngModel)]="model.password" required minlength="4">
        </div>
        <button type="submit" [disabled]="form.invalid">Login</button>
        <p class="error" *ngIf="error">Login failed. Please check credentials.</p>
      </form>
      <p>No account? <a routerLink="/register">Register here</a></p>
    </div>
  `,
  styles: [`
    .container { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 0.75rem; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; margin-top: 1rem; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .error { color: #d32f2f; margin-top: 1rem; text-align: center; }
    p { text-align: center; margin-top: 1rem; }
  `]
})
export class LoginComponent {
  auth = inject(AuthService);
  model = { login: '', password: '' };
  error = false;

  onSubmit() {
    this.error = false;
    this.auth.login(this.model).subscribe({
      next: (success) => {
        // success is handled in service tap(), but if it fails (returns null), we handle here
        if (!this.auth.isLoggedIn()) this.error = true;
      },
      error: () => this.error = true
    });
  }
}
