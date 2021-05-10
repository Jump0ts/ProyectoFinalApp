import { Receta } from './receta';

export class Cuenta {
    
    private _correo : string = "";
    private _foto : string = "";
    private _admin : boolean = false;
    private _usuario : string = "";
    private _favoritas : Receta[] = [];
    private _masTarde : Receta[] = [];
    private _semana: Map<string, Receta[]> = new Map<string, Receta[]>();
    

    constructor(){}

    public setCuenta(correo: string, usuario: string, foto: string, admin: boolean){
        this._correo = correo;
        this._foto = foto;
        this._admin = admin;
        this._usuario = usuario;
    }

    
    public get correo() : string {
        return this._correo;
    }
    
    public get usuario() : string {
        return this._usuario;
    }

    public set usuario(cadena: string){
        this._usuario = cadena;
    }
    
    public get favoritas() : Receta[] {
        return this._favoritas;
    }
    
    public set favoritas(array: Receta[]){
        this._favoritas = array;
    }

    public get masTarde() : Receta[] {
        return this._masTarde;
    }
    
    public set masTarde(array: Receta[]){
        this._masTarde = array;
    }
    
    public get foto() : string {
        return this._foto;
    }

    public get admin() : boolean {
        return this._admin;
    }

    public get semana(): Map<string, Receta[]>{
        return this._semana;
    }

    public setDiaSemana(dia: string, array: Receta[]){
        this._semana.set(dia, array);
    }
    
    
}
