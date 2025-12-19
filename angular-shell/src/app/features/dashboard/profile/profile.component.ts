import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h2>Profile Component</h2>
      <p>Profile management will be implemented here</p>
    </div>
  `,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {}