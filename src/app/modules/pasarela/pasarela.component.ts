import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasarelaService } from 'src/app/core/http/pasarela/pasarela.service';
import { environment } from 'src/app/environments/environment';
import { Card } from 'src/app/interfaces/card';

@Component({
  selector: 'app-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent implements OnInit {
  @Input() listaPagosPrecio: any;
  @Input() idUsuario!: number;
  @Input() monto!: number;
  @Input() fechaCalendario!: Date;
  @Output() pagoAceptado: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() matricula: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('anoInput') anoInput!: ElementRef;
  
  departments: string[] = ['Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao', 'Cusco' , 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima', 'Loreto', '	Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'];

  errorFlag: boolean = false;
  errorMessage: string = '';
  
  constructor(private _fb: FormBuilder,
    private pasarelaService: PasarelaService) {
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
      postalCode: this._fb.control('', [Validators.required]),
      state: this._fb.control('', [Validators.required]),
      countryCode: this._fb.control('', [Validators.required]),
    });

    
    
    
  }
  
  ngOnInit(): void {
    //Config
    OpenPay.setId(environment.ID);
    OpenPay.setApiKey(environment.PK_KEY);
    OpenPay.setSandboxMode(false);
    
    this.deviceSessionId = OpenPay.deviceData.setup("formId", "deviceIdHiddenFieldName");
    //console.log(this.deviceSessionId);
  }

  form: FormGroup;
  deviceSessionId: string = '';

  cardInfo: Card = {
    card_number: '',
    holder_name: '',
    expiration_year: '',
    expiration_month: '',
    cvv2: '',
    /*
    address: {
      city: '',
      line1: '',
      line2: '',
      line3: '',
      postal_code: '',
      state: '',
      country_code: 'PE',
    } */
  }

  checkLength(limite:number){
    const valor = this.anoInput.nativeElement.value
    this.anoInput.nativeElement.value = valor.slice(0, limite)
  }

  getCardInfo() {
    this.cardInfo = {
      card_number: this.form.get('cardNumber')?.value,
      holder_name: this.form.get('holderName')?.value,
      expiration_year: this.form.get('yearExp')?.value,
      expiration_month: this.form.get('monthExp')?.value,
      cvv2: this.form.get('cvv2')?.value,
      /*
      address: {
        city: this.form.get('city')?.value,
        line1: this.form.get('line1')?.value,
        line2: this.form.get('line2')?.value,
        line3: this.form.get('line3')?.value,
        postal_code: '15012',//this.form.get('postalCode')?.value,
        state: this.form.get('state')?.value,
        country_code: 'PE',
      }
      */
    }
  }

  sendSignal(){
    this.matricula.emit(true);
  }

  createToken() {
    this.errorFlag = false;

    this.getCardInfo();

    OpenPay.token.create(this.cardInfo, (response: any) => {
      //alert('Operación exitosa');

      //Charga data - First 4 fields are from customer
      const chargeData = {
        source_id: response.data.id,
        amount: this.monto,
        description: 'Pago de matrícula a talleres de Active Mode',
        use_card_points: false,
        deviceIdHiddenFieldName: this.deviceSessionId,
      }

      //console.log(chargeData);
      //console.log(this.listaPagosPrecio);
      //console.log(this.idUsuario);
      //console.log(response);

      const ano = this.fechaCalendario.getFullYear()
      const mes = this.fechaCalendario.getMonth()

      //Enviar formulario
      this.pasarelaService.createPayment(chargeData, this.listaPagosPrecio, this.idUsuario,ano,mes).subscribe((data) => {
        //console.log(data);
        this.pagoAceptado.emit(true)
      }, (error: any) => {
        this.errorFlag = true;
        this.errorMessage = error.error.mensaje;

        this.pagoAceptado.emit(false);
      });
    }, (error: any) => {
      this.errorFlag = true;
      this.errorMessage = 'Complete correctamente todos los campos del formulario';
      this.pagoAceptado.emit(false);

      const content = {
        status: error.data.status,
        message: error.data.message,
        description: error.data.description,
        requestId: error.data.request_id,
      }

      //console.log(error);
    });
  }

  twoNumbersOnly(event: any, value: string) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.key);

    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
    
    if(!value) {
      return;
    }

    if (value.toString().length >= 2) {
      event.preventDefault();
    }
  }

  print(event: any) {
    //console.log(event)
  }
}
