import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor() { }

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }
}
