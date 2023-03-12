import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout } from 'src/app/auth/state/auth.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  imagenUrl: string = '';

  not_processing_clients: any
  not_processing_areas: Observable<any[]>

  constructor(private store: Store<AppState>,public dialog: MatDialog) { }

  ngOnInit(): void {}

  logout() {
    this.store.dispatch(logout())
  }
}
