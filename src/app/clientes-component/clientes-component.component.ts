import { Component, OnInit } from '@angular/core';
import { cliente } from '../models/cliente.models';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-component',
  templateUrl: './clientes-component.component.html',
  styleUrls: ['./clientes-component.component.css']
})
export class ClientesComponentComponent implements OnInit{
  clientes:cliente[]=[];
  listaVisualClientes:cliente[]=[];
  posListClientes:number[]=[];
  posListClientesRevez:number[]=[];
  indice:number;
  constructor(private router:Router, private clientesService:ClienteService){}
  ngOnInit(): void {
    this.clientesService.obtenerClientes().subscribe(misClientes=>{
      try{
        this.clientes=Object.values(misClientes);
        this.clientesService.setClientes(this.clientes);
        this.actualizarLista();
      }
      catch{
        this.clientes = [];
      }
    });
  }
  inspeccionarCliente(indice:number){
    this.router.navigate(['/inspeccionar/'+indice]);
  }
  editarCliente(indice:number){
    this.router.navigate(['/cliente/'+this.posListClientesRevez[indice]]);
  }
  eliminarCliente(indice:number){
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Se eliminará este cliente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.eliminarCliente(this.posListClientesRevez[indice]);
        this.actualizarLista();
      }
    })
  }
  nuevoCliente(){
    this.router.navigate(['/cliente']);
  }
  actualizarLista(){
    let lista = this.clientesService.obtenerPosClientes();
    this.listaVisualClientes=[];
    for(let i=lista.length-1;i>=0;i--){
      this.listaVisualClientes.push(this.clientes[lista[i]]);
    }
    for(let i=lista.length-1;i>=0;i--){
      this.posListClientesRevez.push(lista[i]);
    }
  }
}
