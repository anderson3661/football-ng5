import { AuthService } from './../utilities/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginErrors: any;
    public userForm: FormGroup;
    // public emailAddress: string;
    // public password: string;
    public rememberUsername: string;

    constructor(public auth: AuthService,
        private fb: FormBuilder,
        private router: Router) { }

    ngOnInit() {
        this.buildForm();
    }

    emailLogin() {
        this.auth.emailLogin(this.userForm.value['email'], this.userForm.value['password']);
        debugger;
        // if (this.authenticated()) {
            // this.router.navigate(['/administration']);
        // }
        // this.auth.emailLogin(this.emailAddress, this.password);
        // console.log('this.auth.authState', this.auth.authState);
    }

    logOut() {
        this.auth.signOut();
    }

    getUser() {
        return this.auth.currentUserEmail;
    }

    authenticated() {
        return this.auth.authenticated;
    }

    buildForm(): void {
        this.userForm = this.fb.group({
            'email': ['', [
                Validators.required,
                Validators.email
            ]
            ],
            'password': ['', [
                Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
                Validators.minLength(6),
                Validators.maxLength(25)
            ]
            ],
        });

        this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // reset validation messages
    }

    // Updates validation state on form changes.
    onValueChanged(data?: any) {
        if (!this.userForm) { return; }
        const form = this.userForm;
        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    formErrors = {
        'email': '',
        'password': ''
    };

    validationMessages = {
        'email': {
            'required': 'Email is required.',
            'email': 'Email must be a valid email'
        },
        'password': {
            'required': 'Password is required.',
            'pattern': 'Password must be include at one letter and one number.',
            'minlength': 'Password must be at least 6 characters long.',
            'maxlength': 'Password cannot be more than 25 characters long.',
        }
    };

}