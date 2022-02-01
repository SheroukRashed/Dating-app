import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {

  baseUrl = "https://localhost:5001/api/";
  validationErrors: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error() {
    this.http.get(this.baseUrl + "buggy/not-found").subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.info('complete');
      }
    });
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + "account/register", {}).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
        this.validationErrors = error;
      },
      complete: () => {
        console.info('complete') 
      }
    });
  }


  get400Error() {
    this.http.get(this.baseUrl + "buggy/bad-request").subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.info('complete') 
      }
    });
  }


  get500Error() {
    this.http.get(this.baseUrl + "buggy/server-error").subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.info('complete') 
      }
    });
  }


  get401Error() {
    this.http.get(this.baseUrl + "buggy/auth").subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.info('complete') 
      }
    });
  }

}
