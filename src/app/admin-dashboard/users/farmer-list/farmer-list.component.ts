import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService, User } from '../../../services/user.service'; 

@Component({
  selector: 'app-farmer-list',
  templateUrl: './farmer-list.component.html',
  styleUrls: ['./farmer-list.component.scss'],
})
export class FarmerListComponent implements OnInit {

  farmers$!: Observable<User[]>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.farmers$ = this.userService.getUsersByRole('farmer');
  }

}
