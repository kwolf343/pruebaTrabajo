import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponentComponent } from './navbar-component/navbar-component.component';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponentComponent } from './inicio-component/inicio-component.component';
import { ErrorPersonalizadoComponentComponent } from './error-personalizado-component/error-personalizado-component.component';
import { FormClienteComponent } from './form-cliente/form-cliente.component';
import { FormsModule } from '@angular/forms';
import { DataServices } from './services/data.services';
import { ClienteService } from './services/cliente.services';
import { HttpClientModule} from '@angular/common/http';
import { ClientesComponentComponent } from './clientes-component/clientes-component.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { LoginService } from './services/login.service';
import { RegistroComponentComponent } from './registro-component/registro-component.component';
import { LoginGuardian } from './login-component/login-guardian';
import { HistoricoComponentComponent } from './historico-component/historico-component.component';
import { InspeccionarComponentComponent } from './inspeccionar-component/inspeccionar-component.component';
import { HistoricoComponent } from './historico/historico.component';
import { ReporteServices } from './services/reporte.services';

const appRoutes:Routes=[
  {path:'', component:InicioComponentComponent},
  {path:'cliente', component:FormClienteComponent,canActivate:[LoginGuardian]},
  {path:'cliente/:id', component:FormClienteComponent,canActivate:[LoginGuardian]},
  {path:'clientes', component:ClientesComponentComponent,canActivate:[LoginGuardian]},
  {path:'historico', component:HistoricoComponentComponent,canActivate:[LoginGuardian]},
  {path:'verhistorico/:id', component:HistoricoComponent,canActivate:[LoginGuardian]},
  {path:'inspeccionar/:id', component:InspeccionarComponentComponent,canActivate:[LoginGuardian]},
  {path:'login', component:LoginComponentComponent},
  {path:'registro', component:RegistroComponentComponent},
  {path:'**', component:ErrorPersonalizadoComponentComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponentComponent,
    InicioComponentComponent,
    ErrorPersonalizadoComponentComponent,
    FormClienteComponent,
    ClientesComponentComponent,
    LoginComponentComponent,
    RegistroComponentComponent,
    HistoricoComponentComponent,
    InspeccionarComponentComponent,
    HistoricoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [DataServices,ClienteService,LoginGuardian,LoginService,ReporteServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
