import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.component.html',
})
export class DynamicPageComponent {
  private formBuilder = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.formBuilder.array(
      [
        ['Metal Gear', Validators.required],
        ['Death Stranding', Validators.required],
      ],
      Validators.minLength(3)
    ),
  });

  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray;
  }
}
