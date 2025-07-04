import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-hazirlik-egitimi',
  templateUrl: './hazirlik-egitimi.component.html',
  styleUrls: ['./hazirlik-egitimi.component.scss']
})
export class HazirlikEgitimiComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}