import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonsModule } from 'src/app/commons/commons.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ShareEffects } from 'src/app/store/share/share.effects';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PRODUCTSCONFIGURATION_STATE_NAME } from './state/productsConfiguration.selector';
import { ProductsConfigurationReducer } from './state/productsConfiguration.reducer';
import { ProductsConfigurationEffects } from './state/productsConfiguration.effects';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CommonsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StoreModule.forFeature(PRODUCTSCONFIGURATION_STATE_NAME, ProductsConfigurationReducer),
    EffectsModule.forFeature([ProductsConfigurationEffects, ShareEffects]),
    MatFormFieldModule,
    PipesModule,
    MatSelectModule,
    MatOptionModule,
  ],
  entryComponents: [
  ]
})
export class ProductsConfigurationModule { }
