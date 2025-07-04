import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { SelectionBotComponent } from './selection-bot.component';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: SelectionBotComponent
  }
];

@NgModule({
  declarations: [
    SelectionBotComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class SelectionBotModule { }