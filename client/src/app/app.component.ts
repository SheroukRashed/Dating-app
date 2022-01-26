import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Dating App';
  users: any;

  constructor(private http : HttpClient, private accountService: AccountService){}

  ngOnInit() {
      this.getUsers();
      this.setCurrentUser();
  }

  getUsers() {
    this.http.get("https://localhost:5001/api/users/").subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => console.info('complete') 
    });
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user')  || '{}');
    if (user.userName && user.token) {
      this.accountService.setCurrentUser(user);
    }
  }

}
