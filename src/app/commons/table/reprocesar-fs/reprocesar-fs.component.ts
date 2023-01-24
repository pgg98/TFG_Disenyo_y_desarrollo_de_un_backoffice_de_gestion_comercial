import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Area } from 'src/app/interfaces/area';
import { AppState } from 'src/app/store/app.state';
import { loadAreaProducts } from '../../editor/state/editor.actions';
import { getEditorProductos } from '../../editor/state/editor.selector';

@Component({
  selector: 'app-reprocesar-fs',
  templateUrl: './reprocesar-fs.component.html',
  styleUrls: ['./reprocesar-fs.component.scss']
})
export class ReprocesarFsComponent implements OnInit {

  productos:any[]
  allChecked:boolean = false;
  ngUnsubscribe: Subject<any> = new Subject();
  subs$: Subscription;

  constructor(
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: {area:Area}
  ) { }

  ngOnInit(): void {
    this.store.select(getEditorProductos)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:any) => {
        if(data){
          this.productos = data[0].productos.filter(producto => producto.check)
        }
      })

    this.store.dispatch(loadAreaProducts({area: this.data.area}))
  }

  selectAll(productos:any[]){
    productos.forEach(producto => {
      producto['prueba'] = true;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.subs$.unsubscribe();
  }

}
