import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Proveedor } from '../../models/proveedor.model';
import { ProveedorService } from '../../services/proveedor.service';
import { ProveedorFormComponent } from '../../components/proveedor-form/proveedor-form.component';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProveedorFormComponent,
    ChatbotComponent
  ],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit, OnDestroy {

  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];

  busqueda = '';
  filtroEstado = 'Todos';

  mostrarFormulario = false;
  proveedorSeleccionado: Proveedor | null = null;

  chatbotAbierto = false;

  menuMovilAbierto = false;
  seccionActiva = 'inicio';

  notificacion = '';

  private notificacionTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  ngOnDestroy(): void {
    if (this.notificacionTimer) {
      clearTimeout(this.notificacionTimer);
    }
  }

  get contarActivos(): number {
    return this.proveedores.filter(
      p => p.estado === 'Activo'
    ).length;
  }

  get contarInactivos(): number {
    return this.proveedores.filter(
      p => p.estado === 'Inactivo'
    ).length;
  }

  get porcentajeActivos(): number {
    if (this.proveedores.length === 0) return 0;

    return Math.round(
      this.contarActivos / this.proveedores.length * 100
    );
  }

  get porcentajeInactivos(): number {
    if (this.proveedores.length === 0) return 0;

    return Math.round(
      this.contarInactivos / this.proveedores.length * 100
    );
  }

  cargarProveedores(): void {
    this.proveedores = this.proveedorService.listar();
    this.filtrarProveedores();
  }

  navegar(seccion: string): void {
    this.seccionActiva = seccion;
    this.menuMovilAbierto = false;

    setTimeout(() => {
      document.getElementById(seccion)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  }

  filtrarProveedores(): void {
    const termino = this.busqueda.toLowerCase().trim();

    this.proveedoresFiltrados = this.proveedores.filter(p => {
      const coincideTexto =
        p.empresa.toLowerCase().includes(termino) ||
        p.contacto.toLowerCase().includes(termino) ||
        p.ruc.includes(termino) ||
        p.correo.toLowerCase().includes(termino) ||
        p.telefono.includes(termino);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        p.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  abrirNuevo(): void {
    this.proveedorSeleccionado = null;
    this.mostrarFormulario = true;
    this.menuMovilAbierto = false;
  }

  editar(proveedor: Proveedor): void {
    this.proveedorSeleccionado = { ...proveedor };
    this.mostrarFormulario = true;
  }

  guardar(proveedor: Proveedor): void {
    if (this.proveedorSeleccionado) {
      this.proveedorService.actualizar(proveedor);
      this.mostrarMensaje('Proveedor actualizado correctamente.');
    } else {
      this.proveedorService.registrar(proveedor);
      this.mostrarMensaje('Proveedor registrado correctamente.');
    }

    this.cerrarFormulario();
    this.cargarProveedores();
  }

  eliminar(proveedor: Proveedor): void {
    const confirmar = window.confirm(
      `¿Estás segura de eliminar a ${proveedor.empresa}?`
    );

    if (!confirmar) return;

    this.proveedorService.eliminar(proveedor.id);
    this.cargarProveedores();

    this.mostrarMensaje('Proveedor eliminado correctamente.');
  }

  cambiarEstado(proveedor: Proveedor): void {
    this.proveedorService.cambiarEstado(proveedor.id);
    this.cargarProveedores();

    this.mostrarMensaje('Estado del proveedor actualizado.');
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.proveedorSeleccionado = null;
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.filtroEstado = 'Todos';
    this.filtrarProveedores();
  }

  alternarChatbot(): void {
    this.chatbotAbierto = !this.chatbotAbierto;
  }

  cerrarChatbot(): void {
    this.chatbotAbierto = false;
  }

  mostrarMensaje(mensaje: string): void {
    this.notificacion = mensaje;

    if (this.notificacionTimer) {
      clearTimeout(this.notificacionTimer);
    }

    this.notificacionTimer = setTimeout(() => {
      this.notificacion = '';
    }, 3000);
  }

  trackById(index: number, proveedor: Proveedor): number {
    return proveedor.id;
  }
}