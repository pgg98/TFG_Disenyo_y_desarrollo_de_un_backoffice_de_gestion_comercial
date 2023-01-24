import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getBreadcrums, getTitle } from 'src/app/store/share/share.selector';
import { setBreadcrums, setTitle } from 'src/app/store/share/share.actions';
import { getShowUsers } from 'src/app/pages/admin/state/admin.selector';
import { setShowUsers } from 'src/app/pages/admin/state/admin.actions';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  public titulo: string = '';
  public breadcrums: any[];
  public showUsers: boolean;
  private subs$: Subscription;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor( private router: Router,
    private store: Store<AppState>) {
    this.subs$ = this.cargarDatos()
                      .subscribe( data => {
                        this.store.dispatch(setTitle({ title: data.titulo }));
                        this.store.dispatch(setBreadcrums({ breadcrums: data.breadcrums }));
                      });
  }

  ngOnInit(): void {
    this.store.select(getTitle)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.titulo = value
      }
    );

    this.store.select(getBreadcrums)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.breadcrums = value
      }
    );

    this.store.select(getShowUsers)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      value => {
        this.showUsers = value;
      }
    )
  }

  cargarDatos() {
    return this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd ),
        filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
        map( (event: ActivationEnd) => event.snapshot.data)
      );
  }

  reload(url: string) {
    (this.showUsers) ?
    this.store.dispatch(setShowUsers({ showUsers: false })) :
    this.router.navigate([url]);
  }

  /** DESTROY */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.subs$.unsubscribe();
  }
}
