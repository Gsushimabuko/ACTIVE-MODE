import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScriptService } from 'src/app/services/script.service';

@Component({
  selector: 'app-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent implements OnInit {
  
  constructor(private _fb: FormBuilder, private _scriptLoader: ScriptService) {
    this.form = this._fb.group({
      titular: this._fb.control('', [Validators.required]),
      tarjeta: this._fb.control('', [Validators.required]),
      fechaExp: this._fb.control('', [Validators.required]),
      cvv: this._fb.control('', [Validators.required]),

    });
    
    
  }
  
  ngOnInit(): void {
    OpenPay.setId('m65bzifhawsoqryayhex');
    OpenPay.setApiKey('pk_f9d34a0a522b407ab465f942932c7849');
  
    var deviceSessionId = OpenPay.deviceData.setup("payment-form", "deviceIdHiddenFieldName");
    OpenPay.setSandboxMode(true);
  
    console.log('a');
    
    
  }

  form: FormGroup;

  initializeDeviceSessionId() {
    
  }
}
