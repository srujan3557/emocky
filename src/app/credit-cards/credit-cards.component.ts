import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'app/service/user.service';
@Component({
  selector: 'app-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent implements OnInit {
  creditcardForm: FormGroup;
  loyaltyMember: any;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.creditcardForm = this.fb.group({
      items: this.fb.array([])
    })
    this.route.params.subscribe(params => {
      const id = params.id;
      this.userService.getLoyaltyMember(id).subscribe(data => {
        this.loyaltyMember = data;
        if (this.loyaltyMember && this.loyaltyMember.paymentCardPreferences) {
          this.loyaltyMember.paymentCardPreferences.forEach(preference => {
            (this.creditcardForm.controls['items'] as FormArray).push(
              this.fb.group({
                tokenizedCardNum: [preference.tokenizedCardNum],
                cardDiscontinueDate: [preference.cardDiscontinueDate],
                paymentCardTypeCode: [preference.paymentCardTypeCode],
                cardHolderName: [preference.cardHolderName],
                paymentCardLast4Num: [preference.paymentCardLast4Num],
                preferenceSequenceNum: [preference.preferenceSequenceNum],
                defaultCard: [preference.defaultCard],
                paymentCardAliasName: [preference.paymentCardAliasName],
                contactPointCode: [preference.contactPointCode],
                previousPurchaseVerification: [preference.previousPurchaseVerification],
                billingAdr: this.fb.group({
                  addressLine1Text: [preference.billingAdr.addressLine1Text],
                  addressLine2Text: [preference.billingAdr.addressLine2Text],
                  countryCode: [preference.billingAdr.countryCode],
                  districtTownName: [preference.billingAdr.districtTownName],
                  cityLocalityName: [preference.billingAdr.cityLocalityName],
                  prefectureLocationName: [preference.billingAdr.prefectureLocationName],
                  postalCode: [preference.billingAdr.postalCode],
                  countrySubdivisionCode: [preference.billingAdr.countrySubdivisionCode],
                  businessName: [preference.billingAdr.businessName],
                  contactPointCode: [preference.billingAdr.contactPointCode],
                  primaryAddress: [preference.billingAdr.primaryAddress],
                  addressSequenceNum: [preference.billingAdr.addressSequenceNum],
                  addressStartLocalDate: [preference.billingAdr.addressStartLocalDate],
                  addressAliasName: [preference.billingAdr.addressAliasName],
                })
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
      tokenizedCardNum: [''],
      cardDiscontinueDate: [''],
      paymentCardTypeCode: [''],
      cardHolderName: [''],
      paymentCardLast4Num: [''],
      preferenceSequenceNum: [''],
      defaultCard: [''],
      paymentCardAliasName: [''],
      contactPointCode: [''],
      previousPurchaseVerification: [''],
      billingAdr: this.fb.group({
        addressLine1Text: [''],
        addressLine2Text: [''],
        countryCode: [''],
        districtTownName: [''],
        cityLocalityName: [''],
        prefectureLocationName: [''],
        postalCode: [''],
        countrySubdivisionCode: [''],
        businessName: [''],
        contactPointCode: [''],
        primaryAddress: [''],
        addressSequenceNum: [''],
        addressStartLocalDate: [''],
        addressAliasName: [''],
      })

    })
  }

  addPreference() {
    (this.creditcardForm.controls['items'] as FormArray).push(this.createItem())
  }

  deleteRow(index: number) {
    (this.creditcardForm.controls['items'] as FormArray).removeAt(index);
  }

  submit() {
    this.loyaltyMember.paymentCardPreferences = this.creditcardForm.value.items;
    this.userService.updateLoyaltyMember(this.loyaltyMember).subscribe(data => {
      console.log(data);
    });
    console.log(this.creditcardForm.value);
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
