import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-yeme-icme',
  templateUrl: './yeme-icme.component.html',
  styleUrls: ['./yeme-icme.component.scss']
})
export class YemeIcmeComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}