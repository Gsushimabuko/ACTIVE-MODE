import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';

@Component({
  selector: 'app-correo-contrasena',
  templateUrl: './correo-contrasena.component.html',
  styleUrls: ['./correo-contrasena.component.css']
})
export class CorreoContrasenaComponent {
  constructor(
    private usuarioService: ZUsuarioService,
    public dialogRef: MatDialogRef<CorreoContrasenaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder
  ) {
    this.correoForm = this._fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  correoForm: FormGroup;

  errorCorreo: boolean = false;
  correoEnviado = false;
  loading: boolean = false;

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendEmail() {
    this.loading = true;
    this.errorCorreo = false;

    if (this.correoForm.invalid) {
      this.correoForm.markAllAsTouched();
      this.errorCorreo = true;
      return;
    }

    this.usuarioService.enviarCorreoContrasena(this.correoForm.value).subscribe(result => {
      console.log(result);

      this.loading = false;
      this.correoEnviado = true;
    }, error => {
      console.log(error);

      this.loading = false;
      this.errorCorreo = true;
    });
  }
}
