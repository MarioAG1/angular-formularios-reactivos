import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  myForm = this.formBuilder.group({
    // El primer argumento es sincrono y el segundo asincrono [],[]
    name: [''],
    price: [0],
    inStorage: [0],
  });
}
