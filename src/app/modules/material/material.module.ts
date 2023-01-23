import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';



@NgModule({

   exports:[
      MatButtonModule,
      MatCardModule,
      MatSidenavModule,
      MatChipsModule,
      MatDatepickerModule,
      MatDatepickerModule,
      MatSnackBarModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatToolbarModule, 
      MatFormFieldModule,
      MatSelectModule,
      MatNativeDateModule,
      MatRadioModule,
      MatProgressSpinnerModule,
      MatButtonToggleModule,
      MatListModule,
    
      MatPaginatorModule,
      MatTabsModule,
      MatTableModule,
      MatGridListModule,
      MatStepperModule,
      FormsModule,
      ReactiveFormsModule,
     
      MatCheckboxModule,
      MatDialogModule,
      MatSortModule,
   ]

})
export class MaterialModule { }