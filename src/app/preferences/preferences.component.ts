import { Component, OnInit } from '@angular/core';
import {FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'app/service/user.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  preferenceForm: FormGroup;
  loyaltyMember: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    this.preferenceForm = this.fb.group({
      items: this.fb.array([])
    })

    this.route.params.subscribe(params => {
      const id = params.id;
      this.userService.getLoyaltyMember(id).subscribe(data => {
        this.loyaltyMember = data;
        if (this.loyaltyMember && this.loyaltyMember.loyaltyMemberPreferences) {
          this.loyaltyMember.loyaltyMemberPreferences.forEach(preference => {
            (this.preferenceForm.controls['items'] as FormArray).push(
              this.fb.group({
                preferenceCategoryId: [preference.preferenceCategoryId],
                preferenceCategoryIdDesc: [preference.preferenceCategoryIdDesc],
                preferenceCode: [preference.preferenceCode],
                preferenceCodeDesc: [preference.preferenceCodeDesc],
                preferenceAdditionalText: [preference.preferenceAdditionalText],
                preferenceSequenceNum: [preference.preferenceSequenceNum],
              })
            )
          });
        } else {
          this.addPreference();
        }
      });
    });
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

  addPreference() {
      (this.preferenceForm.controls['items'] as FormArray).push(this.createItem())
  }

  deleteRow(index: number) {
    (this.preferenceForm.controls['items'] as FormArray).removeAt(index);
  }

  submit () {
    this.loyaltyMember.loyaltyMemberPreferences = this.preferenceForm.value.items;
    this.userService.updateLoyaltyMember(this.loyaltyMember).subscribe(data => {
      console.log(data);
    });
    console.log(this.preferenceForm.value);
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
