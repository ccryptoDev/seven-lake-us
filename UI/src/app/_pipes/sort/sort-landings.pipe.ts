import { Pipe, PipeTransform } from '@angular/core';
import { LandingPage } from 'src/app/types/landingPage.type';

@Pipe({
	name: 'sortLanding'
})
export class SortLandingsPipe implements PipeTransform {

	sortByKey(list: LandingPage[], key: string) {
		return list.sort((a, b) => {
			return a[key].toLowerCase() >= b[key].toLowerCase() ? 1 : -1
		})
	}

	transform(list: LandingPage[], category: string): any {
		switch (category) {
			case 'Name':
				list = this.sortByKey(list, 'name')
				break
			case 'Used by':
				list = this.sortByKey(list, 'usedBy')
				break
			default:
				break
		}
		return list
	}
}

