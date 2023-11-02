import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPassword } from '../Model/reset-password.model';
import { confirmPasswordValidator } from '../helpers/confirm-password.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../service/reset-password.service';
import { NgToastService } from 'ng-angular-popup';
// import ValidateForm from '';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailtoken!: string;
  resetPasswordObj = new ResetPassword();
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: NgToastService,
    private activatedRoute: ActivatedRoute,
    private resetService: ResetPasswordService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
    this.activatedRoute.queryParams.subscribe((val) => {
      this.emailToReset = val['email'];
      let urlToken = val['code'];
      this.emailtoken = urlToken.replace(/ /g, '+');
      console.log(this.emailtoken);
      console.log(this.emailToReset);
    });
  }

  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.NewPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.ConfirmPassword =
        this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailtoken;

      this.resetService.resetPassword(this.resetPasswordObj).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'SUCCESS',
            summary: "Password Reset Successfully",
            duration: 3000,
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'ERROR',
            summary: "Something went wrong!!",
            duration: 3000,
          });
        },
      });
    } else {
      // ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
