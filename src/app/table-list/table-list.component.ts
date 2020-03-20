import {Component, OnInit} from '@angular/core';

import {MatTableDataSource} from '@angular/material/table';
import { UserService } from 'app/service/user.service';

export interface PeriodicElement {
  firstName: string;
  skymilesId: number;
  lastName: string;
  Email: string;
}




@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})

export class TableListComponent implements OnInit{
  displayedColumns: string[] = ['loyaltyMemberId', 'firstName', 'lastName', 'Email', 'actions'];
  dataSource = new MatTableDataSource();

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getLoyaltyMembers();
  }

  getLoyaltyMembers() {
    this.userService.getLoyaltyMembers().subscribe(data => {
      this.dataSource.data = data;
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
