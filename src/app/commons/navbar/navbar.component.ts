import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout } from 'src/app/auth/state/auth.actions';
import { AppState } from 'src/app/store/app.state';
import { WarningDialog } from './warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  imagenUrl: string = '';

  not_processing_clients: any
  not_processing_areas: Observable<any[]>

  warningDialog: MatDialogRef<WarningDialog>;

  constructor(private store: Store<AppState>,public dialog: MatDialog) { }

  ngOnInit(): void {}

  /** Warning-dialog.component is opened and the data of the areas with their clients are passed to it */
  openWarning(dataClients: any, dataAreas: any){
    this.warningDialog = this.dialog.open(WarningDialog, {
      disableClose: false,
      data : {clients: dataClients, areas: dataAreas}
    });
  }

  logout() {
    this.store.dispatch(logout())
  }
}
