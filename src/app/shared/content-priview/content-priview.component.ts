import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-priview',
  templateUrl: './content-priview.component.html',
  styleUrls: ['./content-priview.component.scss']
})
export class ContentPriviewComponent implements OnInit{
  @Input() title!:string;
  @Input() content!:string;
  constructor(){

  }
  ngOnInit(): void {
  }

}
