import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-backend-test',
  templateUrl: './backend-test.component.html',
  styleUrls: ['./backend-test.component.css']
})
export class BackendTestComponent implements OnInit {

  videoFile: any;
  videoDesc!: string;
  videoTitle!: string;
  baseUrl: string = 'http://localhost:8080/api/v1/videos';
  response: any = undefined;
  snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  responseStream: Observable<any> = of(null);
  allResponseStream: Observable<any> = of(null);
  allVideos = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.allResponseStream = this.allResponseStream = this.http.get(`${this.baseUrl}/all`).pipe(
      map((response: any) => {
        this.allVideos = response;
      })
    );
  }

  saveVideo(): void {
    this.response = undefined;
    let params = new HttpParams()
      .append('videoTitle', this.videoTitle)
      .append('videoDescription', this.videoDesc);

    let formData: FormData = new FormData();
    formData.append('file', this.videoFile, this.videoFile.name);

    this.responseStream = this.http.post(`${this.baseUrl}/save`, formData,
      { headers: new HttpHeaders(), params, reportProgress: true, observe: 'events' as const }).pipe(
        map((event, response) => {
          this.progressCheck(event);
          this.response = response;
        }),
        catchError((error) => {
          console.log(error);
          this.response = error.error;
          this.openSnackBar();
          return of(null);
        })
      );
    //   next: (response) => {
    //     if(response.type)
    //     this.response = response;
    //     console.log(response);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     this.response = error.error;
    //     this.openSnackBar();
    //   },
    //   complete: () => {
    //     this.openSnackBar();
    //   }
    // });
  }

  progressCheck(event: any): void {
    if (event.type === HttpEventType.UploadProgress) {
      console.log(`Total - ${event.total}, loaded - ${event.loaded}`);
    } else if (event.type === HttpEventType.Response) {
      this.response = event.body;
      this.openSnackBar();
    }
  }

  disabledCondition(): boolean {
    return ((this.videoDesc == undefined || this.videoDesc == '') || (this.videoTitle == undefined || this.videoTitle == '')
      || (this.videoFile == undefined));
  }

  bindFile(event: any): void {
    this.videoFile = event.target.files[0];
  }

  openSnackBar(): void {
    this.snackBar.open(`${this.response?.statusCode || this.response?.status} - ${this.response?.message || this.response?.error}`, 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }
}
