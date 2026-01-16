import { FormGroup, FormArray, ValidationErrors, AbstractControl } from '@angular/forms';

export class FormUtils {
  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) {
      return null;
    }

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    if (formArray.controls.length === 0) {
      return null;
    }

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  private static getTextError(errors: ValidationErrors) {
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
        case 'email':
          return 'El correo electronico no es valido, no parece ser un correo';
        case 'pattern':
          if (errors['pattern'].requeredPattern === FormUtils.emailPattern) {
            return 'El valor dado no parece un correo electronico';
          }
          return 'Error de patron contra expresion regular';
        default:
          return 'Error de validacion no controlado';
      }
    }
    return null;
  }

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (FormGroup: AbstractControl) => {
      const field1Value = FormGroup.get(field1)?.value;
      const field2Value = FormGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordNotEqual: true };
    };
  }
}
