import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { UserDetails } from "../types/user-details.type";
import { isAdmin, isExecutive, isOfficeMember, isRecruiter } from "../utils/roleUtils";
import { User } from "../_models";
import { AuthenticationService, UserService } from "../_services";

@Component({
	templateUrl: 'sidebar.component.html',
	selector: 'app-sidebar'
})
export class SideBarComponent {
	@Input() currentUser: User;
	@Input() memberSelect: Function;
	@Input() dash_heading: string;
	@Input() isExpanded: boolean;
	@Input() officeName: string;
	@Input() curOffice: { thumbnail: string };

	@ViewChild('sideBar') sideBar: ElementRef<HTMLDivElement>

	constructor(private userService: UserService, private authService: AuthenticationService, private router: Router) {
		this.authService.currentUser.subscribe((user) => {
			this.currentUser = user;
		})
	}

	isOpen = {
		leads: false,
		agents: false,
		documents: false,
		marketing: false,
		training: false,
		management: false
	}

	matchRoute(routes: string[]): boolean {
		const url = this.router.url
		for (let route of routes) {
			if (url.indexOf(route) !== -1) return true
		}
		return false;
	}

	get hasUser(): boolean { return this.currentUser !== null }
	get firstName() { return this.userService.userDetails?.First_Name; }
	get lastName() { return this.userService.userDetails?.Last_Name }

	get perms() {
		const user: UserDetails = this.userService.userDetails

		// default permissions
		const values = {
			MemberOffice: false,
			leadinputVisible: true,
			leadinfoVisile: true,
			leadVisible: true,
			agentVisible: true,
			agentInviteVisible: true,
			agentInfoVisible: false,
			trainingVisible: false,
			documentVisible: false,
			manageAccVisible: false,
			managementVisible: false,
			agentManagerVisible: false,
			formManagerVisible: false,
			landingVisible: false,
			offmanagerVisible: false,
			urlManagerVisible: false,
			docAdminVisible: false,
			ManageAccountVisible: false,
			profileVisible: true,
			marketingVisible: false,
			documentMemberVisible: true,
		}

		if (isExecutive(user)) {
			Object.assign(values, {
				agentInfoVisible: true,
				documentVisible: true,
				marketingVisible: true,
				managementVisible: true,
				urlManagerVisible: true,
			})
		} else if (isRecruiter(user)) {
			Object.assign(values, {
				agentInfoVisible: true,
				managementVisible: true,
				urlManagerVisible: true,
				documentVisible: true,
			})
		} else if (isOfficeMember(user)) {
			Object.assign(values, {
				agentInfoVisible: true,
				documentVisible: true,
				marketingVisible: true,
				ManageAccountVisible: true,
				trainingVisible: true,
				managementVisible: true,
				agentManagerVisible: true,
				MemberOffice: false,
				offmanagerVisible: true,
				urlManagerVisible: true,
			})
		} else if (user?.Account_Type === "AAM Internal") {
			Object.assign(values, {
				agentInfoVisible: true,
				documentVisible: true,
				marketingVisible: true,
				trainingVisible: true,
				managementVisible: true,
				agentManagerVisible: true,
				landingVisible: true,
				urlManagerVisible: true,
			})
		} else if (isAdmin(user)) {
			Object.assign(values, {
				agentInfoVisible: true,
				offmanagerVisible: true,
				urlManagerVisible: true,
				docAdminVisible: true,
				documentVisible: true,
				marketingVisible: true,
				trainingVisible: true,
				managementVisible: true,
				agentManagerVisible: true,
				formManagerVisible: true,
				landingVisible: true,
			})
		} else {
			Object.assign(values, {
				marketingVisible: true,
				documentVisible: true,
				documentMemberVisible: false,
				trainingVisible: true,
			})
		}
		return values
	}

	closeAllMenu() {
		for (let item in this.isOpen) {
			this.isOpen[item] = false
		}
	}

	toggleMenu(name: string) {
		for (let item in this.isOpen) {
			if (item !== name) {
				this.isOpen[item] = false
			} else {
				this.isOpen[item] = !this.isOpen[item]
			}
		}
	}

	openNav = () => {
		this.sideBar.nativeElement.classList.toggle("open")
	}

	closeNav = () => {
		this.sideBar.nativeElement.classList.remove("open")
	}
}