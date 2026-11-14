import { Injectable } from '@angular/core';
import { Proveedor } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private readonly storageKey = 'torresana_proveedores';

  private cargarDatos(): Proveedor[] {
    try {
      const datos = localStorage.getItem(this.storageKey);

      return datos
        ? JSON.parse(datos) as Proveedor[]
        : [];

    } catch {
      return [];
    }
  }

  private guardarDatos(proveedores: Proveedor[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(proveedores)
    );
  }

  listar(): Proveedor[] {
    return this.cargarDatos();
  }

  registrar(proveedor: Proveedor): void {
    const proveedores = this.cargarDatos();

    proveedores.unshift({
      ...proveedor,
      id: Date.now()
    });

    this.guardarDatos(proveedores);
  }

  actualizar(proveedor: Proveedor): void {
    const proveedores = this.cargarDatos().map(item =>
      item.id === proveedor.id
        ? proveedor
        : item
    );

    this.guardarDatos(proveedores);
  }

  eliminar(id: number): void {
    const proveedores = this.cargarDatos()
      .filter(item => item.id !== id);

    this.guardarDatos(proveedores);
  }

  cambiarEstado(id: number): void {
    const proveedores = this.cargarDatos().map(item => {

      if (item.id !== id) {
        return item;
      }

      return {
        ...item,
        estado: item.estado === 'Activo'
          ? 'Inactivo'
          : 'Activo'
      } as Proveedor;
    });

    this.guardarDatos(proveedores);
  }
}