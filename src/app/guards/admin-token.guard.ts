import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ZUsuarioService } from '../core/http/z_usuario/z-usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminTokenGuard implements CanActivate, CanLoad {
  constructor(private usuarioService: ZUsuarioService , 
    private router: Router ){}
  canActivate(): Observable<boolean> | boolean  {
    return this.usuarioService.validarTokenAdmin()
    .pipe(
      tap( valid => {
        console.log("VALID", valid)
        if(valid != true){
          console.log("IVALID")
          this.router.navigateByUrl('/login/admin')
        }
      })
    );
  }
  canLoad(): Observable<boolean>  | boolean  {
    return this.usuarioService.validarTokenAdmin()
    .pipe(
      
      tap( valid => 
        {    console.log("VALID", valid)
        if(valid != true){
          console.log("IVALID")
           this.router.navigateByUrl('/login/admin')
        }
      })
    );
  }
}
