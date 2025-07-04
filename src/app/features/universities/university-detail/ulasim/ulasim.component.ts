import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-ulasim',
  templateUrl: './ulasim.component.html',
  styleUrls: ['./ulasim.component.scss']
})
export class UlasimComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}