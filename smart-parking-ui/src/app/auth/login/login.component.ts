import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  onLogin() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        // Decode JWT to get role (simplified assumed user roles map if role is in token)
        // For this demo since standard JWT decodes payload we could, or just prompt user to route if they are admin vs simple.
        // Actually the backend endpoint returns a JWT, let's just extract the role manually.
        try {
            const payload = JSON.parse(atob(res.token.split('.')[1]));
            localStorage.setItem('role', payload.role);
            localStorage.setItem('userId', payload.sub);
            if (payload.role === 'OWNER') {
                this.router.navigate(['/admin-dashboard']);
            } else {
                this.router.navigate(['/user-dashboard']);
            }
        } catch (e) {
             this.router.navigate(['/user-dashboard']); // Default
        }
      },
      error: (err) => {
        this.error = 'Invalid credentials. Please try again.';
      }
    });
  }
}
