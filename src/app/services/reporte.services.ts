import { Injectable } from '@angular/core';
import { cliente } from '../models/cliente.models';

@Injectable({
  providedIn: 'root',
})
export class ReporteServices {
  generarInforme(listaClientes: cliente[], nombreArchivo: string): void {
    const contenido = this.formatoInforme(listaClientes);
    this.generarArchivo(contenido, nombreArchivo);
  }

  private formatoInforme(listaClientes: cliente[]): string {
    return listaClientes.map(cliente => {
      return `ID: ${cliente.id}\nNombres: ${cliente.nombres}\nApellidos: ${cliente.apellidos}\nTeléfono: ${cliente.telefono}\nDirecciones: ${cliente.direcciones.join(', ')}\nIdentificaciones: ${cliente.identificaciones.join(', ')}\nStatus: ${cliente.status ? 'Activo' : 'Inactivo'}\nFecha: ${cliente.fecha} ${cliente.hora}\nUsuario: ${cliente.user}\nAcción: ${cliente.accion}\n\n`;
    }).join('');
  }

  private generarArchivo(contenido: string, nombreArchivo: string): void {
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
