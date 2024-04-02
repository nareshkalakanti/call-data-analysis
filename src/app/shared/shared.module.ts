import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from './ng-modal';
import { ContentPriviewComponent } from './content-priview/content-priview.component';

@NgModule({
  declarations: [
    ContentPriviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule
  ],
  exports: [
  ]
})
export class SharedModule { }
