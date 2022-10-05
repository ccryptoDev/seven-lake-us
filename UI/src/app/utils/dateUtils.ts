export function addMonth(input: Date): Date {
	// Number of days which are added to the
	// user subscription date, used to 
	// calculate +first payment date
	const DAYS = 30;

	let output = new Date(input)
	output.setDate(output.getDate() + DAYS);
	return output
}