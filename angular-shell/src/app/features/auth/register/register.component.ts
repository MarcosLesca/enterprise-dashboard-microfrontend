import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="register-container">
      <h2>Register Component</h2>
      <p>Registration form will be implemented here</p>
      <a routerLink="/auth/login">Back to Login</a>
    </div>
  `,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {}