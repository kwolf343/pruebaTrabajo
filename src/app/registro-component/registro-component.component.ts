import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registro-component',
  templateUrl: './registro-component.component.html',
  styleUrls: ['./registro-component.component.css']
})
export class RegistroComponentComponent {
  constructor(private loginService:LoginService){}

  error:string="";

  registrar(form:NgForm){
    const email = form.value.email;
    const password = form.value.password;
    this.loginService.registrar(email,password);
  }
}
