import { Pipe, PipeTransform } from '@angular/core';
import { VideoType } from '../types/video.type';

@Pipe({
	name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

	transform(list: VideoType[], filterText: string): any {
		const out = list ? list.filter(item => {
			if (!filterText) {
				return true
			}
			for (let tag of item.tags) {
				if (tag.search(new RegExp(filterText, 'i')) > -1) {
					return true
				}
			}
			return false
		}) : [];
		return out
	}
}

