import { Component, Input, OnInit, ViewChild} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import ResetPasswordComponent from "src/app/login/reset-password/reset-password.component";
import { environment } from "src/environments/environment";

@Component({
	selector: 'signup-zoho',
	styleUrls: ['../register.component.scss'],
	templateUrl: 'signup-zoho.component.html',
})
export class SignUpZohoComponent implements OnInit{
	form: FormGroup;

	@Input() switchView: Function;

	@ViewChild(ResetPasswordComponent) passwordModal: ResetPasswordComponent

	constructor(
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
	) { }

	ngOnInit() {
		const snapshot = this.activatedRoute.snapshot
		
		const values: any = {
			firstName: '',
			lastName: '',
			email: '',
			agentId: '',
		}
		
		if (snapshot.queryParams?.email) { 
			const sponsor = snapshot.queryParamMap.get("sponsor");
			const email = decodeURI(snapshot.queryParamMap.get("email")).replace(' ', '+');

			values.firstName = { value: snapshot.queryParamMap.get("firstName"), disabled: true }
			values.lastName = { value: snapshot.queryParamMap.get("lastName"), disabled: true } 
			values.email = { value: email, disabled: true }
			values.agentId = { value: sponsor, disabled: true }
		}
		this.form = this.formBuilder.group({
			firstName: [values.firstName, Validators.required],
			lastName: [values.lastName, Validators.required],
			email: [values.email, [Validators.required, Validators.pattern(environment.emailPattern)]],
			AAM: [values.agentId],
			search: [''],
			hasAccepted: new FormControl(false)
		})
	}

	get f() {
		return this.form.controls;
	}

	openPasswordModal() {
		this.passwordModal.open()
	}

	onSubmit() {
		// TODO: add request of zoho signup 
		console.log(this.form.value)
	}
}