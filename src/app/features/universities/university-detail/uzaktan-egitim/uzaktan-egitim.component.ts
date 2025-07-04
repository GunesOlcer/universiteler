import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-uzaktan-egitim',
  templateUrl: './uzaktan-egitim.component.html',
  styleUrls: ['./uzaktan-egitim.component.scss']
})
export class UzaktanEgitimComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}