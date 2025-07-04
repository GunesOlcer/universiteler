import { Component, Input, OnInit } from '@angular/core';
import { University } from '../../../../core/models/university.model';

@Component({
  selector: 'app-kampusler',
  templateUrl: './kampusler.component.html',
  styleUrls: ['./kampusler.component.scss']
})
export class KampuslerComponent implements OnInit {
  @Input() university: University | undefined;

  constructor() {}

  ngOnInit(): void {
  }

  getFormattedAddress(): string {
    if (!this.university?.address) return '';
    return this.university.address.replace(/\n/g, '<br>');
  }
}