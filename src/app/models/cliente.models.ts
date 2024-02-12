export class cliente{
    id:string;
    nombres:string;
    apellidos:string;
    telefono:string;
    direcciones: string[] = [];
    identificaciones: string[] = [];
    status:boolean;
    fecha:string;
    hora:string;
    user:string;
    accion:string;
    constructor(id:string, nombres:string, apellidos:string, telefono:string, direcciones: string[], identificaciones: string[], status:boolean, fecha:string, hora:string, user:string, accion:string){
        this.id=id;
        this.nombres=nombres;
        this.apellidos=apellidos;
        this.telefono=telefono;
        this.direcciones=direcciones;
        this.identificaciones=identificaciones;
        this.status=status;
        this.fecha=fecha;
        this.hora=hora;
        this.user=user;
        this.accion=accion;
    }
}