import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/es-AR';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
registerLocaleData(localeAr);
bootstrapApplication(AppComponent, appConfig).catch(error => console.error('Error al iniciar Angular', error));
