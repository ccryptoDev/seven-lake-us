import { Pipe, PipeTransform } from '@angular/core';
import { UserDetails } from 'src/app/types/user-details.type';

@Pipe({
	name: 'sortAgents'
})
export class SortAgentsPipe implements PipeTransform {

	sortByKey(list: UserDetails[], key: string) {
		return list.sort((a, b) => {
			return a?.[key]?.toLowerCase() >= b?.[key]?.toLowerCase() ? 1 : -1
		})
	}

	sortByNumber(list: UserDetails[], key: string) {
		return list.sort((a, b) => {
			if (!a?.[key]) return 1
			if (!b?.[key]) return -1
			return Number.parseInt(a?.[key]) >= Number.parseInt(b?.[key]) ? 1 : -1
		})
	}

	transform(list: UserDetails[], category: string): any {
		switch (category) {
			case 'Name':
				list = this.sortByKey(list, 'firstName')
				break
			case 'Member Number':
				list = this.sortByNumber(list, 'memberNumber')
				break
			default:
				break
		}
		return list
	}
}
@Pipe({
	name: 'sortZohoAgents'
})
export class SortZohoAgentsPipe extends SortAgentsPipe  {

	transform(list: UserDetails[], category: string): any {
		switch (category) {
			case 'Name':
				list = this.sortByKey(list, 'Name')
				break
			case 'Member Number':
				list = this.sortByNumber(list, 'Member_Number')
				break
			default:
				break
		}
		return list
	}
}

