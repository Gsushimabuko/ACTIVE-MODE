import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuertaActivekidsComponent } from './puerta-activekids.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: PuertaActivekidsComponent }
];

@NgModule({
  declarations: [PuertaActivekidsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PuertaActivekidsModule { }
