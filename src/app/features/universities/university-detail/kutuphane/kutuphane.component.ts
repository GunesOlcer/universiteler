import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-kutuphane',
  templateUrl: './kutuphane.component.html',
  styleUrls: ['./kutuphane.component.scss']
})
export class KutuphaneComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}