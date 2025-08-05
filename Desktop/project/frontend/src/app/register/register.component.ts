import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nom: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  passwordStrengthMessage: string = '';
  passwordStrengthClass: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    // Vérification du username
    const usernameRegex = /^[a-zA-Z0-9._]+[0-9]+$/;
    if (!usernameRegex.test(this.username)) {
      this.errorMessage = "Le nom d'utilisateur doit contenir un point et un numéro.";
      return;
    }

    // Vérification mot de passe trop faible
    if (this.passwordStrengthClass === 'weak') {
      this.errorMessage = 'Mot de passe trop faible. Veuillez choisir un mot de passe plus fort.';
      return;
    }

    this.http.post<any>('http://localhost:5000/api/register', {
      nom: this.nom,
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.successMessage = 'Inscription réussie, vous allez être redirigé vers la connexion...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = "Nom d'utilisateur déjà pris.";
        } else {
          this.errorMessage = error.error.message || "Erreur lors de l'inscription.";
        }
      }
    });
  }

  checkPasswordStrength() {
    const password = this.password;

    if (!password) {
      this.passwordStrengthMessage = '';
      this.passwordStrengthClass = '';
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const lengthValid = password.length >= 8;

    const score = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, lengthValid].filter(Boolean).length;

    if (score <= 2) {
      this.passwordStrengthMessage = 'Mot de passe faible';
      this.passwordStrengthClass = 'weak';
    } else if (score === 3 || score === 4) {
      this.passwordStrengthMessage = 'Mot de passe moyen';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrengthMessage = 'Mot de passe fort';
      this.passwordStrengthClass = 'strong';
    }
  }
}
