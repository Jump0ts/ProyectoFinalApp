import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ControladorService } from 'src/app/services/controlador.service';

@Component({
  selector: 'app-new-receta',
  templateUrl: './new-receta.page.html',
  styleUrls: ['./new-receta.page.scss'],
})
export class NewRecetaPage implements OnInit {

  protected url: string;
  protected titulo: string;
  protected descripcion: string;
  protected propiedades: string[] = [];
  protected errorImagen: boolean = false;
  protected errorDesc: boolean = false;
  protected errorTitle: boolean = false;
  protected imageSelected: boolean = false;
  protected glutenFree: boolean = false;
  protected vegan: boolean = false;
  protected vegie: boolean = false;
  protected fishFree: boolean = false;
  protected sugarFree: boolean = false;
  protected saltFree: boolean = false;
  protected file: File;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  constructor(private fBuilder: FormBuilder, private controlador: ControladorService, private router: Router, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.authState.subscribe((user)=>{
      if(user == null){
        this.router.navigate(['/login']); 
      }
    });
  }

  protected detectarArchivo(event){
    let reader = new FileReader;
    this.file = event.target.files[0];


    reader.onload = (e: any)=>{
      if(e.target.result.indexOf("image")!=-1){
        this.errorImagen = false;
        this.imageSelected = true;
        this.url = e.target.result;
        this.onChange.emit(this.file);
      }
      else{
        this.url = "";
        this.errorImagen = true;
        this.imageSelected = false;
        this.file = null;
      }
    }
    if(this.file!=null)reader.readAsDataURL(this.file);
  }

  protected anadir(){
    if(this.titulo=="")this.errorTitle = true;
    else this.errorTitle = false;
    if(this.descripcion=="")this.errorDesc = true;
    else this.errorDesc = false;

    if(this.errorTitle==false && this.errorDesc==false && this.imageSelected==true){
      this.propiedades = [];
      if(this.glutenFree==true)this.propiedades.push("glutenFree");
      if(this.vegan==true)this.propiedades.push("vegan");
      if(this.vegie==true)this.propiedades.push("vegie");
      if(this.fishFree==true)this.propiedades.push("fishFree");
      if(this.sugarFree==true)this.propiedades.push("sugarFree");
      if(this.saltFree==true)this.propiedades.push("saltFree");
      


      this.controlador.uploadReceta(this.titulo,this.descripcion.split("\n"),this.propiedades,this.file);
      
      this.router.navigate(['/recetas']);
    }


  }

}
