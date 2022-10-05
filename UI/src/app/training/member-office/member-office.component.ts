import { Component } from '@angular/core';
import { VideoType } from 'src/app/types/video.type';

@Component({
  selector: 'app-member-office',
  templateUrl: './member-office.component.html',
})
export class MemberOfficeComponent {
  filterData = (videos: VideoType[]): VideoType[] => {
    return videos.filter((res) => res.category === "4: Member Office")
  }
}
