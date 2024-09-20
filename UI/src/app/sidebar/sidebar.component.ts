import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { UserDetails } from "../types/user-details.type";
import { isAAM, isAdmin, isExecutive, isOfficeMember, isRecruiter } from "../utils/roleUtils";
import { User } from "../_models";
import { AuthenticationService, UserService } from "../_services";

@Component({
	templateUrl: 'sidebar.component.html',
	selector: 'app-sidebar',
	styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent {
	@Input() currentUser: User;
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
			documentsMember: true, // Documents - Member Office

			// Management and its categories
			management: true, 
			manageAgents: false,
			manageForms: false,
			manageLandings: false,
			manageOffices: false,
			manageURLs: false,
			manageDocuments: false,

			marketingMemberLinks: ['marketing/MemberOffice'],
			trainingMemberLinks: ['training/MemberOffice']
		}

		if (isRecruiter(user)) {
			Object.assign(values, {
				urlManagerVisible: true,
				management: false,
				documentsMember: false,
				trainingMemberLinks: ['manageAccount'],
				marketingMemberLinks: ['manageAccount'],
			})
		} else if (isOfficeMember(user)) {
			Object.assign(values, {
				ManageAccountVisible: true,
				manageAgents: true,
			})
		} else if (isAAM(user)) {
			Object.assign(values, {
				manageDocuments: true,
				manageAgents: true,
				manageForms: true,
			})
		} else if (isAdmin(user)) {
			Object.assign(values, {
				manageAgents: true,
				manageForms: true,
				manageLandings: true,
				manageOffices: true,
				manageURLs: true,
				manageDocuments: true,
			})
		} else {
			Object.assign(values, {
				documentsMember: false,
				management: false,
				trainingMemberLinks: ['manageAccount'],
				marketingMemberLinks: ['manageAccount'],
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

	toggleNav = () => {
		this.sideBar.nativeElement.classList.toggle("open")
	}
}