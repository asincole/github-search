import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { User, Query } from '../interfaces/interfaces';

@Component({
  selector: 'asincole-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query = new FormControl(null);

  queryResult: Query;

  currentPage;

  constructor(private users: UsersService) { }

  ngOnInit() {
    // this.search();
    // this.currentPage = this.users.lastPage;
    this.users.currentPage.subscribe((page) => this.currentPage = page);
    this.users.queryResult.subscribe((data) => {
      this.queryResult = data;
    });
  }

  search(page = 1) {
    if (this.query.valid) {
      this.users.searchUsers(this.query.value, page).subscribe((response) => {
        this.queryResult = response;
      });
    }
  }


}
