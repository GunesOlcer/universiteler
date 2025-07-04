import { Component, Input, OnInit } from '@angular/core';
import { Dormitory } from '../../../../core/models/dormitory.model';

@Component({
  selector: 'app-genel-bilgi',
  templateUrl: './genel-bilgi.component.html',
  styleUrls: ['./genel-bilgi.component.scss']
})
export class GenelBilgiComponent implements OnInit {
  @Input() dormitory: Dormitory | null = null;

  constructor() {}

  ngOnInit(): void {}

  hasContactInfo(): boolean {
    return !!(this.dormitory?.phone || 
              this.dormitory?.email || 
              this.dormitory?.website || 
              this.dormitory?.address);
  }
}