import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Proveedor } from '../../models/proveedor.model';

import {
  telefonoPeruValidator,
  nombreCompletoValidator,
  rucValidator,
  correoPersonalizadoValidator,
  textoSinEspaciosValidator
} from '../../validators/proveedor.validators';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.css']
})
export class ProveedorFormComponent implements OnChanges {

  @Input() proveedor: Proveedor | null = null;

  @Output() guardar = new EventEmitter<Proveedor>();
  @Output() cancelar = new EventEmitter<void>();

  formulario: FormGroup;

  constructor(private fb: FormBuilder) {

    this.formulario = this.fb.group({

      empresa: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          textoSinEspaciosValidator()
        ]
      ],

      contacto: [
        '',
        [
          Validators.required,
          nombreCompletoValidator()
        ]
      ],

      telefono: [
        '',
        [
          Validators.required,
          telefonoPeruValidator()
        ]
      ],

      correo: [
        '',
        [
          Validators.required,
          correoPersonalizadoValidator()
        ]
      ],

      ruc: [
        '',
        [
          Validators.required,
          rucValidator()
        ]
      ],

      estado: [
        'Activo',
        Validators.required
      ]

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proveedor']) {
      this.cargarFormulario();
    }
  }

  get esEdicion(): boolean {
    return this.proveedor !== null;
  }

  cargarFormulario(): void {
    if (this.proveedor) {
      this.formulario.reset({
        empresa: this.proveedor.empresa,
        contacto: this.proveedor.contacto,
        telefono: this.proveedor.telefono,
        correo: this.proveedor.correo,
        ruc: this.proveedor.ruc,
        estado: this.proveedor.estado
      });
    } else {
      this.formulario.reset({
        empresa: '',
        contacto: '',
        telefono: '',
        correo: '',
        ruc: '',
        estado: 'Activo'
      });
    }

    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
  }

  filtrarDigitos(event: Event, campo: 'telefono' | 'ruc'): void {
    const input = event.target as HTMLInputElement;

    const limite = campo === 'telefono' ? 9 : 11;

    const valor = input.value
      .replace(/\D/g, '')
      .slice(0, limite);

    input.value = valor;

    this.formulario.get(campo)?.setValue(valor);
  }

  tieneError(campo: string, error: string): boolean {
    const control = this.formulario.get(campo);

    return !!(
      control &&
      control.hasError(error) &&
      (control.touched || control.dirty)
    );
  }

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();

    const proveedor: Proveedor = {
      id: this.proveedor?.id ?? 0,
      empresa: datos.empresa.trim(),
      contacto: datos.contacto.trim(),
      telefono: datos.telefono,
      correo: datos.correo.trim(),
      ruc: datos.ruc,
      estado: datos.estado
    };

    this.guardar.emit(proveedor);
  }

  cerrar(): void {
    this.cancelar.emit();
  }
}