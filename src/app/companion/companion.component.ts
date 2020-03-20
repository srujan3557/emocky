import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'app/service/user.service';
@Component({
  selector: 'app-companion',
  templateUrl: './companion.component.html',
  styleUrls: ['./companion.component.scss']
})
export class CompanionComponent implements OnInit {
  companionForm: FormGroup;
  loyaltyMember: any;
  gender: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    this.gender = [{ value: 'Male', key: 'M' }, { value: 'Female', key: 'F' }];
    this.companionForm = this.fb.group({
      items: this.fb.array([])
    })

    this.addCompanion();
  }

  createItem() {
    return this.fb.group({
      preferenceCategoryId: [''],
      preferenceCategoryIdDesc: [''],
      preferenceCode: [''],
      preferenceCodeDesc: [''],
      preferenceAdditionalText: [''],
      preferenceSequenceNum: [''],
    })
  }

  addCompanion() {
      (this.companionForm.controls['items'] as FormArray).push(this.createItem())
  }

  deleteRow(index: number) {
    (this.companionForm.controls['items'] as FormArray).removeAt(index);
  }

  submit () {
    this.loyaltyMember.loyaltyMemberPreferences = this.companionForm.value.items;
    this.userService.updateLoyaltyMember(this.loyaltyMember).subscribe(data => {
      console.log(data);
    });
    console.log(this.companionForm.value);
  }
  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  alphabateOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 65 || charCode > 122) || (charCode > 90 && charCode < 97)) {
      return false;
    }
    return true;
  }
}
