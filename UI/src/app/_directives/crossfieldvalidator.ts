import {AbstractControl } from '@angular/forms';

export function PasswordValidator(control: AbstractControl):{[key: string]: any} | null {
        const password = control.get('password');
        const passwordConfirmation = control.get('passwordConfirmation');
        if (password.pristine || passwordConfirmation.pristine){
            return null;
        }
        return password && passwordConfirmation && password.value != passwordConfirmation.value ?
        {'mismatch' : true} :
        null;
}