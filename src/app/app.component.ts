import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { refresh } from './auth/state/auth.actions';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cfrontend';

  constructor(private store: Store<AppState>){}
  ngOnInit(): void {
    this.store.dispatch(refresh())
  }
}
