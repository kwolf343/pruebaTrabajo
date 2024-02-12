import { Component, OnInit } from '@angular/core';
import { cliente } from '../models/cliente.models';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.services';
import { ReporteServices } from '../services/reporte.services';

@Component({
  selector: 'app-historico-component',
  templateUrl: './historico-component.component.html',
  styleUrls: ['../clientes-component/clientes-component.component.css']
})
export class HistoricoComponentComponent implements OnInit{
  clientes:cliente[]=[];
  seleccion:string='codigo';
  constructor(private router:Router, private clientesService:ClienteService, private ReporteServices:ReporteServices){}
  ngOnInit(): void {
    this.clientesService.obtenerClientes().subscribe(misClientes=>{
      try{
        this.clientes=Object.values(misClientes);
        this.clientesService.setClientes(this.clientes);
      }
      catch{
        this.clientes = [];
      }
    });
  }
  reporte(){
    this.ReporteServices.generarInforme(this.clientes,'Reporte');
  }
  quitarMail(correoElectronico:string){
    const arrobaIndex = correoElectronico.indexOf('@');
    if (arrobaIndex !== -1) {
      const parteIzquierda = correoElectronico.substring(0, arrobaIndex);
      return parteIzquierda;
    } else {
      return correoElectronico;
    }
  }
  filtrar(){
    alert(this.seleccion);
  }
  ver(indice:number){
    this.router.navigate(['/verhistorico/'+indice]);
  }
}
