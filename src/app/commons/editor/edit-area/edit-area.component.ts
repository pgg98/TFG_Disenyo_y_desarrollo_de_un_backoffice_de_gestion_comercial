import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.state';
import Swal from 'sweetalert2';
import { editArea, editAreaSuccess, loadClientAreas } from '../state/editor.actions';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.scss']
})
export class EditAreaComponent implements OnInit {

  areaForm: FormGroup;
  formBuilder: FormBuilder = new FormBuilder();
  firstClickEdit: boolean = false;
  isChangedData: boolean = false;
  private ngUnsubscribe: Subject<any> = new Subject();
  cultivos = ['arroz', 'canha', 'soja', 'girasol', 'garbanzo', 'maiz', 'trigo', 'algodon', 'otro', 'arbol', 'nogal', 'pecano', 'represa', 'cebada', 'pastura'];

  constructor(
    public dialogRef: MatDialogRef<EditAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>,
    private store: Store<AppState>
  ) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {

    this.areaForm = this.formBuilder.group({
      //nombre: [this.data.nombre || ''],
      titulo: [this.data.titulo || '', [Validators.required]],
      cultivo: [this.data.cultivo || '', [Validators.required]],
      //superficie: [this.data.superficie || null],
      //subarea: [this.data.subarea || false],
      unidad_01: [this.data.unidad_01 || ''],
      unidad_02: [this.data.unidad_02 || ''],
      unidad_03: [this.data.unidad_03 || ''],
      unidad_04: [this.data.unidad_04 || ''],
      unidad_05: [this.data.unidad_05 || ''],
      id_label: [this.data.id_label || ''],
      //terminado: [this.data.terminado || false],
      agrupacion: [this.data.agrupacion || '', [Validators.required]],
      fin_actualizacion: [this.data.fin_actualizacion || '', [Validators.required]]
      //reinicio: [this.data.reinicio || false],
      //zafra_cont: [this.data.zafra_cont || false],
      //freinicio: [this.data.freinicio || '']

    });

    this.dateChanged('fin_actualizacion');
  }

  changeCultivo(){
    this.isChangedData = true;
  }

  isDataChanged() {
    this.isChangedData = !Object.keys(this.areaForm.controls).every(
      control => {
        return this.areaForm.get(control).value === this.data[control] ||
        (this.areaForm.get(control).value === '' && this.data[control]) === null;
      }
    );
  }

  /**
   * Función que normaliza el valor de date de un control del form a un valor legible en bd
   * @param name nombre del control de tipo date
   */
  dateChanged(name: string) {
    this.areaForm.get(name).valueChanges.subscribe(
      (value: Date) => {
        if(!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value.toString())) {
          const day = (value.getDate() < 10) ? '0' + value.getDate() : value.getDate();
          const month = (value.getMonth() + 1 < 10) ? '0' + (value.getMonth() + 1) : value.getMonth() + 1;
          const year = value.getFullYear();
          this.areaForm.get(name).setValue(`${year}-${month}-${day}`);
          this.isDataChanged();
        }
      }
    )
  }

  /**
   * Función que comprueba si hay cambios sin guardar e informa sobre
   * la eliminación de esos datos al usuario
   * @returns resultado del diálogo
   */
  async confirmDiscardChanges() {
    this.isDataChanged();
    if(this.isChangedData) {
      return await Swal.fire({
        icon: 'question',
        title: 'Cambios sin guardar',
        text: '¿Desea salir sin guardar los cambios?',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        cancelButtonColor: '#d33',
      }).then(result => {
        return result.isConfirmed;
      })
    }

    return true;
  }

  /**
   * Función que realiza la llamada para cambiar el área
   */
  editArea() {
    if(!this.firstClickEdit && this.areaForm.invalid) {
      this.areaForm.markAllAsTouched();
      this.firstClickEdit = true;
      return;
    } else {
      // se envia el area editada
      const newArea = Object.keys(this.areaForm.controls).reduce((act, key) => {
        return { ...act, [key]: this.areaForm.get(key).value }
      }, {});
      this.store.dispatch(editArea({ id: this.data.id, data: newArea, idCliente: this.data.clientId }));
    }
  }

  async closeTool() {
    if(await this.confirmDiscardChanges()) this.dialogRef.close();
  }

  /** DESTROY */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
