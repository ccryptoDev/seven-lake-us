import { Component } from '@angular/core';
import { VideoType } from 'src/app/types/video.type';

@Component({
  selector: 'app-funding-programs',
  templateUrl: './funding-programs.component.html',
})
export class FundingProgramsComponent {
  filterData = (videos: VideoType[]): VideoType[] => {
    return videos.filter((item) => item.category === "2: Funding Programs")
  }
}
