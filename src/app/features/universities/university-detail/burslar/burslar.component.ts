import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-burslar',
  templateUrl: './burslar.component.html',
  styleUrls: ['./burslar.component.scss']
})
export class BurslarComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}