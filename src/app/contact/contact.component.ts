import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// import { FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { ErrorStateMatcher } from '@angular/material/core';

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//     isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//         const isSubmitted = form && form.submitted;
//         return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//     }
// }

const DEBUGGING = false;

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    // isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //     const isSubmitted = form && form.submitted;
    //     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    // }

    public contactForm: FormGroup;
    // public name: FormControl;
    // public emailAddress: FormControl;
    // public comments: FormControl;
    public showFormInvalidMessage: boolean;
    // public matcher: any;
    public isDebugging: boolean;
    
    constructor(private fb: FormBuilder) {
        this.createForm();
    }

    ngOnInit() {
        // this.name = new FormControl('', [Validators.required]);
        // this.emailAddress = new FormControl('', [Validators.required, Validators.email]);
        // this.comments = new FormControl('', [Validators.required]);

        // this.contactForm = new FormGroup({
        //     name: this.name,
        //     emailAddress: this.emailAddress,
        //     comments: this.comments
        // }, { updateOn: 'blur' });

        this.showFormInvalidMessage = false;
        this.isDebugging = DEBUGGING;

        // this.matcher = new MyErrorStateMatcher();

    }

    createForm() {
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email]],
            comments: ['', Validators.required]
        })
    }

    onSubmit() {
        debugger;
        if (this.contactForm.valid) {
            // alert("Form is valid");
            this.showFormInvalidMessage = false;
            console.log("Form submitted ... ", this.contactForm.value);
            this.resetForm();
            // this.myForm.reset();
        } else {
            // alert("Form is INVALID");
            this.validateAllFormFields(this.contactForm);
            this.showFormInvalidMessage = true;
        }
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            debugger;
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    resetForm() {
        this.contactForm.reset({
            name: '',
            emailAddress: '',
            comments: ''
        });
    }

    // classIsValidOrInvalid(fieldName: FormControl) {
    //     debugger;
    //     return {
    //         "is-valid": fieldName.valid && (fieldName.dirty || fieldName.touched),
    //         "is-invalid": fieldName.invalid && (fieldName.dirty || fieldName.touched)
    //     }
    // }


}
