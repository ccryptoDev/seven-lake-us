import { UserDetails } from "../types/user-details.type";

const STANDARD_ROLE = 'standard'
const RECRUITER_ROLE = 'recruiter'
const OFFICE_MEMBER_ROLE = 'office'
const ADMIN_ROLE = 'admin'
const AAM_ROLE = 'aam internal'
const ADMIN_ROLE_AUXILIARY_WEST = 'admin support-fs west'
const ADMIN_ROLE_AUXILIARY_EAST = 'admin support-fs east'

// Elite role, does not exist in Zoho
// Same as executive at the moment
const EXECUTIVE_ROLE = 'executive'
const ELITE_ROLE = EXECUTIVE_ROLE

export function isStandard(user: UserDetails): boolean {
	return user?.Account_Type?.toLowerCase() === STANDARD_ROLE
}

export function isRecruiter(user: UserDetails): boolean { 
	return user?.Account_Type?.toLowerCase() === RECRUITER_ROLE
}

export function isOfficeMember(user: UserDetails): boolean {
	return user?.Account_Type?.toLowerCase() === OFFICE_MEMBER_ROLE
}

export function isElite(user: UserDetails): boolean {
	return user?.Account_Type?.toLowerCase() === ELITE_ROLE
}

export function isExecutive(user: UserDetails): boolean {
	return user?.Account_Type?.toLowerCase() === EXECUTIVE_ROLE
}

export function isAAM(user: UserDetails): boolean {
	return user?.Account_Type?.toLowerCase() === AAM_ROLE
}

export function isAdmin(user: UserDetails): boolean {
	const role = user?.Account_Type?.toLowerCase()
	return role === ADMIN_ROLE || role === ADMIN_ROLE_AUXILIARY_WEST || role === ADMIN_ROLE_AUXILIARY_EAST
}