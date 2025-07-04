import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-taban-puanlar',
  templateUrl: './taban-puanlar.component.html',
  styleUrls: ['./taban-puanlar.component.scss']
})
export class TabanPuanlarComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}