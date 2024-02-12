import { Component } from '@angular/core';
import { cliente } from '../models/cliente.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../services/cliente.services';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['../inspeccionar-component/inspeccionar-component.component.css']
})
export class HistoricoComponent {
  indice:number;
  clientes:cliente[]=[];
  cliente:cliente;
  posListClientesRevez:number[]=[];
  constructor(private route:ActivatedRoute, private router:Router, private ClienteService:ClienteService){}
  ngOnInit(): void {
    this.indice = this.route.snapshot.params['id'];
    if (this.indice !== null && !isNaN(Number(this.indice))) {
      if(this.indice>=0){
        this.ClienteService.obtenerClientes().subscribe(misClientes=>{
          try{
            this.clientes=Object.values(misClientes);
            this.ClienteService.setClientes(this.clientes);
            try{
              this.cliente=this.clientes[this.indice];
            }catch{
              this.router.navigate(['/historico']);
            }
          }
          catch{
            this.clientes = [];
          }
        });
      }
      else{
        this.router.navigate(['/historico']);
      }
    }else{
      this.router.navigate(['/historico']);
    }
  }
  regresar(){
    this.router.navigate(['/historico']);
  }
}
