import { Component } from '@angular/core';
import { LoaderService } from './modules/shared/loaderService/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inscripción | Active Mode';
  isLoading$ = this.loaderService.loading$;

  constructor(private readonly loaderService: LoaderService) {}
}
