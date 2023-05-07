import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileSystemFileEntry} from 'ngx-file-drop';
import { UploadVideoResponse } from './upload-video/UploadVideoResponse';
import { VideoDto } from './video-dto';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  apiUrl = "http://localhost:8080/"; //anywhere the base api url is, use this instead
  saveVideo(videoMetaData: VideoDto): Observable<VideoDto> {
    return this.httpClient.put<VideoDto>( this.apiUrl + "/api/videos", videoMetaData)
  }

  constructor(private httpClient: HttpClient) { }

  uploadVideo(fileEntry: File) : Observable<UploadVideoResponse>{
    const formData = new FormData();
    formData.append('file', fileEntry, fileEntry.name);

    return this.httpClient.post<UploadVideoResponse>(this.apiUrl + "/api/videos/", formData);
  }


  uploadThumbnail(fileEntry: File, videoId : string) : Observable<string>{
      const formData = new FormData();
      formData.append('file', fileEntry, fileEntry.name);
      formData.append('videoId', videoId);

      return this.httpClient.post(this.apiUrl + "/api/videos/thumbnail/", formData, {
        responseType : 'text'
      });
    }

  getVideo(videoId: string): Observable<VideoDto>{
    return this.httpClient.get<VideoDto>(this.apiUrl + "/api/videos/" + videoId);
  }

}
