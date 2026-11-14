import { Component } from '@angular/core';
import { ProveedoresComponent } from './features/proveedores/pages/proveedores/proveedores.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProveedoresComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TORRESANA Future Business';
}