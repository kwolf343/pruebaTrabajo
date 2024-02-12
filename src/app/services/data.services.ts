import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cliente } from "../models/cliente.models";
import { Observable, catchError, of } from 'rxjs';
import { LoginService } from "./login.service";
import { Router } from "@angular/router";

@Injectable()
export class DataServices{
    constructor(private HttpClient:HttpClient, private loginService:LoginService,private router:Router){}
    cargarClientes() {
        const token = this.loginService.getIdToken();
        return this.HttpClient.get('https://pruebatecnica-22bd9-default-rtdb.firebaseio.com/datosClientes.json?auth=' + token)
            .pipe(
                catchError((error) => {
                    console.log('Error al cargar clientes ' + error);
                    if (error.status === 401) {
                        this.loginService.logout();
                        this.router.navigate(['/login']);
                    }
                    return of([]);
                })
            );
    }
    guardarClientes(clientes: cliente[]): Observable<boolean> {
        const token = this.loginService.getIdToken();
        return new Observable<boolean>((observer) => {
            this.HttpClient.put('https://pruebatecnica-22bd9-default-rtdb.firebaseio.com/datosClientes.json?auth=' + token, clientes).subscribe({
                next: (response) => {
                    console.log('Se han guardado los clientes ' + response);
                    observer.next(true);
                    observer.complete();
                },
                error: (error) => {
                    console.log('Error' + error);
                    if(error.status=='401'){
                        //Cerrar sesión
                        this.loginService.logout();
                        this.router.navigate(['/login']);
                    }
                    observer.next(false);
                    observer.complete();
                },
            });
        });
    }
    eliminarCliente(indice:number): Observable<boolean>{
        const token = this.loginService.getIdToken();
        return new Observable<boolean>((observer) => {
            let url = 'https://pruebatecnica-22bd9-default-rtdb.firebaseio.com/datosClientes/'+indice+'.json?auth='+token;
            this.HttpClient.delete(url).subscribe({
                next: (response) => {
                    console.log('Se a eliminado correctamente el cliente ' + response);
                    observer.next(true);
                    observer.complete();
                },
                error: (error) => {
                    console.log('Error' + error);
                    if(error.status=='401'){
                        //Cerrar sesión
                        this.loginService.logout();
                        this.router.navigate(['/login']);
                    }
                    observer.next(false);
                    observer.complete();
                },
            });
        });
    }
    actualizarCliente(indice: number, nuevoCliente: cliente): Observable<boolean>{
        const token = this.loginService.getIdToken();
        return new Observable<boolean>((observer) => {
            let url = 'https://pruebatecnica-22bd9-default-rtdb.firebaseio.com/datosClientes/'+indice+'.json?auth='+token;
            this.HttpClient.put(url, nuevoCliente).subscribe({
                next: (response) => {
                    console.log('Se ha actualizado correctamente el cliente ' + response);
                    observer.next(true);
                    observer.complete();
                },
                error: (error) => {
                    console.log('Error' + error);
                    if(error.status=='401'){
                        //Cerrar sesión
                        this.loginService.logout();
                        this.router.navigate(['/login']);
                    }
                    observer.next(false);
                    observer.complete();
                },
            });
        });
    }
}