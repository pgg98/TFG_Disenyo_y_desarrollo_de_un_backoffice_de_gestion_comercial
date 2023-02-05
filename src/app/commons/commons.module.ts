import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { DonutBarComponent } from './donut-bar/donut-bar.component';
import { SelectusersComponent } from './selectusers/selectusers.component';
import { NgChartsModule } from 'ng2-charts';
import { LineChartComponent } from './line-chart/line-chart.component';
import { EditorComponent } from './editor/editor.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MainPipe } from '../pipes/main-pipe.module';
import { TableComponent } from './table/table.component';
import { PipesModule } from '../pipes/pipes.module';
import { IndeterminateProgressBarComponent } from './indeterminate-progress-bar/indeterminate-progress-bar.component';
import { RouterModule } from '@angular/router';
import { FilterTableComponent } from './filter-table/filter-table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../services/Common.service';
import { PopoverModule } from 'ngx-smart-popover'
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule } from '@ngneat/transloco';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    NavbarComponent,
    SidebarComponent,
    PaginationComponent,
    ProgressbarComponent,
    SelectusersComponent,
    DonutBarComponent,
    LineChartComponent,
    EditorComponent,
    TableComponent,
    IndeterminateProgressBarComponent,
    FilterTableComponent
  ],
  exports: [
    BreadcrumbComponent,
    NavbarComponent,
    SidebarComponent,
    PaginationComponent,
    ProgressbarComponent,
    SelectusersComponent,
    DonutBarComponent,
    LineChartComponent,
    EditorComponent,
    TableComponent,
    IndeterminateProgressBarComponent,
    FilterTableComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    NgChartsModule,
    MatTabsModule,
    NgSelectModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MainPipe,
    MatCheckboxModule,
    PipesModule,
    RouterModule,
    MatDialogModule,
    PopoverModule,
    MatMenuModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    TranslocoModule,
    MatBadgeModule
  ],
  providers: [
    CommonService
  ]
})
export class CommonsModule { }
