import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-yurtlar',
  templateUrl: './yurtlar.component.html',
  styleUrls: ['./yurtlar.component.scss']
})
export class YurtlarComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}