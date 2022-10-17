import { Pipe, PipeTransform } from '@angular/core';
import { Lead } from 'src/app/types/lead.type';

@Pipe({
	name: 'sortLeads'
})
export class SortLeadsPipe implements PipeTransform {

	sortByDate(list: Lead[], reverse = false) {
		return list.sort((a, b) => {
			const dateA = new Date(a.Created_Time)
			const dateB = new Date(b.Created_Time)

			if (!reverse) {
				return dateA <= dateB ? 1 : -1
			} else {
				return dateA >= dateB ? 1 : -1
			}
		})
	}

	sortByKey(list: Lead[], key: string, reverse = false) {
		return list.sort((a, b) => {
			if (!reverse) {
				return a[key]?.toLowerCase() >= b[key]?.toLowerCase() ? 1 : -1
			} else {
				return a[key]?.toLowerCase() <= b[key]?.toLowerCase() ? 1 : -1
			}
		})
	}

	transform(list: Lead[], category: string): any {
		switch (category) {
			case 'Date Created':
				list = this.sortByDate(list)
				break
			case 'Date Created (descending)':
				list = this.sortByDate(list, true)
				break
			case 'Name (a -> z)':
				list = this.sortByKey(list, 'Full_Name')
				break
			case 'Name (z -> a)':
				list = this.sortByKey(list, 'Full_Name', true)
				break
			case 'Company (a -> z)':
				list = this.sortByKey(list, 'Company')
				break
			case 'Company (z -> a)':
				list = this.sortByKey(list, 'Company', true)
				break
			case 'Status (a -> z)':
				list = this.sortByKey(list, 'Lead_Status')
				break
			case 'Status (z -> a)':
				list = this.sortByKey(list, 'Lead_Status', true)
				break
			case 'UW Notes (a -> z)':
				list = this.sortByKey(list, 'Underwriter_Notes')
				break
			case 'UW Notes (z -> a)':
				list = this.sortByKey(list, 'Underwriter_Notes', true)
				break
			case 'Description (a -> z)':
				list = this.sortByKey(list, 'Description')
				break
			case 'Description (z -> a)':
				list = this.sortByKey(list, 'Description', true)
				break
			default:
				break
		}
		return list
	}
}

