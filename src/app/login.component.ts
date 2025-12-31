import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="max-width:400px;margin:50px auto;padding:20px;background:white;border-radius:8px">
      <h2>{{ isLogin ? 'Login' : 'Registrierung' }}</h2>
      
      <form (ngSubmit)="submit()" #f="ngForm">
        <div *ngIf="!isLogin">
          <input [(ngModel)]="data.firstname" name="firstname" placeholder="Vorname" minlength="4" required style="width:100%;padding:10px;margin:5px 0">
          <input [(ngModel)]="data.lastname" name="lastname" placeholder="Nachname" minlength="4" required style="width:100%;padding:10px;margin:5px 0">
        </div>
        
        <input [(ngModel)]="data.login" name="login" placeholder="Benutzername" minlength="4" required style="width:100%;padding:10px;margin:5px 0">
        <input [(ngModel)]="data.password" name="password" type="password" placeholder="Passwort" minlength="4" required style="width:100%;padding:10px;margin:5px 0">
        
        <input *ngIf="!isLogin" [(ngModel)]="confirm" name="confirm" type="password" placeholder="Passwort bestätigen" minlength="4" required style="width:100%;padding:10px;margin:5px 0">
        
        <button [disabled]="f.invalid || (!isLogin && confirm !== data.password)" style="width:100%;padding:12px;background:#007bff;color:white;border:none;border-radius:4px;margin-top:10px">
          {{ isLogin ? 'Login' : 'Registrieren' }}
        </button>
      </form>
      
      <p style="text-align:center;margin-top:15px;cursor:pointer;color:#007bff" (click)="isLogin = !isLogin">
        {{ isLogin ? 'Zur Registrierung' : 'Zum Login' }}
      </p>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  isLogin = true;
  data: any = { login: '', password: '', firstname: '', lastname: '' };
  confirm = '';

  submit() {
    if (this.isLogin) {
      this.auth.login(this.data).subscribe();
    } else {
      this.auth.register(this.data).subscribe(() => this.isLogin = true);
    }
  }
}
