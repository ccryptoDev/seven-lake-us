import { Component } from '@angular/core';

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.scss']
})
export class RegisterComponent {
    // switch between normal and Zoho signups
    isRegularView = true;

    switchView = () => {
        this.isRegularView = !this.isRegularView
    }
}
