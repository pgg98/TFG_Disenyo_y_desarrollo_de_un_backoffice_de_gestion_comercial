import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EDITOR_STATE_NAME } from './state/editor.selector';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EditorReducer } from './state/editor.reducer';
import { EditorEffects } from './state/editor.effects';
import { ShareEffects } from 'src/app/store/share/share.effects';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { CommonsModule } from '../commons.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductsConfigurationEffects } from 'src/app/pages/admin/products_configuration/state/productsConfiguration.effects';

@NgModule({
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ],
  declarations: [
    EditAreaComponent
  ],
  imports: [
    CommonModule,
    CommonsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PipesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StoreModule.forFeature(EDITOR_STATE_NAME, EditorReducer),
    EffectsModule.forFeature([EditorEffects, ProductsConfigurationEffects, ShareEffects]),
  ]
})
export class EditorModule { }
