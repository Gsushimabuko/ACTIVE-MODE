import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ZCodigoService } from 'src/app/core/http/z_codigo/z-codigo.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-familia',
  templateUrl: './familia.component.html',
  styleUrls: ['./familia.component.css']
})
export class FamiliaComponent {
  loader:boolean= true
  usuario! : Usuario
  familia!: Usuario[]

  constructor(private usuarioService: ZUsuarioService, private router: Router ,private fb: FormBuilder,   private codigoService:ZCodigoService, private snackbar:MatSnackBar){
    this.usuario = usuarioService.usuario
    this.usuarioService.getRelatives(this.usuario.id).subscribe((res => {
      this.familia = res
      this.loader =false
    }))
  }

  listaSexos = ["Masculino", "Femenino", "No desea especificar"]
  listaRelaciones = ["Externo", "Alumno del colegio", "Ex Alumno del colegio", "Miembro de la cooperativa", "Personal", "Otro"]
  tieneCondicion = false
  registerForm: FormGroup = this.fb.group({

    
    dni: ['', [Validators.required, Validators.minLength(8)]],

    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidop: ['', [Validators.required, Validators.minLength(2)]],
    apellidom:['', [Validators.required, Validators.minLength(2)]],

    telefono: ['', [Validators.required, Validators.minLength(8)]],
    dob:['', [Validators.required]],
    sexo: ['', [Validators.required]],

    direccion: ['', [Validators.required]],
    //codigo :['', [Validators.required] ],
    relacion: ['', [Validators.required]],
   
  })

  fechaMaxima: Date = new Date()
  fechaMinima:any
  hoy: Date = new Date()

  id_rol:  number = 1;
  id_tipo_usuario!: number;
  id_codigo: number = 0;

  hide = true;
  mensajeError: string = ""
  codigoPermitido = false
 

checkTipoUsuario(){
  const relacion = this.registerForm.value.relacion
  if (relacion == "Externo" || relacion == "Otro" ){
    this.id_tipo_usuario = 2
  } else{
    this.id_tipo_usuario = 1
  }
  console.log("TIPO USUARIO ", this.id_tipo_usuario )

}
  checkForm()  {

    if (this.registerForm.invalid == true){
        this.mensajeError = "Rellena todos los campos"
        console.log("invalid form")
        return
    }
    

    this.checkTipoUsuario()

    this.register()
   
    
  }

  register(){

   

    const usuario = { 
      

      dni: this.registerForm.value.dni,
      nombre: this.registerForm.value.nombre,
      apellidop:this.registerForm.value.apellidop,
      apellidom:this.registerForm.value.apellidom,

      telefono: this.registerForm.value.telefono,
      dob:this.registerForm.value.dob,
      sexo: this.registerForm.value.sexo,

      direccion: this.registerForm.value.direccion,
      codigo :this.registerForm.value.codigo,
      relacion: this.registerForm.value.relacion,

      id_codigo: 1,
      id_rol: this.id_rol,
      id_tipo_usuario: this.id_tipo_usuario,
      id_padre: this.usuario.id

    }
    console.log("usuario: ", usuario)

    this.usuarioService.createRelativo(usuario).subscribe((res: any)=>{
      if (res.ok == true){
        this.openSnackBar("¡Registro Exitoso!", 5)
        this.router.navigate(["/matricula/dashboard"])
      } 
    }, (err:HttpErrorResponse) => {
      if(err.status == 500){
        this.mensajeError = "DNI o correo ya registrados"
      }
     
    })
    
    
  }

  openSnackBar(message: string, seconds: number) {
    this.snackbar.open(message, 'X', {
      duration: seconds * 1000,
    });
  }
}
