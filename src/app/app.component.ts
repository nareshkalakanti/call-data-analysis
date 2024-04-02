import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, filter, map, pipe } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'csv-web';
  public isNavWhite = true;
  public subscription: Array<Subscription> = [];
  public isLoggedIn = false;

  constructor(){}
  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.subscription.forEach(i => i.unsubscribe());
  }
}
