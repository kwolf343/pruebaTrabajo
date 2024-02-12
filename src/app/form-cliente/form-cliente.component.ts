import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cliente } from '../models/cliente.models';
import { ClienteService } from '../services/cliente.services';
import { v4 as uuidv4 } from 'uuid';
import { LoginService } from '../services/login.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css']
})
export class FormClienteComponent implements OnInit{
  indice:number;
  actualizar:boolean=false;
  accion:string='Nuevo';
  nombre:string;
  apellido:string;
  direccion:string;
  identificacion:string;
  telefono:string;
  listDireccion: string[] = [];
  listIdentificacion: string[] = [];
  clientes:cliente[]=[];
  boolNombre:true;
  errorNombre:string='';
  errorApellido:string='';
  errorTelefono:string='';
  errorDirecciones:string='';
  errorIdentificaciones:string='';
  cliente:cliente;
  constructor(private route:ActivatedRoute, private router:Router, private ClienteService:ClienteService, private loginService:LoginService){}
  ngOnInit(): void {
    this.indice = this.route.snapshot.params['id'];
    if (this.indice !== null && !isNaN(Number(this.indice))) {
      if(this.indice>=0){
        this.accion='Actualizar';
        this.actualizar=true;
      }
      else{
        this.router.navigate(['/cliente']);
      }
    }else{
      this.router.navigate(['/cliente']);
    }
    //Obteniendo lista de clientes
    this.ClienteService.obtenerClientes().subscribe(misClientes=>{
      try{
        this.clientes=Object.values(misClientes);
        this.ClienteService.setClientes(this.clientes);
        //Cargando cliente en formulario en caso de ser actualización
        if(this.actualizar){
          //Dos condiciones, la primera que el cliente exista y la segunda que esté en status true
          try{
            this.cliente=this.clientes[this.indice];
            if(this.cliente.status){
              this.nombre = this.cliente.nombres;
              this.apellido = this.cliente.apellidos;
              this.telefono = this.cliente.telefono;
              this.listDireccion = this.cliente.direcciones;
              this.listIdentificacion = this.cliente.identificaciones;
            }else{
              this.router.navigate(['/clientes']);
            }
          }catch{
            console.log('El cliente no existe en la lista');
            this.router.navigate(['/clientes']);
          }
        }
      }
      catch{
        this.clientes = [];
      }
    });
    
  }
  guardar(form: NgForm) {
    let usuario = this.loginService.getEmail();
    const fechaActual = new Date();
    const fechaLocal = fechaActual.toLocaleDateString();
    const horaLocal = fechaActual.toLocaleTimeString();
    if(this.validar()){
      //Guardar cliente
      if(!this.actualizar){
        let miCliente = new cliente(this.generarIdUnico(),this.nombre,this.apellido,this.telefono,this.listDireccion,this.listIdentificacion,true,fechaLocal,horaLocal,usuario,'Crear');
        this.ClienteService.agregarCliente(miCliente,1);
      }else{
        let miCliente = new cliente(this.cliente.id,this.nombre,this.apellido,this.telefono,this.listDireccion,this.listIdentificacion,true,fechaLocal,horaLocal,usuario,'Actualizar');
        if(this.comparar(this.cliente,miCliente)){
          Swal.fire(
            'Alerta!',
            'No se detectaron cambios',
            'warning'
          )
        }else{
          this.ClienteService.agregarCliente(miCliente,2);
        }
      }
    }
  }
  agregarDireccion() {
    if (this.textoVacio(this.direccion)) {
        this.errorDirecciones = 'No puede quedar vacío!';
    } else {
        // Copiar la lista antes de agregar un nuevo elemento
        this.listDireccion = [...this.listDireccion, this.direccion];
        this.errorDirecciones = '';
        this.direccion = '';
    }
}
  removerDireccion(pos: number) {
    if (pos >= 0 && pos < this.listDireccion.length) {
        // Copiar la lista antes de modificarla
        this.listDireccion = [...this.listDireccion];
        this.listDireccion.splice(pos, 1);
        this.actualizarListaDirecciones();
    } else {
        console.error('Posición no válida para eliminar elemento.');
    }
  }
  agregarIdentificacion() {
    if (this.textoVacio(this.identificacion)) {
        this.errorIdentificaciones = 'No puede quedar vacío!';
    } else {
        // Copiar la lista antes de agregar un nuevo elemento
        this.listIdentificacion = [...this.listIdentificacion, this.identificacion];
        this.errorIdentificaciones = '';
        this.identificacion = '';
    }
  }
  removerIdentificacion(pos: number) {
    if (pos >= 0 && pos < this.listIdentificacion.length) {
        // Copiar la lista antes de modificarla
        this.listIdentificacion = [...this.listIdentificacion];
        this.listIdentificacion.splice(pos, 1);
        this.actualizarListaIdentificaciones();
    } else {
        console.error('Posición no válida para eliminar elemento.');
    }
  }
  private generarIdUnico(): string {
    return uuidv4();
  }
  ListasIguales(lista1: string[], lista2: string[]): boolean {
    if (lista1.length !== lista2.length) return false;
    return lista1.every((valor, index) => valor === lista2[index]);
  }
  comparar(Cliente1: cliente, Cliente2: cliente): boolean {
    //Comparamos manualmente los campos de los clientes ya que usuario y fecha si pueden variar
    if(Cliente1.nombres!=Cliente2.nombres)return false;
    if(Cliente1.apellidos!=Cliente2.apellidos)return false;
    if(Cliente1.telefono!=Cliente2.telefono)return false;
    if(!this.ListasIguales(Cliente1.direcciones,Cliente2.direcciones)) return false;
    if(!this.ListasIguales(Cliente1.identificaciones,Cliente2.identificaciones)) return false;
    return true;
  }
  
