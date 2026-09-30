import { Component, OnDestroy } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from './modules/shared/loaderService/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'Inscripción | Active Mode';
  isLoading$ = this.loaderService.loading$;
  private firstNavigation = true;
  private readonly routerSubscription: Subscription;

  constructor(private readonly loaderService: LoaderService, router: Router) {
    this.routerSubscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!this.firstNavigation) this.loaderService.show();
        return;
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loaderService.hide();
        this.firstNavigation = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
