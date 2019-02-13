import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {CustomValidator} from '../../CustomValidators/custom.validators';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  validationErrorMessages = {
    'employeeName': {
      'required': 'Employee Name is required',
      'minlength': 'Employee name must have minimum of 2 characters',
      'maxlength': 'Employee name must be smaller than 10 charcters'
    },
    'email': {
      'required': 'Email is required',
      'invalidEmailDomain': 'Email domain can be only prithwi.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm email does not match'
    },
    'phone': {
      'required': 'Phone is required'
    },
    'skillName': {
      'required': 'Skill name is required'
    },
    'experienceInYears': {
      'required': 'Experience is required'
    },
    'proficiency': {
      'required': 'Proficiency is required'
    }
  };
  formErrors = {
    'employeeName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.employeeForm = this._formBuilder.group({
      employeeName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      emailGroup: this._formBuilder.group({
        email: ['', [Validators.required, CustomValidator.checkEmail('prithwi.com')]],
        confirmEmail: ['', Validators.required],
      }, {validator: matchEmail}),
      phone: [''],
      contactPrefrence: ['email'],
      skills: this._formBuilder.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    });

    this.employeeForm.get('contactPrefrence').valueChanges.subscribe((data) => {
      this.onContactPrefrenceChanged(data);
    });

    this.employeeForm.valueChanges.subscribe(data => {
      this.logValidationErrorMessages(this.employeeForm);
    });

  }

  saveEmployee() {
    console.log(this.employeeForm.value);
    console.log(this.employeeForm.controls.employeeName.value);
  }
  loadData() {
    this.logValidationErrorMessages(this.employeeForm);
  }
  logValidationErrorMessages(form: FormGroup = this.employeeForm): void {
    Object.keys(form.controls).forEach((key: string) => {
      const abstractControl = form.get(key);
      this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const message = this.validationErrorMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += message[errorKey] + '';
              console.log(this.formErrors);
            }
          }
        }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrorMessages(abstractControl);
      }
    });
  }

  onContactPrefrenceChanged(selectedValue: string) {

    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
}
function matchEmail(group: AbstractControl): {[key: string]: any} | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}
