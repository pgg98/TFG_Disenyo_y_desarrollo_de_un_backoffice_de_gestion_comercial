import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { changeLoginWaiting, loginStart } from '../state/auth.actions';
import { getLoginWaiting } from '../state/auth.selector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formSubmint = false;
  public waiting: Observable<boolean>;
  passwordVisible: boolean = false;

  public loginForm = this.fb.group({
    email: ['', [Validators.required] ],
    password: ['', Validators.required ]
  });

  constructor( private fb: FormBuilder, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.waiting = this.store.select(getLoginWaiting)
  }

  login() {
    this.formSubmint = true;

    if (!this.loginForm.valid) {
      console.warn('Errores en el formulario');
      return;
    }

    this.store.dispatch(changeLoginWaiting({status: true}))
    // LOGIN ACTION
    this.store.dispatch(loginStart({user: this.loginForm.get('email').value, password: this.loginForm.get('password').value}))
  }

  setPasswordVisible() {
    this.passwordVisible = !this.passwordVisible;
  }
}
