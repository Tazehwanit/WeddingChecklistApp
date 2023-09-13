import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../checklist.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  loggedIn = false;
  
  constructor(private checklistService: ChecklistService,
    private router: Router){
    }

  ngOnInit(){
    this.checklistService.loggedInObs.subscribe(value => {
      this.loggedIn = value;
    })
  }
  
  logout(){
    this.checklistService.logout();
    this.router.navigate(['/login']);
    this.loggedIn = false;
  }

}
