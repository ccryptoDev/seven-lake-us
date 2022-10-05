
// Partially typed User model
// with most important attributes,
// original API response contains ~20 fields

export type UserDetails = {
	id: string,
	Website: string,
	Account_Type: string,
	Name: string,
	Sponsor: string,
	Agent_First: string,
	Agent_Last: string,
	Email: string,
	Member_Number: string,
	Mobile_Phone: string,
	Created_Time: string,
	Modified_Time: string,
	Office: string | null,
	status: string,
	note: string
}