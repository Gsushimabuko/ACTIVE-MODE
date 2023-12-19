import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-menu-puerta',
  templateUrl: './menu-puerta.component.html',
  styleUrls: ['./menu-puerta.component.css']
})
export class MenuPuertaComponent {
  usuario! : Usuario
  constructor(private usuarioService: ZUsuarioService, private router: Router){
    this.usuario = usuarioService.usuario
  }

  logout(){
    
      localStorage.clear()
      this.router.navigateByUrl('/login/admin')
    
  }
}
