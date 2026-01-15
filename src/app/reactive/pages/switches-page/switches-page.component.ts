import { FormUtils } from './../../../utils/form-utils';
import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-switches-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './switches-page.component.html',
})
export class SwitchesPageComponent {
  private formBuilder = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.formBuilder.group({
    // Se le puede quitar el valor inicial M y no pondra ninguna opcion
    gender: ['M', Validators.required],
    wantNotifications: [true], //Al no poner Validators, esto sera opcional
    termsAndConditions: [false, Validators.requiredTrue],
  });

  onSumbit() {
    this.myForm.markAllAsTouched();
  }
}
