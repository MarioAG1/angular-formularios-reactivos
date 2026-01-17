import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'country-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  formBuilder = inject(FormBuilder);
  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);
  countryByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.formBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChanged = effect((onCleanUp) => {
    const regionSubscription = this.onRegionChange();
    const countrySubscription = this.onCountryChange();

    onCleanUp(() => {
      regionSubscription?.unsubscribe();
      countrySubscription?.unsubscribe();
    });
  });

  onRegionChange() {
    return this.myForm
      .get('region')
      ?.valueChanges.pipe(
        tap(() => {
          this.myForm.get('country')?.setValue('');
        }),
        tap(() => {
          this.myForm.get('border')?.setValue('');
        }),
        tap(() => {
          this.borders.set([]);
          this.countryByRegion.set([]);
        }),
        switchMap((region) => this.countryService.getCountriesByRegion(region ?? ''))
      )

      .subscribe((countries) => {
        this.countryByRegion.set(countries);
      });
  }

  onCountryChange() {
    return this.myForm
      .get('country')
      ?.valueChanges.pipe(
        tap(() => {
          this.myForm.get('border')?.setValue('');
        }),
        tap(() => {
          this.borders.set([]);
        }),
        // Con esto hacemos que si hay algun valor vacio no continue,
        // es decir que hasta que no selecciones el country y el border que no avance
        filter((value) => value!.length > 0),
        switchMap((alphacode) => this.countryService.getCountryByAlphaCode(alphacode ?? '')),
        switchMap((country) => this.countryService.getCountryNamesByCodeArray(country.borders))
      )
      .subscribe((borders) => {
        // console.log({ borders });
        this.borders.set(borders);
        const borderControl = this.myForm.get('border');
        if (borders.length === 0) {
          borderControl!.clearValidators();
        } else {
          borderControl?.setValidators([Validators.required]);
        }
        borderControl?.updateValueAndValidity();
      });
  }
}
