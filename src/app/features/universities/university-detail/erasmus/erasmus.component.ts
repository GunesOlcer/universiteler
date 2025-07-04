import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-erasmus',
  templateUrl: './erasmus.component.html',
  styleUrls: ['./erasmus.component.scss']
})
export class ErasmusComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}