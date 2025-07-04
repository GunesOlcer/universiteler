import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-uluslararasi',
  templateUrl: './uluslararasi.component.html',
  styleUrls: ['./uluslararasi.component.scss']
})
export class UluslararasiComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}