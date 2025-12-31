import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'bwz-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <header *ngIf="auth.isLoggedIn()">
        <div class="header-content">
          <h1>Bank of Rapperswil</h1>
          <div class="user-section">
            <span>{{ auth.currentUser()?.firstname }} {{ auth.currentUser()?.lastname }}</span>
            <button (click)="auth.logout()">Logout</button>
          </div>
        </div>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f5f5;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .user-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .user-section span {
      font-size: 14px;
    }
    .user-section button {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid white;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .user-section button:hover {
      background: rgba(255,255,255,0.3);
    }
    main {
      min-height: calc(100vh - 80px);
    }
  `]
})
export class App {
  auth = inject(AuthService);
}
