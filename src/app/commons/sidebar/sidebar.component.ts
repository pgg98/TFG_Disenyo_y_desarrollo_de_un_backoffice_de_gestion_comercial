import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { setFilter } from 'src/app/pages/admin/state/admin.actions';
import { AppState } from 'src/app/store/app.state';
import { sidebarItem } from '../../interfaces/sidebar.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  url: string = '';
  actualUrl: string;
  menu: sidebarItem[] =[
    { titulo: 'Leads', icono: 'fas fa-child', sub: false, url: '/admin/leads'},
    { titulo: 'Demos', icono: 'fas fa-play-circle', sub: false, url: '/admin/demos'},
    { titulo: 'Clientes', icono: 'fa fa-users', sub: false, url: '/admin/clientes'},
    { titulo: 'Bajas', icono: 'fas fa-sign-in-alt', sub: false, url: '/admin/bajas'},
    { titulo: 'Estadísticas', icono: 'fa fa-tachometer-alt', sub: false, url: '/admin/dashboard'},
  ];

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(public store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe().subscribe(
      value => {
        if(value instanceof NavigationEnd) {
          this.actualUrl = this.url;
          // url a la que va a ir después aún con el redirect
          this.url = value.urlAfterRedirects;
        }
      }
    );
    this.url = this.router.url;
    this.actualUrl = this.url;
  }

  navigate(url) {
    // borrar filtro si se cambia de tab
    if(!this.url.includes(this.actualUrl)) this.store.dispatch(setFilter({ filter: undefined }));
    this.actualUrl = url;
    this.router.navigateByUrl(url);
  }

  /** DESTROY */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
