import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Proveedor } from '../../models/proveedor.model';

interface MensajeChat {
  tipo: 'usuario' | 'asistente';
  texto: string;
  hora: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @Input() proveedores: Proveedor[] = [];
  @Output() cerrar = new EventEmitter<void>();

  consulta = '';
  escribiendo = false;

  mensajes: MensajeChat[] = [
    {
      tipo: 'asistente',
      texto: '¡Hola! 🐱 Soy Michi, tu asistente virtual. Puedo ayudarte a consultar tus proveedores, revisar estadísticas y detectar posibles alertas. ¿Qué deseas saber?',
      hora: this.obtenerHora()
    }
  ];

  sugerencias: string[] = [
    '¿Cuántos proveedores tengo?',
    '¿Cuáles están inactivos?',
    '¿Tengo RUC duplicados?',
    'Muéstrame las estadísticas'
  ];

  enviar(): void {
    const pregunta = this.consulta.trim();

    if (!pregunta || this.escribiendo) {
      return;
    }

    this.mensajes.push({
      tipo: 'usuario',
      texto: pregunta,
      hora: this.obtenerHora()
    });

    this.consulta = '';
    this.escribiendo = true;

    const respuesta = this.generarRespuesta(pregunta);

    setTimeout(() => {
      this.mensajes.push({
        tipo: 'asistente',
        texto: respuesta,
        hora: this.obtenerHora()
      });

      this.escribiendo = false;
    }, 450);
  }

  usarSugerencia(texto: string): void {
    this.consulta = texto;
    this.enviar();
  }

  generarRespuesta(pregunta: string): string {
    const texto = this.normalizar(pregunta);
    const total = this.proveedores.length;

    const activos = this.proveedores.filter(
      p => p.estado === 'Activo'
    ).length;

    const inactivos = this.proveedores.filter(
      p => p.estado === 'Inactivo'
    ).length;

    if (
      texto.includes('hola') ||
      texto.includes('buenos dias') ||
      texto.includes('buenas tardes')
    ) {
      return '¡Hola! 🐱 Qué gusto saludarte. Estoy listo para ayudarte con la gestión de tus proveedores.';
    }

    if (texto.includes('ayuda') || texto.includes('que puedes hacer')) {
      return '¡Claro! 🐾 Puedo ayudarte con:\n\n• Consultar el total de proveedores.\n• Identificar proveedores activos e inactivos.\n• Revisar RUC duplicados.\n• Buscar empresas y contactos.\n• Consultar estadísticas y alertas.';
    }

    if (texto.includes('duplicado') || texto.includes('ruc repetido')) {
      const duplicados = this.obtenerDuplicadosRuc();

      if (duplicados.length === 0) {
        return '¡Buenas noticias! 🐱 No encontré RUC duplicados en tus registros.';
      }

      return '⚠️ Encontré posibles RUC duplicados:\n\n' +
        duplicados.map(r => `• RUC ${r.ruc}: ${r.cantidad} registros`).join('\n');
    }

    if (texto.includes('estadistica') || texto.includes('resumen')) {
      const porcentaje = total > 0
        ? Math.round((activos / total) * 100)
        : 0;

      return `📊 RESUMEN DE PROVEEDORES\n\n` +
        `• Total registrados: ${total}\n` +
        `• Proveedores activos: ${activos}\n` +
        `• Proveedores inactivos: ${inactivos}\n` +
        `• Porcentaje de activos: ${porcentaje}%`;
    }

    if (texto.includes('inactivo')) {
      if (inactivos === 0) {
        return '🐱 No tienes proveedores inactivos actualmente.';
      }

      const lista = this.proveedores
        .filter(p => p.estado === 'Inactivo')
        .map(p => `• ${p.empresa} - ${p.ruc}`)
        .join('\n');

      return `PROVEEDORES INACTIVOS (${inactivos})\n\n${lista}`;
    }

    if (texto.includes('activo')) {
      if (activos === 0) {
        return '🐱 No tienes proveedores activos actualmente.';
      }

      const lista = this.proveedores
        .filter(p => p.estado === 'Activo')
        .map(p => `• ${p.empresa} - ${p.ruc}`)
        .join('\n');

      return `PROVEEDORES ACTIVOS (${activos})\n\n${lista}`;
    }

    if (
      texto.includes('cuantos') ||
      texto.includes('total') ||
      texto.includes('proveedores tengo')
    ) {
      return `🐾 Actualmente tienes ${total} proveedores registrados:\n\n` +
        `• ${activos} activos.\n` +
        `• ${inactivos} inactivos.`;
    }

    if (texto.includes('alerta') || texto.includes('problema')) {
      const duplicados = this.obtenerDuplicadosRuc();

      return `🔎 REVISIÓN DEL SISTEMA\n\n` +
        `• Proveedores registrados: ${total}\n` +
        `• Proveedores inactivos: ${inactivos}\n` +
        `• RUC duplicados detectados: ${duplicados.length}\n\n` +
        (inactivos > 0 || duplicados.length > 0
          ? 'Te recomiendo revisar los proveedores inactivos y los posibles registros duplicados.'
          : '¡Todo está en orden! No se detectaron alertas en esta revisión.');
    }

    if (texto.length >= 3) {
      const encontrado = this.proveedores.find(p =>
        this.normalizar(p.empresa).includes(texto) ||
        this.normalizar(p.contacto).includes(texto) ||
        (p.ruc || '').includes(pregunta.trim())
      );

      if (encontrado) {
        return `🐱 Encontré este proveedor:\n\n` +
          `• Empresa: ${encontrado.empresa}\n` +
          `• Contacto: ${encontrado.contacto}\n` +
          `• Teléfono: ${encontrado.telefono}\n` +
          `• Correo: ${encontrado.correo}\n` +
          `• RUC: ${encontrado.ruc}\n` +
          `• Estado: ${encontrado.estado}`;
      }
    }

    return 'Mmm... 🐱 No encontré información específica para esa consulta. Puedes preguntarme por el total de proveedores, sus estados, RUC duplicados o buscar una empresa por su nombre.';
  }

  obtenerDuplicadosRuc(): { ruc: string; cantidad: number }[] {
    const conteo = new Map<string, number>();

    this.proveedores.forEach(p => {
      if (p.ruc) {
        conteo.set(p.ruc, (conteo.get(p.ruc) || 0) + 1);
      }
    });

    return Array.from(conteo.entries())
      .filter(([_, cantidad]) => cantidad > 1)
      .map(([ruc, cantidad]) => ({ ruc, cantidad }));
  }

  normalizar(valor: string): string {
    return (valor || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  obtenerHora(): string {
    return new Intl.DateTimeFormat('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  }

  limpiarConversacion(): void {
    this.mensajes = [
      {
        tipo: 'asistente',
        texto: '¡Hola nuevamente! 🐱 Soy Michi. ¿En qué puedo ayudarte?',
        hora: this.obtenerHora()
      }
    ];
  }
}