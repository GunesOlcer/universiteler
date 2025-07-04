import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-cift-ana-dal',
  templateUrl: './cift-ana-dal.component.html',
  styleUrls: ['./cift-ana-dal.component.scss']
})
export class CiftAnaDalComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}