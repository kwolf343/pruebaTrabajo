import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.services';
import { ActivatedRoute, Router } from '@angular/router';
import { cliente } from '../models/cliente.models';

@Component({
  selector: 'app-inspeccionar-component',
  templateUrl: './inspeccionar-component.component.html',
  styleUrls: ['./inspeccionar-component.component.css']
})
export class InspeccionarComponentComponent implements OnInit{
  indice:number;
  clientes:cliente[]=[];
  cliente:cliente;
  posListClientesRevez:number[]=[];
  constructor(private route:ActivatedRoute, private router:Router,private ClienteService:ClienteService){}
  ngOnInit(): void {
    this.indice = this.route.snapshot.params['id'];
    if (this.indice !== null && !isNaN(Number(this.indice))) {
      if(this.indice>=0){
        this.ClienteService.obtenerClientes().subscribe(misClientes=>{
          try{
            this.clientes=Object.values(misClientes);
            this.ClienteService.setClientes(this.clientes);
            let lista = this.ClienteService.obtenerPosClientes();
            if(lista.length==0)this.router.navigate(['/clientes']);
            try{
              for(let i=lista.length-1;i>=0;i--){
                this.posListClientesRevez.push(lista[i]);
              }
              if(this.indice>this.posListClientesRevez.length-1){
                this.router.navigate(['/clientes']);
              }
              this.cliente=this.clientes[this.posListClientesRevez[this.indice]];
            }catch{
              this.router.navigate(['/clientes']);
            }
          }
          catch{
            this.clientes = [];
          }
        });
      }
      else{
        this.router.navigate(['/clientes']);
      }
    }else{
      this.router.navigate(['/clientes']);
    }
  }
  regresar(){
    this.router.navigate(['/clientes']);
  }
}
