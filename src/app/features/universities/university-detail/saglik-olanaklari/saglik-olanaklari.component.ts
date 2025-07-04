import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-saglik-olanaklari',
  templateUrl: './saglik-olanaklari.component.html',
  styleUrls: ['./saglik-olanaklari.component.scss']
})
export class SaglikOlanaklariComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }
}