import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ZUsuarioService } from 'src/app/core/http/z_usuario/z-usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  usuario! : Usuario
  constructor(private usuarioService: ZUsuarioService, private router: Router){
    this.usuario = usuarioService.usuario
  }

  logout(){
    
      localStorage.clear()
      this.router.navigateByUrl('/login')
    
  }
}
