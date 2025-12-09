import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'bwz-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar">
      <div class="brand">Bank of Rapperswil</div>
      <div class="links" *ngIf="auth.currentUser()">
        <span class="user-name">{{ auth.currentUser()?.firstname }}</span>
        <button (click)="auth.logout()">Logout</button>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App {
  auth = inject(AuthService);
}
