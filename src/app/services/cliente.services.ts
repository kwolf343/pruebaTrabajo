import { Injectable } from "@angular/core";
import { cliente } from "../models/cliente.models";
import { DataServices } from "./data.services";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { LoginService } from "./login.service";

@Injectable()
export class ClienteService{
    cliente:cliente[]=[];
    constructor(private dataService:DataServices, private router:Router,private loginService:LoginService){}
    setClientes(misClientes:cliente[]){
        this.cliente=misClientes;
    }
    //Accion: 1 Crear, 2 Actualizar
    agregarCliente(c:cliente, accion:number){
        const clientes = this.cliente;
        this.cliente.push(c);
        this.dataService.guardarClientes(this.cliente).subscribe(resultado=>{
            let mensaje = ['Cliente guardado correctamente','Cliente actualizado correctamente'];
            let error = ['Ocurrio un error al intentar guardar el cliente','Ocurrio un error al intentar actualizar el cliente'];
            if(resultado){
                Swal.fire(
                    'Exito!',
                    mensaje[accion-1],
                    'success'
                  ).then((result) => {
                    this.router.navigate(['/clientes']);
                  })
            }else{  
                Swal.fire(
                    'Error!',
                    error[accion-1],
                    'error'
                  ).then((result) => {
                    this.cliente=clientes;
                    this.router.navigate(['/clientes']);
                  })
            }
        });
    }
    eliminarCliente(indice: number) {
      const clientes = [...this.cliente];
      const c = { ...clientes[indice] };
      c.accion = 'Eliminar';
      c.status = false;
      this.cliente[indice].status = false;
      const fechaActual = new Date();
      const fechaLocal = fechaActual.toLocaleDateString();
      const horaLocal = fechaActual.toLocaleTimeString();
      c.fecha = fechaLocal;
      c.hora = horaLocal;
      c.user = this.loginService.getEmail();
      this.cliente.push(c);
      this.dataService.guardarClientes(this.cliente).subscribe(resultado => {
        if (resultado) {
          Swal.fire(
            'Éxito!',
            'Cliente eliminado correctamente',
            'success'
          ).then((result) => {
            this.router.navigate(['/clientes']);
          })
        } else {
          Swal.fire(
            'Error!',
            'Ocurrió un error al intentar eliminar el cliente',
            'error'
          ).then((result) => {
            this.cliente = clientes;  // Restaurar el array original
            this.router.navigate(['/clientes']);
          })
        }
      });
    }
      BorrarCliente(indice:number){
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
            var c = this.cliente[indice];
            c.status=false;
            this.cliente[indice] = c;
            this.dataService.actualizarCliente(indice,c);
            if(this.cliente!=null) this.dataService.guardarClientes(this.cliente).subscribe(resultado=>{
              if(resultado){
                Swal.fire(
                  '¡Borrada!',
                  'El cliente a sido borrado.',
                  'success'
                ).then((result) => {
                  this.router.navigate(['/clientes']);
                })
              }else{
                Swal.fire(
                  'Error!',
                  'Ocurrio un error al intentar eliminar el cliente',
                  'error'
                ).then((result) => {
                  var c = this.cliente[indice];
                  c.status=true;
                  this.cliente[indice] = c;
                })
              }
            });
          }
        })
      }
      actualizarCliente(indice: number, nuevoCliente: cliente) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se actualizará el cliente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, Actualizar!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.cliente[indice] = nuevoCliente;
                this.dataService.actualizarCliente(indice, nuevoCliente).subscribe(resultado=>{
                  if(resultado){
                    if (this.cliente != null) {
                      this.dataService.guardarClientes(this.cliente);
                    }
                    Swal.fire(
                        '¡Actualizado!',
                        'El cliente ha sido actualizado.',
                        'success'
                    ).then((result) => {
                      this.router.navigate(['/clientes']);
                    })
                  }else{
                    Swal.fire(
                      'Error!',
                      'Ocurrio un error al intentar actualizar el cliente',
                      'error'
                    ).then((result) => {
                      var c = this.cliente[indice];
                      c.status=true;
                      this.cliente[indice] = c;
                    })
                  }
                });
            }
        });
    }
    //Devolverá una lista con las posiciones de los clientes que no estan en status de eliminado
    //y que son los ultimos actualizados
    obtenerPosClientes(): number[] {
      let listaPos: number[] = [];
      let listaId: string[] = [];
      for(let i=this.cliente.length;i>0;i--){
        if(!listaId.includes(this.cliente[i-1].id)){
          listaId.push(this.cliente[i-1].id);
          if(this.cliente[i-1].status){
            listaPos.push(i-1);
          }
        }
      }
      return listaPos;
    }
    obtenerClientes(){
        return this.dataService.cargarClientes();
    }
}