  cancelar(){
    this.router.navigate(['/clientes']);
  }
  /////////////////////////////////////////////////////////////
  //Validaciones para formulario
  validar():boolean{
    //Verificar nombre vacío
    if(this.textoVacio(this.nombre)){
      this.errorNombre='No puede quedar vacío!';
      return false;
    }
    //Verificar caracteres invalidos en nombre
    else if(this.validarTexto(this.nombre)){
      this.errorNombre='Caracteres invalidos!';
      return false;
    }
    else {
      this.errorNombre='';
    }
    //Verificar apellido vacío
    if(this.textoVacio(this.apellido)){
      this.errorApellido='No puede quedar vacío!';
      return false;
    }
    //Verificar caracteres invalidos en apellido
    else if(this.validarTexto(this.apellido)){
      this.errorApellido='Caracteres invalidos!';
      return false;
    }
    else {
      this.errorApellido='';
    }
    //Verificar telefono vacío
    if(this.textoVacio(this.telefono)){
      this.errorTelefono='No puede quedar vacío!';
      return false;
    }else if(this.telefono.length!=8){
      this.errorTelefono='El numero debe tener 8 digitos!';
      return false;
    }else{
      this.errorTelefono='';
    }
    if(this.listDireccion.length==0){
      this.errorDirecciones='No hay direcciones agregadas';
      return false;
    }
    else {
      this.errorDirecciones='';
    }
    if(this.listIdentificacion.length==0){
      this.errorIdentificaciones='No hay identificaciones agregadas';
      return false;
    }
    else {
      this.errorIdentificaciones='';
    }
    return true;
  }
  textoVacio(cadena: string | undefined | null): boolean {
    if (cadena && cadena.trim().length > 0) return false;
    return true;
  }
  validarTexto(nombre: string): boolean {
    const patron = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;
    return !patron.test(nombre);
  }
  validarTeclaNumerica(event: KeyboardEvent): void {
    const codigoTecla = event.keyCode || event.which;
    if (
      (codigoTecla >= 37 && codigoTecla <= 40) || // Flechas
      codigoTecla === 8 || // Retroceso
      codigoTecla === 46 // Suprimir (borrar)
    ) {
      return;
    }
    if (codigoTecla >= 48 && codigoTecla <= 57) {
    } else {
      event.preventDefault();
    }
  }
  modificar(){
    /////////////////////////////////////////////////////////////
    //Creando clases CSS
    var styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    if(styleSheet.sheet!=null){
      styleSheet.sheet.insertRule(`
      .Alert_Service_window1 {
        width: 100%;
        min-height: 100%;
        position: absolute;
        top: 0; 
        left: 0;
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 7%;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .Alert_Service_window1_dentro{
        background:white;
        width: 60%;
        box-shadow: 0 0 0 100vmax rgba(0,0,0, .3);
        display:flex;
        align-items:center;
        flex-direction:column;
        justify-content: space-around;
        padding: 2%;
        border-radius: 5px;
        transition: .4s;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      @media screen and (max-width: 650px) {
        .Alert_Service_window1_dentro {
          width: 85%;
        }
      }
      `, 2);
      styleSheet.sheet.insertRule(`
      @media screen and (max-width: 1000px) {
        .Alert_Service_window1_dentro {
          width: 80%;
        }
      }
      `, 2);
      styleSheet.sheet.insertRule(`
      @media screen and (max-width: 550px) {
        .Alert_Service_window1_dentro {
          width: 100%;
        }
      }
      `, 2);
      styleSheet.sheet.insertRule(`
      .DirId{
        width: 100%;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .DirId>div{
        width: 49%;
        float:left;
        margin:0 0.5%;
        padding:1rem;
        border-radius: 1rem;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      li{
        display: flex;
        justify-content: space-between;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .classId i{
        color:red;
        transition: .4s;
        cursor: pointer;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      i:active{
        scale:90%;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .DirId ul *{
        margin:0;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .Alert_Service_window1_dentro_btn1{
        background:green;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .Alert_Service_window1_dentro>div>button{
        border:2px solid;
        border-radius: 5px;
        color: white;
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        cursor: pointer;
        transition: .3s;
        margin-top:10px;
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .Alert_Service_window1_dentro>button:active{
        transform: scale(0.9);
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .Alert_Service_window1_efecto{
        transform: scale(1.1);
      }
      `, 0);
      styleSheet.sheet.insertRule(`
      .Alert_Service_window2_btn1{
        background:blue;
      }
      `, 0);
    }
    /////////////////////////////////////////////////////////////
    //Creando elementos
    const contenedor = document.querySelector("body");
    const contenedorPrincipal = document.createElement("DIV");
    const contenedorCentral = document.createElement("DIV");
    const contenedoresCentrales = document.createElement("DIV");
    const contenedorBotones = document.createElement("DIV");
    const contenedorMitad1 = document.createElement("DIV");
    const contenedorMitad2 = document.createElement("DIV");
    const direcciones = document.createElement("H6");
    const identificaciones = document.createElement("H6");
    const ulDireccion = document.createElement("UL");
    const ulIdentificacion = document.createElement("UL");
    const Boton = document.createElement("BUTTON");
    /////////////////////////////////////////////////////////////
    //Agregando clases en elementos
    contenedorPrincipal.classList.add("Alert_Service_window1");
    contenedorCentral.classList.add("Alert_Service_window1_dentro");
    contenedoresCentrales.classList.add("DirId");
    Boton.classList.add("Alert_Service_window1_dentro_btn1");
    ulDireccion.classList.add("classDir");
    ulIdentificacion.classList.add("classId");
    /////////////////////////////////////////////////////////////
    //Preparando elementos
    direcciones.innerHTML='Direcciones';
    identificaciones.innerHTML='Identificaciones';
    Boton.innerHTML="OK";
    /////////////////////////////////////////////////////////////
    //Insertando elementos
    contenedorCentral.appendChild(contenedoresCentrales);
    contenedoresCentrales.appendChild(contenedorMitad1);
    contenedoresCentrales.appendChild(contenedorMitad2);
    contenedorMitad1.appendChild(direcciones);
    contenedorMitad2.appendChild(identificaciones);
    contenedorMitad1.appendChild(ulDireccion);
    contenedorMitad2.appendChild(ulIdentificacion);
    if (ulDireccion) {
      this.listDireccion.forEach((elemento: string, index: number) => {
        const nuevoElemento = document.createElement("LI");
        const parrafo = document.createElement("P");
        const i = document.createElement("I");
        i.classList.add("bi");
        i.classList.add("bi-x-circle");
        parrafo.innerHTML = elemento;
        
        // Agregar evento de clic al elemento I
        i.addEventListener('click', () => {
          this.removerDireccion(index);
        });
        nuevoElemento.appendChild(parrafo);
        nuevoElemento.appendChild(i);
        ulDireccion.appendChild(nuevoElemento);
      });
    }
    if (ulIdentificacion) {
      this.listIdentificacion.forEach((elemento: string, index: number) => {
        const nuevoElemento = document.createElement("LI");
        const parrafo = document.createElement("P");
        const i = document.createElement("I");
        i.classList.add("bi");
        i.classList.add("bi-x-circle");
        parrafo.innerHTML = elemento;
        
        // Agregar evento de clic al elemento I
        i.addEventListener('click', () => {
          this.removerIdentificacion(index);
        });
        nuevoElemento.appendChild(parrafo);
        nuevoElemento.appendChild(i);
        ulIdentificacion.appendChild(nuevoElemento);
      });
    }
    contenedorCentral.appendChild(contenedorBotones);
    contenedorBotones.appendChild(Boton);
    contenedorPrincipal.appendChild(contenedorCentral);
    if(contenedor!=null)contenedor.appendChild(contenedorPrincipal);
    setTimeout(function() {
      contenedorCentral.classList.add("Alert_Service_window1_efecto");
    }, 100);
    Boton.addEventListener('click', () => {
      if (contenedorPrincipal.parentElement) contenedorPrincipal.parentElement.removeChild(contenedorPrincipal);
    });
  }
  private actualizarListaDirecciones() {
    const ulDireccion = document.querySelector(".classDir");
    if (ulDireccion) {
      // Limpiar la lista actual
      ulDireccion.innerHTML = '';

      // Recrear la lista con los elementos actualizados
      this.listDireccion.forEach((elemento: string, index: number) => {
        const nuevoElemento = document.createElement("LI");
        const parrafo = document.createElement("P");
        const i = document.createElement("I");
        i.classList.add("bi");
        i.classList.add("bi-x-circle");
        parrafo.innerHTML = elemento;

        // Agregar evento de clic al elemento I
        i.addEventListener('click', () => {
          this.removerDireccion(index);
        });
        nuevoElemento.appendChild(parrafo);
        nuevoElemento.appendChild(i);
        ulDireccion.appendChild(nuevoElemento);
      });
    }
  }
  private actualizarListaIdentificaciones() {
    const ulIdentificacion = document.querySelector(".classId");
    if (ulIdentificacion) {
      // Limpiar la lista actual
      ulIdentificacion.innerHTML = '';

      // Recrear la lista con los elementos actualizados
      this.listIdentificacion.forEach((elemento: string, index: number) => {
        const nuevoElemento = document.createElement("LI");
        const parrafo = document.createElement("P");
        const i = document.createElement("I");
        i.classList.add("bi");
        i.classList.add("bi-x-circle");
        parrafo.innerHTML = elemento;

        // Agregar evento de clic al elemento I
        i.addEventListener('click', () => {
          this.removerIdentificacion(index);
        });
        nuevoElemento.appendChild(parrafo);
        nuevoElemento.appendChild(i);
        ulIdentificacion.appendChild(nuevoElemento);
      });
    }
  }
}
