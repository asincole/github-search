import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'asincole-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // user data property
  user: any;
  // user repositories property
  userRepos: any;

  constructor(private users: UsersService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // get users github username from url
    const id = this.route.snapshot.paramMap.get('id');
    // get user data
    this.users.getUser(id)
      .subscribe((response) => {
        this.user = response;
      });
    // get user's repository data
    this.users.getUserRepos(id)
      .subscribe((response) => {
        this.userRepos = response;
      });
  }


}
