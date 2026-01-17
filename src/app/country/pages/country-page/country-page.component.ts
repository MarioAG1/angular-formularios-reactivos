import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

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

    onCleanUp(() => {
      regionSubscription?.unsubscribe();
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
        switchMap((region) => this.countryService.getCountriesByRegion(region!))
      )

      .subscribe((countries) => {
        this.countryByRegion.set(countries);
      });
  }
}
