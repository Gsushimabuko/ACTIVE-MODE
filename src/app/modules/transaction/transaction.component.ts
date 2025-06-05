import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UTransactionService } from 'src/app/core/http/u_transaction/u-transaction.service';
import { LoaderService } from '../shared/loaderService/loader.service';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  uuid: string = this._route.snapshot.params['uuid'];
  status: string = '';
  transaction: any;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _transactionService: UTransactionService,
    private readonly _loaderService: LoaderService,
    private readonly _location: Location,
  ) {
    this._loaderService.show();

    this._transactionService.getTransaction(this.uuid).pipe(
      finalize(() => {
        this._loaderService.hide();
      })
    ).subscribe({
      next: (data: any) => {
        console.log(data);

        this.transaction = {
          orderUuid: data.payment_uuid,
          errorMessage: data.var_message,
          amount: Number(data.num_amount),
          brand: data.var_card_type.toUpperCase(),
          card: data.var_card,
          date: this.parseCustomData(data.var_date),
        }

        this.status = data.var_status == '200' ? 'success' : 'error';
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  parseCustomData(customDate: string) {
    const year = parseInt(customDate.slice(0, 2), 10) + 2000;
    const month = parseInt(customDate.slice(2, 4), 10) - 1;
    const day = parseInt(customDate.slice(4, 6), 10);
    const hour = parseInt(customDate.slice(6, 8), 10);
    const minute = parseInt(customDate.slice(8, 10), 10);
    const second = parseInt(customDate.slice(10, 12), 10);

    return new Date(year, month, day, hour, minute, second);
  }

  goBack() {
    this._router.navigate(['/pagos/' + this.transaction.orderUuid], {
      queryParams: { token: this._route.snapshot.queryParamMap.get('token') ?? null }
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
}
