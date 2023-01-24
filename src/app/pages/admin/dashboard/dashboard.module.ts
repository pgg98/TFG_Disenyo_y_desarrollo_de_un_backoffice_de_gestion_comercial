import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { GraficasComponent } from './graficas/graficas.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonsModule } from 'src/app/commons/commons.module';
import { StoreModule } from '@ngrx/store';
import { DASHBOARD_STATE_NAME } from './state/dashboard.selector';
import { DashboardReducer } from './state/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './state/dashboard.effects';
import { ShareEffects } from 'src/app/store/share/share.effects';

@NgModule({
  declarations: [
    DashboardComponent, IndicadoresComponent, GraficasComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    CommonsModule,
    StoreModule.forFeature(DASHBOARD_STATE_NAME, DashboardReducer),
    EffectsModule.forFeature([DashboardEffects, ShareEffects])
  ]
})
export class DashboardModule { }
