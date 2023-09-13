import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChecklistService } from '../checklist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error = "";
  loginForm = this.formBuilder.group({
    username: '',
    password: '',
  });

  constructor(
    private checklistService: ChecklistService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}


  onLogin() {
    this.checklistService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe((user) => {
        if (user !== undefined && user !== null) {
          this.error = "";
          this.router.navigate(['/']);
        } else {
          this.error = "Gebruikersnaam/wachtwoord is niet correct! Probeer opnieuw.";
        }
      });
  }
  
}
