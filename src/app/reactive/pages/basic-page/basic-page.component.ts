import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {
  // Esta no es la version mas optimo, From builder es mejor
  // myForm = new FormGroup({
  //   name: new FormControl(''),
  //   price: new FormControl(0),
  //   inStorage: new FormControl(0),
  // });

  private formBuilder = inject(FormBuilder);
  //({}) {}, para pasar argumentos
  myForm: FormGroup = this.formBuilder.group({
    // El primer argumento es sincrono y el segundo asincrono [],[]
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(10)]],
    inStorage: [0, [Validators.required, Validators.min(0)]],
  });

  isValidField(fieldname: string): boolean | null {
    return !!this.myForm.controls[fieldname].errors && this.myForm.controls[fieldname].touched;
  }

  getFieldError(fieldname: string): string | null {
    if (!this.myForm.controls[fieldname]) {
      return null;
    }

    const errors = this.myForm.controls[fieldname].errors ?? {};

    // Tiene que tenener el mismo texto tanto el caso como el return,
    // no funciona y coerente a los tipo de errores en Angular
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Minimo de ${errors['minlength'].requiredLength} caracteres.`;
        case 'min':
          return `Valor minimo de ${errors['min'].min}`;
      }
    }
    return null;
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
    }

    // con solamente (), se reinicaria todo vacio o de origen
    this.myForm.reset({
      price: 0,
      inStorage: 0,
    });
  }
}
