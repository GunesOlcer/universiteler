import { Component, Input, OnInit } from '@angular/core';
import { Dormitory } from '../../../../core/models/dormitory.model';

@Component({
  selector: 'app-konum-cevre',
  templateUrl: './konum-cevre.component.html',
  styleUrls: ['./konum-cevre.component.scss']
})
export class KonumCevreComponent implements OnInit {
  @Input() dormitory: Dormitory | null = null;

  constructor() {}

  ngOnInit(): void {}
}