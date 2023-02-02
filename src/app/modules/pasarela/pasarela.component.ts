import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Card } from 'src/app/interfaces/card';

@Component({
  selector: 'app-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent implements OnInit {
  
  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      cardNumber: this._fb.control('', [Validators.required]),
      holderName: this._fb.control('', [Validators.required]),
      yearExp: this._fb.control('', [Validators.required]),
      monthExp: this._fb.control('', [Validators.required]),
      cvv2: this._fb.control('', [Validators.required]),
      city: this._fb.control('', [Validators.required]),
      line1: this._fb.control('', [Validators.required]),
      line2: this._fb.control('', [Validators.required]),
      line3: this._fb.control('', [Validators.required]),
      state: this._fb.control('', [Validators.required]),
      countryCode: this._fb.control('', [Validators.required]),
    });
    
    
  }
  
  ngOnInit(): void {
    //Config
    OpenPay.setId('m65bzifhawsoqryayhex');
    OpenPay.setApiKey('pk_f9d34a0a522b407ab465f942932c7849');
    OpenPay.setSandboxMode(true);
    
    this.deviceSessionId = OpenPay.deviceData.setup("formId");
    console.log(this.deviceSessionId);
    
  }

  form: FormGroup;
  deviceSessionId: string = '';

  cardInfo: Card = {
    card_number: '',
    holder_name: '',
    expiration_year: '',
    expiration_month: '',
    cvv2: '',
    address: {
      city: '',
      line1: '',
      line2: '',
      line3: '',
      postal_code: '',
      state: '',
      country_code: '',
    }
  }

  getCardInfo() {
    this.cardInfo = {
      card_number: this.form.get('cardNumber')?.value,
      holder_name: this.form.get('holderName')?.value,
      expiration_year: this.form.get('yearExp')?.value,
      expiration_month: this.form.get('monthExp')?.value,
      cvv2: this.form.get('cvv2')?.value,
      address: {
        city: this.form.get('city')?.value,
        line1: this.form.get('line1')?.value,
        line2: this.form.get('line2')?.value,
        line3: this.form.get('line3')?.value,
        postal_code: this.form.get('cardNumber')?.value,
        state: this.form.get('state')?.value,
        country_code: this.form.get('countryCode')?.value,
      }
    }
  }

  createToken() {
    const cardInfoText = {
      "card_number":"4111111111111111",
      "holder_name":"Juan Perez Ramirez",
      "expiration_year":"20",
      "expiration_month":"12",
      "cvv2":"110",
      "address":{
        "city":"Querétaro",
        "line3":"Queretaro",
        "postal_code":"76900",
        "line1":"Av 5 de Febrero",
        "line2":"Roble 207",
        "state":"Queretaro",
        "country_code":"MX"
      }
    };

    OpenPay.token.create(this.cardInfo, (response: any) => {
      alert('Operación exitosa');

      //Set content
      const content = {
        cardId: response.data.id,
        holderName: response.data.holder_name,
        brand: response.data.brand
      }

      console.log(response);
    }, (error: any) => {
      alert('Fallo en la transacción');

      const content = {
        status: error.data.status,
        message: error.data.message,
        description: error.data.description,
        requestId: error.data.request_id,
      }

      console.log(error);
    });
  }
}
