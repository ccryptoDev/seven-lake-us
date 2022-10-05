import { Pipe, PipeTransform } from '@angular/core';
import { LandingPage } from 'src/app/types/landingPage.type';

@Pipe({
	name: 'landingDateFilter'
})
export class FilterLandingDatePipe implements PipeTransform {

	transform(list: LandingPage[], start?: Date, end?: Date): any {
		return list ? list.filter(item => {
			let createdAt = new Date(item.createdAt)

			let startDate = start
			if (start) {
				startDate.setMinutes(0)
				startDate.setHours(0)
				startDate.setSeconds(0)
			}

			let endDate = end
			if (end) {
				endDate.setMinutes(59)
				endDate.setHours(23)
				endDate.setSeconds(59)
			}

			if (startDate && createdAt < startDate) return false
			if (endDate && createdAt > endDate) return false

			return true
		}) : [];
	}
}

