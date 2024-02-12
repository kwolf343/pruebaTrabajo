import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title="Prueba";
  ngOnInit(): void {
    firebase.initializeApp({
      apiKey: "AIzaSyARGgilWy6MR6FOARbOSDUpTcSw01uVqR0",
      authDomain: "pruebatecnica-22bd9.firebaseapp.com",
    })
  }

}
