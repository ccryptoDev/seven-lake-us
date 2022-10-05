import { AbstractControl } from '@angular/forms';

export function MandatoryValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const password = control.get('currentPassword');
    const newpassword = control.get('newPassword');
    const newpasswordconfirmation = control.get('newPasswordConfirmation');
    return password.dirty && password.valid && newpassword.pristine && newpasswordconfirmation.pristine ?
    { 'mismatch' : true } :
    null;
}