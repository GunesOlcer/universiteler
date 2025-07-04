import { Component, Input, OnInit } from '@angular/core';
import { Dormitory } from '../../../../core/models/dormitory.model';

@Component({
  selector: 'app-olanaklar',
  templateUrl: './olanaklar.component.html',
  styleUrls: ['./olanaklar.component.scss']
})
export class OlanaklarComponent implements OnInit {
  @Input() dormitory: Dormitory | null = null;

  constructor() {}

  ngOnInit(): void {}

  getFeatureIcon(icon?: string): string {
    if (icon) {
      return icon.startsWith('fa-') ? icon : `fa-${icon}`;
    }
    return 'fa-check';
  }
}