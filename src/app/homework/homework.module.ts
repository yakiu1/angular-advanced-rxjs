import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeworkComponent } from './homework.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SettingsRoutingModule } from './homwork-routing.module';



@NgModule({
  declarations: [
    HomeworkComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeworkModule { }
