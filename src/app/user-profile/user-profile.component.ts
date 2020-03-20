import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  loyaltyMember: any;
  phoneCategories: any;
  emailCategories: any;
  gender: any;
  medallionStatusList: any;
  isAdd: boolean;
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {}
  showNotification(type, message) {
    $.notify({
        icon: 'notifications',
        message: message

    },{
        type: type,
        timer: 4000,
        placement: {
            from: 'top',
            align: 'center'
        },
        template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
}
  ngOnInit() {
    this.isAdd = true;
    this.phoneCategories = [{ value: 'Home', key: 'H' }, { value: 'Work', key: 'W' }, { value: 'Other', key: 'O' }];
    this.emailCategories = [{ value: 'personal', key: 'H' }, { value: 'Work', key: 'W' }, { value: 'Other', key: 'O' }];
    this.gender = [{ value: 'Male', key: 'M' }, { value: 'Female', key: 'F' }];
    this.medallionStatusList = [{ tierLevelCodeDesc: 'Gold Medallion', tierLevelCode: 'GM' },
    { tierLevelCodeDesc: 'Silver Medallion', tierLevelCode: 'SM' },
      { tierLevelCodeDesc: 'Base Member', tierLevelCode: 'FF' },
      { tierLevelCodeDesc: 'Diamond Member', tierLevelCode: 'DM' },
      { tierLevelCodeDesc: 'Platinum Medallion', tierLevelCode: 'PM' },
      { tierLevelCodeDesc: 'Four Million Miler', tierLevelCode: '04' },
      { tierLevelCodeDesc: '360', tierLevelCode: 'TS' },
      { tierLevelCodeDesc: 'Non Member', tierLevelCode: 'NM' }];
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id !== '0') {
        this.isAdd = false;
        this.userService.getLoyaltyMember(id).subscribe(data => {
          this.loyaltyMember = data;
        });
      } else {
        this.isAdd = true;
        this.loyaltyMember = {
          loyaltyMemberId: '',
          personName: {
            // namePrefixCode: '',
            firstName: '',
            middleName: '',
            lastName: ''
          },
          loyaltyMemberAccount: {
            birthDate: '',
            genderCode: '',
          },
          phones: [
            {
              countryCode: 'US',
              phoneNum: '',
              primaryPhone: true,
              contactPointCode: ''
            }
          ],
          emailAccounts: [
            {
              emailAdr: '',
              primaryEmail: true,
              contactPointCode: ''
            }
          ],
          addresses: [
            {
              addressLine1Text: '',
              cityLocalityName: '',
              countrySubdivisionCode: '',
              countryCode: '',
              postalCode: '',
              primaryAddress: true
            }
          ],
          loyaltyMemberTierLevels: [
            { tierLevelCodeDesc: 'Non Member', tierLevelCode: 'NM' }
          ]
        }
      }
    });
  }

  onPhoneAddClick($event) {
    this.loyaltyMember.phones.push({
      countryCode: 'US',
      phoneNum: '',
      primaryPhone: false,
      contactPointCode: ''
    });
  }

  onPhoneDeleteClick() {
    this.loyaltyMember.phones = this.loyaltyMember.phones.filter(x => x.primaryPhone === true);
  }

  onEmailAddClick($event) {
    this.loyaltyMember.emailAccounts.push({
      emailAdr: '',
      primaryEmail: false,
      contactPointCode: ''
    });
  }

  onEmailDeleteClick() {
    this.loyaltyMember.emailAccounts = this.loyaltyMember.emailAccounts.filter(x => x.primaryEmail === true);
  }

  onAddressAddClick($event) {
    this.loyaltyMember.addresses.push({
      addressLine1Text: '',
      cityLocalityName: '',
      countrySubdivisionCode: '',
      countryCode: '',
      postalCode: '',
      primaryAddress: false
    });
  }

  onAddressDeleteClick() {
    this.loyaltyMember.addresses = this.loyaltyMember.addresses.filter(x => x.primaryAddress === true);
  }

  onSubmitClick($event) {
    this.userService.createUserProfile(this.loyaltyMember, this.isAdd).subscribe((data) => {
      if(data && data.error) {
        this.showNotification('danger', 'Error. Please try again later!');
      } else {
        this.showNotification('success', 'Profile created successfully!');
        setTimeout(() => {
          this.router.navigate(['/table-list']);
        }, 2000);
      }
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.tierLevelCodeDescCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  alphabateOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.tierLevelCodeDescCode;
    if (charCode > 31 && (charCode < 65 || charCode > 122) || (charCode > 90 && charCode < 97)) {
      return false;
    }
    return true;
  }

}
