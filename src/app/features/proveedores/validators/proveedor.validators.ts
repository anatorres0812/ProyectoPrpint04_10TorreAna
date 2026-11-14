import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export function telefonoPeruValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (!value) return null;

    return /^[0-9]{9}$/.test(value)
      ? null
      : { telefonoInvalido: true };
  };
}

export function nombreCompletoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();

    if (!value) return null;

    const patron =
      /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s+[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)+$/;

    return patron.test(value)
      ? null
      : { nombreInvalido: true };
  };
}

export function rucValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (!value) return null;

    return /^(10|20)[0-9]{9}$/.test(value)
      ? null
      : { rucInvalido: true };
  };
}

export function correoPersonalizadoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();

    if (!value) return null;

    const patron =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(com|edu\.pe)$/i;

    return patron.test(value)
      ? null
      : { correoInvalido: true };
  };
}

export function textoSinEspaciosValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');

    if (!value) return null;

    return value.trim().length > 0
      ? null
      : { soloEspacios: true };
  };
}