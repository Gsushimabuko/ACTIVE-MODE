import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UPaymentService } from 'src/app/core/http/u_payment/u-payment.service';
import { LoaderService } from '../shared/loaderService/loader.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-pagos',
    templateUrl: './pagos.component.html',
    styleUrls: ['./pagos.component.css']
})
export class PagosComponent {
    uuid: string = this._route.snapshot.params['id'];
    paymentData: any = {
        var_description: '',
        num_total: 0,
        var_status: 'PENDING'
    }

    constructor(
        private readonly _route: ActivatedRoute,
        private readonly _paymentService: UPaymentService,
        private readonly _loaderService: LoaderService,
    ) {
        this._loaderService.show();

        this._paymentService.getPaymentData(this.uuid).pipe(
            finalize(() => {
                this._loaderService.hide();
            })
        ).subscribe({
            next: (data) => {
                this.paymentData = data;
                console.log(data);
            },
            error: (error) => {
                this.paymentData = {
                    var_status: 'ERROR'
                }
                console.log(error);
            }
        });
    }
}
