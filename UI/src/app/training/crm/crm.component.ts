import { Component} from '@angular/core';
import { VideoType } from 'src/app/types/video.type';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
})
export class CRMComponent{
  filterData = (videos: VideoType[]): VideoType[] => {
    return videos.filter((video) => video.category === "3: CRM")
  }
}