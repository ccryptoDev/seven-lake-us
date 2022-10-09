import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DEFAULT_SPONSOR } from "src/app/constants/defaultSponsor";
import ResetPasswordComponent from "src/app/login/reset-password/reset-password.component";
import { getDefaultDomain, getUserDomain } from "src/app/utils/urlUitls";
import { AuthenticationService, UserService } from "src/app/_services";
import { environment } from "src/environments/environment";


@Component({
	selector: 'signup',
	styleUrls: ['../register.component.scss', './signup.component.scss'],
	templateUrl: 'signup.component.html',
})
export class SignUpComponent implements OnInit {
	form: FormGroup;
	isInvitedAgent = false
	email: string;
	getSignUpArray: any[] = [];

	@Input() switchView: Function;

	@ViewChild(ResetPasswordComponent) passwordModal: ResetPasswordComponent

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private authService: AuthenticationService,
		private toaster: ToastrService,
		private titleService: Title) {
		this.titleService.setTitle('FinanceAgents');
	}

	ngOnInit() {
		const snapshot = this.activatedRoute.snapshot

		if (snapshot.queryParams?.email) {
			const sponsor = snapshot.queryParamMap.get("sponsor");
			this.isInvitedAgent = true;
			this.email = decodeURI(snapshot.queryParamMap.get("email")).replace(' ', '+');
			this.form = this.formBuilder.group({
				firstName: [{ value: snapshot.queryParamMap.get("firstName"), disabled: true }, [Validators.required]],
				lastName: [{ value: snapshot.queryParamMap.get("lastName"), disabled: true }, [Validators.required]],
				email: [{ value: this.email, disabled: true }, [Validators.required, Validators.pattern(environment.emailPattern)]],
				password: ['', [Validators.required, Validators.minLength(6)]],
				confirm: ['', [Validators.required, Validators.minLength(6)]],
				office: [''],
				AAM: [{ value: sponsor, disabled: true }, []],
			});
		} else {
			this.form = this.formBuilder.group({
				firstName: ['', Validators.required],
				lastName: ['', Validators.required],
				email: ['', [Validators.required, Validators.pattern(environment.emailPattern)]],
				password: ['', [Validators.required, Validators.minLength(6)]],
				confirm: ['', [Validators.required, Validators.minLength(6)]],
				office: [''],
				AAM: [''],
			});
		}
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	openPasswordModal() {
		this.passwordModal.open()
	}

	async onSubmit() {
		const controls = this.f
		const token = await this.authService.getToken()
		const email = controls.email.value

		if (this.form.invalid) {
			this.toaster.error("Please fill mandatory fields");
			return;
		} else if (this.form.value['password'] !== this.form.value['confirm']) {
			this.toaster.error("Passwords don't match");
			return
		} else if (await this.authService.isEmailTaken(email, token)) {
			this.toaster.error("Email is already taken");
			return
		}

		// Check sponsor - user with ID in AAM field
		const sponsor = controls.AAM.value || DEFAULT_SPONSOR
		this.form.value['Sponsor'] = sponsor;
		const agent = await this.authService.getSponsor(sponsor, token)
		if (!agent) {
			this.userService.showError("Agent ID not found. Please enter correct value or leave field empty");
			return
		}


		const domain = getUserDomain(agent) || getDefaultDomain()
		this.form.value['Website'] = domain
		this.form.value['firstName'] = controls.firstName.value
		this.form.value['lastName'] = controls.lastName.value
		this.form.value['email'] = controls.email.value

		// Inherit information from agent that sent the invite
		// if user is invited - signup page was open with encoded URL
		if (this.isInvitedAgent) {
			const ParamMap = this.activatedRoute.snapshot.queryParamMap

			this.form.value['mobilePhone'] = ParamMap.get("phoneNo");
			this.form.value['Lead_Routing'] = agent.Email;
			this.form.value['Original_AAM'] = agent.Email;
			this.form.value['Original_AAM'] = agent.Owner.email;
			this.form.value['OwnerName'] = `${agent.Agent_First} ${agent.Agent_Last}`;
			this.form.value['OwnerId'] = agent.id;
			this.form.value['OwnerEmail'] = agent.Email;
			this.form.value['Office'] = agent.Office || '';
		}

		try {
			await this.authService.signup(this.form.value)
			this.toaster.success('Registration successful');
		} catch (e) {
			this.toaster.error('Failed to register, please try again')
			return
		}

		//  Signup notification to new user
		this.userService.registerMail(this.form.value).subscribe(() => { });

		// Owner notification about new agent
		this.userService.registerMailToOwner({
			mailId: agent.Email,
			ownerName: agent.Agent_First,
			details: this.form.value,
		}).subscribe(() => { });

		// Login with previously typed credentials
		this.login();
	}

	async login() {
		let user
		try {
			user = await this.authService.login(this.f.email.value, this.f.password.value)
		} catch (error) {
			this.toaster.error('Invalid user name or password');
			return
		}

		if (user) {
			localStorage.setItem('currentUser', JSON.stringify(user.Email));
			localStorage.setItem('Us	erDetails', JSON.stringify(user));

			this.userService.userDetails = user
			this.authService.currentUserSubject.next(user);

			this.toaster.success('Successfully Login');
			this.router.navigate(['home']);
		} else {
			this.toaster.error('Invalid user name or password');
		}
	}
}