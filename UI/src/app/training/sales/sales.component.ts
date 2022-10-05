import { Component } from "@angular/core";
import { VideoType } from "src/app/types/video.type";

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
})
export class SalesComponent {
  filterData = (videos: VideoType[]): VideoType[] => {
    return videos
  }
}