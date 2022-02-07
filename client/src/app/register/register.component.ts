import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // @Input() usersFromHomeComponent:any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm!: FormGroup;


  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.intitializeForm();
  }


  intitializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues("password")])
    })
  }

  matchValues(matchTo : string): ValidatorFn {
    return (control: AbstractControl) => {
      const controls = control?.parent?.controls as { [key: string]: AbstractControl; };
      let matchToControl = null;    
      if(controls) matchToControl = controls[matchTo];       
      return control?.value === matchToControl?.value
        ? null : { isMatching: true }
    }
  }

  register() {
    console.log(this.registerForm.value);
    // this.accountService.register(this.model).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.cancel()
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     this.toastr.error(error.error);
    //   },
    //   complete: () => console.info('complete') 
    // });
  }

  cancel() {
    console.log("cancel")
    this.cancelRegister.emit(false)
  }

}
