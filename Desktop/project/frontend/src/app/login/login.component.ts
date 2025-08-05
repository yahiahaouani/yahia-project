import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  login() {
  this.authService.login({
    username: this.username,
    password: this.password
  }).subscribe({
    next: () => {
      this.router.navigate(['/']);
    },
    error: (error) => {
      this.errorMessage = error.error.message || 'Erreur lors de la connexion.';
    }
  });
}

}
