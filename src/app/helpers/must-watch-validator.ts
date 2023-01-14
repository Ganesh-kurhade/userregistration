import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function MustMatch(password: string, confirmPassword: string): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {

    const passwordCtrl = ctrl.get(password);
    const confirmPasswordCtrl = ctrl.get(confirmPassword);

    if (confirmPasswordCtrl.errors && !confirmPasswordCtrl.errors['mustMatch']) {
      return null;
    }

    if (passwordCtrl.value !== confirmPasswordCtrl.value) {
      confirmPasswordCtrl.setErrors({ mustMatch: true })
    } else {
      confirmPasswordCtrl.setErrors(null)
    }
    return null;
  }
}
