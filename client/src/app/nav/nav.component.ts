import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  currentUser$: Observable<User|null>;

  constructor(private accountService: AccountService, private router: Router, private toastr: ToastrService) { 
    this.currentUser$ = this.accountService.currentUser$;
  }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error.error);
      },
      complete: () => {
        console.info('complete') 
        this.router.navigateByUrl('/members');
      }
    });
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
