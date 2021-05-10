import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ControladorService } from '../services/controlador.service';

export class Receta {

    private _id: string;
    private _titulo: string;
    private _descripcion: string[];
    private _correoAutor : string;
    private _propiedades: string[];
    private _verificado: boolean;
    private _likes: string[];
    private _fecha: string;
    private _foto: string;

    constructor(id: string, titulo: string, descripcion: string[], correoA: string, propiedades: string[], verificado: boolean, likes: string[], fecha: string, foto: string){
        this._id = id;
        this._descripcion = descripcion;
        this._titulo = titulo;
        this._correoAutor = correoA;
        this._propiedades = propiedades;
        this._verificado = verificado;
        this._likes = likes;
        this._fecha = fecha;
        this._foto = foto;
        
    }

    
    
    public get id() : string {
        return this._id;
    }
    

    public get titulo() : string {
        return this._titulo;
    }
    
    
    public get descripcion() : string[] {
        return this._descripcion;
    }
    
    
    public get correoAutor() : string {
        return this._correoAutor;
    }

    public get propiedades() : string[] {
        return this._propiedades;
    }

    public get verificado() : boolean {
        return this._verificado;
    }

    public set verificado(bool: boolean){
        this._verificado = bool;
    }

    public get likes() : string[] {
        return this._likes;
    }

    public get fecha() : string {
        return this._fecha;
    }
    
    public get foto() : string {
        return this._foto;
    }
    
    
}
