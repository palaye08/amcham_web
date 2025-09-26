import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  rememberMe = false;

  // Propriété pour créer des tableaux dans le template
  Array = Array;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRememberMeChange(event: any) {
    this.rememberMe = event.target.checked;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
        rememberMe: this.rememberMe
      };
      
      console.log('Login data:', formData);
      // Ici vous pouvez ajouter la logique d'authentification
      // this.authService.login(formData);
      
      // Navigation après connexion réussie
      this.navigateToPropos();
    }
  }

  navigateToPropos() {
    console.log('Navigation vers apropos');
    this.router.navigate(['/apropos']);
  }

  forgotPassword() {
    console.log('Forgot password clicked');
    // Logique pour mot de passe oublié
    // Vous pouvez naviguer vers une page de récupération de mot de passe
    // this.router.navigate(['/forgot-password']);
  }
}