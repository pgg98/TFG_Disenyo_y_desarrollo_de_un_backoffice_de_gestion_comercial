import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, InjectionToken, NgModule } from '@angular/core';
import { DragulaModule} from 'ng2-dragula';

import { AuthModule } from './auth/auth.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { CommonsModule } from './commons/commons.module';
import { AuthEffects } from './auth/state/auth.effects';
import { clearState } from './store/share/share.reducer';
import { ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { appReducer, AppState } from './store/app.state';
import { environment } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminEffects } from './pages/admin/state/admin.effects';
import { MatSelectModule, MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoRootModule } from './transloco-root.module';
import { TranslocoConfig, TranslocoService, TRANSLOCO_CONFIG } from '@ngneat/transloco';
import { clearRequest } from './services/clearRequest.service';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import { NavbarModule } from './commons/navbar/navbar.module';


export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('appReducer')
export const metaReducers: MetaReducer<any>[] = [clearState];
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: appReducer };

export function preloadLang(transloco: TranslocoService) {
  return function() {
    transloco.load('es').toPromise();
    transloco.load('en').toPromise();
  }
}
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NavbarModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    CommonsModule,
    DragulaModule.forRoot(),
    EffectsModule.forRoot([AdminEffects, AuthEffects]),
    StoreModule.forRoot(REDUCERS_TOKEN, {metaReducers: [clearState]}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode // Pauses recording actions and state changes when the extension window is not open
    }),
    BrowserAnimationsModule,
    DragDropModule,
    MatTableModule,
    FlexLayoutModule,
    MatSelectModule,
    HttpClientModule,
    TranslocoRootModule
  ],
  providers: [
    clearRequest,
    MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
    MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
    reducerProvider,
    {provide: HTTP_INTERCEPTORS,useClass: ErrorInterceptorService,multi:true},
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ["en", "es"],
        reRenderOnLangChange: true,
        fallbackLang: "es",
        defaultLang: "es"
      } as TranslocoConfig
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: preloadLang,
      deps: [TranslocoService]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
