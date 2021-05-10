import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Receta } from 'src/app/class/receta';
import { ControladorService } from 'src/app/services/controlador.service';

@Component({
  selector: 'app-receta',
  templateUrl: './receta.page.html',
  styleUrls: ['./receta.page.scss'],
})
export class RecetaPage implements OnInit {
  protected receta: Receta;
  protected foto: string;
  protected leGusta: boolean = false;
  protected likeImg: string = "";
  private likeNegro: string = "../../../assets/icon/like_negro.png";
  private likeVerde: string = "../../../assets/icon/like_verde.png";
  protected favImg: string = "";
  private favBlanco: string = "../../../assets/icon/fav_blanco.png";
  private favRojo: string = "../../../assets/icon/fav_rojo.png";
  protected planificador: string = "../../../assets/icon/edit-calendar.png";
  protected dias: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private controlador: ControladorService, private alertController: AlertController, private afs: AngularFirestore, private router: Router) {
    
   }

   ionViewWillEnter(){
     this.receta = this.controlador.getReceta(this.activatedRoute.snapshot.paramMap.get('rec'));
    this.ngOnInit();
    }
    
    ngOnInit() {
      this.receta = this.controlador.getReceta(this.activatedRoute.snapshot.paramMap.get('rec'));
      
      
      if(this.receta == null){
        this.router.navigate(["/recetas"]);
      }
    
    if(this.receta.correoAutor == this.controlador.getUsuario().correo){
      this.foto = this.controlador.getUsuario().foto;
    }
    else{
      this.afs.collection('cuenta').doc(this.receta.correoAutor).snapshotChanges().subscribe((cuenta)=>{
        this.foto = cuenta.payload.data()['foto'];
      });
    }

    
    
    if(this.receta.likes.indexOf(this.controlador.getUsuario().correo)!=-1){
      this.likeImg = this.likeVerde;
    }
    else{
      this.likeImg = this.likeNegro;
    }

    
    

    if(this.controlador.getUsuario().favoritas.indexOf(this.receta)!=-1){
      this.favImg = this.favRojo;
    }
    else{
      this.favImg = this.favBlanco;
    }
    
  }

  protected meGusta(){
    if(this.likeImg == this.likeVerde){
      this.likeImg = this.likeNegro;
      this.controlador.actualizaMG(false, this.receta);
    }
    else{
      this.likeImg = this.likeVerde;
      this.controlador.actualizaMG(true, this.receta);
    }
  }

  protected fav(){
    if(this.favImg == this.favRojo){
      this.favImg = this.favBlanco;
      this.controlador.actualizarFav(false, this.receta);
    }
    else{
      this.favImg = this.favRojo;
      this.controlador.actualizarFav(true, this.receta);
    }
  }

  protected async alerta(tipo: string){
    const alert = await this.alertController.create({
      message: '¿Seguro que desea '+tipo+' esta receta?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary'
      },
      {
        text: 'Aceptar',
        role: 'confirm',
        cssClass: 'secondary',
        handler: ()=>{
          if(tipo=="verificar")this.verificar();
          else this.eliminar();
        }
      }]
    });

    await alert.present();
  }

  private verificar(){
    this.controlador.verificar();
  }

  private eliminar(){
    this.controlador.eliminar(this.receta);
    this.router.navigate(["/recetas"]);
  }

  protected async anadirDia(){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: '¿Qué día desea hacer la receta?',
      inputs: [{
        label: 'Lunes',
        type: 'radio',
        value: 'lunes',
        handler: (radio)=>{
          this.anadirComida(radio.value);
          alert.dismiss();
        }
      },{
        label: 'Martes',
        type: 'radio',
        value: 'martes',
        handler: (radio)=>{
          this.anadirComida(radio.value);
          alert.dismiss();
        }
      },{
        label: 'Miércoles',
        type: 'radio',
        value: 'miercoles',
        handler: (radio)=>{
          this.anadirComida(radio.value);
          alert.dismiss();
        }
      },{
        label: 'Jueves',
        type: 'radio',
        value: 'jueves',
        handler: (radio)=>{
          this.anadirComida(radio.value);
          alert.dismiss();
        }
      },{
        label: 'Viernes',
        type: 'radio',
        value: 'viernes',
        handler: (radio)=>{
          this.anadirComida(radio.value);
          alert.dismiss();
        }
      },{
        label: 'Sábado',
        type: 'radio',
        value: 'sabado',
        handler: (radio)=>{
          this.anadirComida(radio.value);
          alert.dismiss();
        }
      },{
        label: 'Domingo',
        type: 'radio',
        value: 'domingo',
        handler: (radio)=>{
          this.anadirComida(radio.value);
          alert.dismiss();
        }
      }],
      buttons: ["Cancelar"]
    });

    await alert.present();
  }

  private async anadirComida(dia: string){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: '¿A qué momento del día desea añadir la receta?',
      inputs: [{
        label: 'Desayuno',
        type: 'radio',
        value: '0',
        handler: (radio)=>{
          if(this.controlador.checkCalendar(dia, +radio.value)==false){
            this.controlador.anadirComidaSemana(dia,+radio.value, this.receta);
            this.calendarSuccess();
            alert.dismiss();
          }
          else{
            this.calendarConflict(dia,+radio.value);
            alert.dismiss();
          }
        }
      },{
        label: 'Almuerzo',
        type: 'radio',
        value: '1',
        handler: (radio)=>{
          if(this.controlador.checkCalendar(dia, +radio.value)==false){
            this.controlador.anadirComidaSemana(dia,+radio.value, this.receta);
            this.calendarSuccess();
            alert.dismiss();
          }
          else{
            this.calendarConflict(dia,+radio.value);
            alert.dismiss();
          }
        }
      },{
        label: 'Merienda',
        type: 'radio',
        value: '2',
        handler: (radio)=>{
          if(this.controlador.checkCalendar(dia, +radio.value)==false){
            this.controlador.anadirComidaSemana(dia,+radio.value, this.receta);
            this.calendarSuccess();
            alert.dismiss();
          }
          else{
            this.calendarConflict(dia,+radio.value);
            alert.dismiss();
          }
        }
      },{
        label: 'Cena',
        type: 'radio',
        value: '3',
        handler: (radio)=>{
          console.log(this.controlador.checkCalendar(dia, +radio.value));
          
          if(this.controlador.checkCalendar(dia, +radio.value)==false){
            this.controlador.anadirComidaSemana(dia,+radio.value, this.receta);
            this.calendarSuccess();
            alert.dismiss();
          }
          else{
            this.calendarConflict(dia,+radio.value);
            alert.dismiss();
          }
        }
      }],
      buttons: ["Cancelar"]
    });

    await alert.present();
  }

  private async calendarSuccess(){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: 'Receta añadida al calendario correctamente.',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  private async calendarConflict(dia: string, comida: number){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: 'Ya hay una receta añadida para este momento del día, ¿desea sustituirla?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary'
      },
      {
        text: 'Aceptar',
        role: 'confirm',
        cssClass: 'primary',
        handler: ()=>{
          this.controlador.anadirComidaSemana(dia,comida,this.receta);
          this.calendarSuccess();
        }
      }]
    });

    await alert.present();
  }

  
}
