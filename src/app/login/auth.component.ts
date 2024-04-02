import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  public loginMode = false;
  public isPassword = true;
  public errorMessage !: string;
  public authMode!: string;
  public loginForm = new FormGroup({
    username: new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required])
  });
  constructor(private router: Router) { }
  ngOnInit(): void {
  }
  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.errorMessage = 'Please fill all fields!';
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loginForm.controls['username'].value === 'admin' && this.loginForm.controls['password'].value === 'admin') {
      this.router.navigate(['/home']);
    }else{
      this.errorMessage = 'Invalid user!';
    }
  }
  togglePassword():void{
    this.isPassword = !this.isPassword;
  }
  ngOnDestroy(): void {
    this.loginForm.reset();
    this.errorMessage = '';
  }

}
