// angular
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// app
import { FaqComponent } from "../shared/faq.component/faq.component";
import { BtnPlus } from "../shared/btn_plus.component/btn_plus.component";
import { SumFieldComponent } from "../shared/sum_field.component/sum_field.component";
import { SettingsFieldComponent } from "../shared/settings_field.component/settings_field.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    BtnPlus,
    SumFieldComponent,
    SettingsFieldComponent,
    FaqComponent
  ],
  exports: [
    BtnPlus,
    SumFieldComponent,
    SettingsFieldComponent,
    FaqComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})

export class SharedModule {}