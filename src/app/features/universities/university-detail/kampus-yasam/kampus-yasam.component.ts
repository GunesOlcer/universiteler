import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-kampus-yasam',
  templateUrl: './kampus-yasam.component.html',
  styleUrls: ['./kampus-yasam.component.scss']
})
export class KampusYasamComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}