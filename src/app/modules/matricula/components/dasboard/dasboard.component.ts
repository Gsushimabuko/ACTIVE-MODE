import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.css']
})
export class DasboardComponent {

  usuario! : Usuario
  constructor(private usuarioService: ZUsuarioService, private router: Router){
    this.usuario = usuarioService.usuario
  }

  logout(){
    
      localStorage.clear()
      this.router.navigateByUrl('/login')
    
  }
}
