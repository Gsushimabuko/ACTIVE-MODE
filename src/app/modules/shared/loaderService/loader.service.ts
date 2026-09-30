import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly minimumVisibleMs = 1400;
  // Empieza visible para cubrir también la primera navegación de Angular.
  private activeLoads = 1;
  private visibleSince = Date.now();
  private hideTimer?: number;
  private readonly loading = new BehaviorSubject<boolean>(true);
  readonly loading$ = this.loading.asObservable();

  constructor() { }

  show() {
    if (this.hideTimer !== undefined) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
    this.activeLoads += 1;
    if (!this.loading.value) {
      this.visibleSince = Date.now();
      this.loading.next(true);
    }
  }

  hide() {
    this.activeLoads = Math.max(0, this.activeLoads - 1);
    if (this.activeLoads > 0 || !this.loading.value) return;

    const remaining = this.minimumVisibleMs - (Date.now() - this.visibleSince);
    if (remaining <= 0) {
      this.loading.next(false);
      return;
    }

    this.hideTimer = window.setTimeout(() => {
      this.hideTimer = undefined;
      if (this.activeLoads === 0) this.loading.next(false);
    }, remaining);
  }
}
