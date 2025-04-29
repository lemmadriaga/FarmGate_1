import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService, User } from '../../../services/user.service'; 

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {

  customers$!: Observable<User[]>; 

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.customers$ = this.userService.getUsersByRole('regular');
  }

}
