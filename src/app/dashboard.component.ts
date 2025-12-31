import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AccountResourceService } from './core/resources/account-resource.service';
import { TransactionResourceService } from './core/resources/transaction-resource.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="max-width:1200px;margin:20px auto;padding:20px">
      <div style="background:white;padding:20px;border-radius:8px;margin-bottom:20px">
        <h2>Dashboard</h2>
        <p>{{ auth.currentUser()?.firstname }} {{ auth.currentUser()?.lastname }} | {{ auth.currentUser()?.bban }}</p>
        <p style="font-size:20px;color:green;font-weight:bold">{{ balance() | number:'1.2-2' }} CHF</p>
        <button (click)="auth.logout()" style="padding:8px 16px;background:#dc3545;color:white;border:none;border-radius:4px">Logout</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div style="background:white;padding:20px;border-radius:8px">
          <h3>Neue Zahlung</h3>
          <form (ngSubmit)="transfer()" #f="ngForm">
            <input [(ngModel)]="tx.target" name="target" placeholder="Empfänger-Konto" (ngModelChange)="checkAccount()" required style="width:100%;padding:10px;margin:5px 0">
            <div *ngIf="recipient()" style="background:#e7f3ff;padding:8px;margin:5px 0;border-radius:4px">{{ recipient() }}</div>
            
            <input [(ngModel)]="tx.amount" name="amount" type="number" min="0.05" step="0.05" placeholder="Betrag" required style="width:100%;padding:10px;margin:5px 0">
            
            <button [disabled]="f.invalid" style="width:100%;padding:12px;background:#28a745;color:white;border:none;border-radius:4px;margin-top:10px">Zahlung ausführen</button>
          </form>
          <p *ngIf="msg()" style="color:green;margin-top:10px;text-align:center">{{ msg() }}</p>
        </div>

        <div style="background:white;padding:20px;border-radius:8px">
          <h3>Transaktionen</h3>
          <div *ngFor="let t of txs()" style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #eee">
            <div>
              <div style="font-size:12px;color:#999">{{ t.date | date:'dd.MM.yy HH:mm' }}</div>
              <div>{{ t.amount < 0 ? t.target : t.source }}</div>
            </div>
            <div [style.color]="t.amount > 0 ? 'green' : 'red'" style="font-weight:bold">
              {{ t.amount > 0 ? '+' : '' }}{{ t.amount | number:'1.2-2' }}
            </div>
          </div>
          
          <div *ngIf="pages() > 1" style="display:flex;justify-content:center;gap:15px;margin-top:15px">
            <button (click)="page.set(page()-1);load()" [disabled]="page()===0" style="padding:8px 16px">◀</button>
            <span>{{ page()+1 }} / {{ pages() }}</span>
            <button (click)="page.set(page()+1);load()" [disabled]="page()>=pages()-1" style="padding:8px 16px">▶</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  api = inject(AccountResourceService);
  txApi = inject(TransactionResourceService);

  balance = signal(0);
  tx = { target: '', amount: 0.05 };
  recipient = signal('');
  msg = signal('');
  txs = signal<any[]>([]);
  page = signal(0);
  pages = signal(1);

  ngOnInit() {
    const token = this.auth.getToken();
    this.api.getCurrentBalance(token).subscribe(d => this.balance.set(d.balance));
    this.load();
  }

  load() {
    this.txApi.getTransactions(this.auth.getToken(), { count: 10, skip: this.page() * 10 })
      .subscribe(d => {
        this.txs.set([...d.result]);
        this.pages.set(Math.ceil(d.query.resultcount / 10));
      });
  }


  checkAccount() {
    if (this.tx.target.length >= 10) {
      this.api.getAccountInfo(this.auth.getToken(), this.tx.target)
        .subscribe({ next: d => this.recipient.set(`${d.firstname} ${d.lastname}`), error: () => this.recipient.set('') });
    }
  }

  transfer() {
    this.txApi.transfer(this.auth.getToken(), this.tx).subscribe(d => {
      this.balance.set(d.newBalance);
      this.msg.set('✓ Zahlung erfolgreich!');
      this.load();
      this.tx = { target: '', amount: 0.05 };
      setTimeout(() => this.msg.set(''), 3000);
    });
  }
}
