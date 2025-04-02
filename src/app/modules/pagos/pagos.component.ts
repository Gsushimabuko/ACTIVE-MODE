import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UPaymentService } from 'src/app/core/http/u_payment/u-payment.service';

@Component({
    selector: 'app-pagos',
    templateUrl: './pagos.component.html',
    styleUrls: ['./pagos.component.css']
})
export class PagosComponent {
    uuid: string = this._route.snapshot.params['id'];

    constructor(
        private readonly _route: ActivatedRoute,
        private readonly _paymentService: UPaymentService,
    ) { 
        
    }

    ngOnInit(): void {
        console.log(this.uuid);
    }
}
