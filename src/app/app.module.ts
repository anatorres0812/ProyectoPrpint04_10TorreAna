
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import {
  ProveedoresComponent
} from './features/proveedores/pages/proveedores/proveedores.component';

import {
  ProveedorFormComponent
} from './features/proveedores/components/proveedor-form/proveedor-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ProveedoresComponent,
    ProveedorFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
