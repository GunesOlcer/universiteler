// src/app/admin/pages/universities/program-menu/program-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../services/program.service';

@Component({
  selector: 'app-program-menu',
  templateUrl: './program-menu.component.html',
  styleUrls: ['./program-menu.component.scss']
})
export class ProgramMenuComponent implements OnInit {
  programId: number;
  program: any = {};
  menuItems = [
    { id: 1, title: 'Ayrıntılı Bilgi', content: '' },
    { id: 2, title: 'Akademik Kadro', content: '' },
    { id: 3, title: 'Geçmiş Yıllar', content: '' },
    { id: 4, title: 'Özel Koşullar', content: '' }
  ];
  
  showConfirmDialog = false;
  menuItemToDelete: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.programId = +this.route.snapshot.paramMap.get('id');
    this.loadProgram();
    this.loadProgramMenus();
  }

  loadProgram(): void {
    this.programService.getProgram(this.programId).subscribe(
      (data: any) => {
        this.program = data;
      },
      (error) => {
        console.error('Error loading program:', error);
      }
    );
  }

  loadProgramMenus(): void {
    // In a real app, you would load menu items from a service
    console.log('Loading menus for program ID:', this.programId);
  }

  editMenuItem(menuItem: any): void {
    this.router.navigate(['/admin/programs/menus/edit', this.programId, menuItem.id]);
  }

  confirmDeleteMenuItem(menuItem: any): void {
    this.menuItemToDelete = menuItem;
    this.showConfirmDialog = true;
  }

  deleteMenuItem(): void {
    if (this.menuItemToDelete) {
      // In a real app, you would call a service to delete the menu item
      this.menuItems = this.menuItems.filter(item => item.id !== this.menuItemToDelete.id);
      this.showConfirmDialog = false;
      this.menuItemToDelete = null;
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.menuItemToDelete = null;
  }
}