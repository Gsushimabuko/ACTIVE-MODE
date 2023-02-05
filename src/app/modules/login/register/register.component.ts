import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ZCodigoService } from 'src/app/core/http/z_codigo/z-codigo.service';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  listaSexos = ["Masculino", "Femenino", "No desea especificar"]
  listaRelaciones = ["Externo", "Alumno del colegio", "Ex Alumno del colegio", "Miembro de la cooperativa", "Personal", "Otro"]
  tieneCondicion = false
  registerForm: FormGroup = this.fb.group({

    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required] ],
    dni: ['', [Validators.required, Validators.minLength(8)]],

    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellidop: ['', [Validators.required, Validators.minLength(2)]],
    apellidom:['', [Validators.required, Validators.minLength(2)]],

    telefono: ['', [Validators.required, Validators.minLength(8)]],
    dob:['', [Validators.required]],
    sexo: ['', [Validators.required]],

    direccion: ['', [Validators.required]],
    codigo :['', [Validators.required] ],
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
  
  constructor(
    private router: Router ,private fb: FormBuilder,  private usuarioService: ZUsuarioService, private codigoService:ZCodigoService, private snackbar:MatSnackBar) {
      
     }

   checkCode(){
    this.codigoPermitido = false
    this.mensajeError = ""

    if(this.registerForm.value.codigo != '' && this.registerForm.value.codigo != "Ninguno" ){
      //Check code
      this.codigoService.checkCodigo((this.registerForm.value.codigo)).subscribe(
        
        (res:any)=>{
          if(res.ok == true){
            
            this.codigoPermitido = true
            this.id_tipo_usuario = 1
            this.id_codigo = res.codigo.id
            this.checkForm()
          }
         
        },
        (err:HttpErrorResponse)=>{
          if(err.status == 404){
            this.codigoPermitido = false
            this.mensajeError = "Código inválido"
          }
          if(err.status == 500){
            this.codigoPermitido = false
            this.mensajeError = "Error en el servidor"
          }
      })

    }else{
      this.codigoPermitido = true
      this.id_tipo_usuario = 2
      this.checkForm()
    }

   }

  
  checkForm()  {
    
    if(this.codigoPermitido == false){
      return
    }

    console.log("Paso codigo perm")
    
    if(this.registerForm.value.codigo == ''){
      this.registerForm.patchValue({codigo:"Ninguno"})
    }

    console.log("Paso codigo patch value")

    console.log("Si todo esta bien deberia ser false: ", this.registerForm.invalid )

    if (this.registerForm.invalid == true){
        this.mensajeError = "Rellena todos los campos"
        console.log("invalid form")
        return
    }
    
    console.log("Paso invalid form")

    this.register()
   
    
  }

  register(){

    const usuario = { 
      correo: this.registerForm.value.correo.toLowerCase(),
      contrasena: this.registerForm.value.contrasena,

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

      id_codigo: this.id_codigo,
      id_rol: this.id_rol,
      id_tipo_usuario: this.id_tipo_usuario
    }

    this.usuarioService.createUsuario(usuario).subscribe((res: any)=>{
      if (res.ok == true){
        this.openSnackBar("¡Registro Exitoso!", 5)
        this.router.navigate(["/login"])
      } 
    }, (err:HttpErrorResponse) => {
      if(err.status == 403){
        this.mensajeError = "DNI o correo ya registrados"
      }
      if(err.status == 500){
        this.mensajeError = "Error en el servidor, intente más tarde"
      }
    })
    
    
  }

  openSnackBar(message: string, seconds: number) {
    this.snackbar.open(message, 'X', {
      duration: seconds * 1000,
    });
  }
}
