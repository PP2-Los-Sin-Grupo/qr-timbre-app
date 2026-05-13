import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AjustesPage } from './ajustes.page';
import { AjustesPageRoutingModule } from './ajustes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjustesPageRoutingModule
  ],
  declarations: [AjustesPage]
})
export class AjustesPageModule {}
