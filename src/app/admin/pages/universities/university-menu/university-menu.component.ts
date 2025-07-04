// university-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-university-menu',
  templateUrl: './university-menu.component.html',
  styleUrls: ['./university-menu.component.scss']
})
export class UniversityMenuComponent implements OnInit {
  universityId: number;
  university: any = {};
  menuStructure = [
    {
      id: 1,
      title: '1. Üniversite',
      children: [
        { id: 101, title: '1.A. Kilit Özellikler', content: '' },
        { id: 102, title: '1.B. Kampüsler', content: '' },
        { id: 103, title: '1.C. Burslar', content: '' },
        { id: 104, title: '1.D. Barınma', content: '' },
        { id: 105, title: '1.E. İş ve Staj', content: '' },
        { id: 106, title: '1.F. Erasmus', content: '' },
        { id: 107, title: '1.G. Sık Sorulanlar', content: '' }
      ]
    },
    {
      id: 2,
      title: '2. Eğitim',
      children: [
        { id: 201, title: '2.A. Eğitim Sistemi', content: '' },
        { id: 202, title: '2.B. Bölüm ve Puanlar', content: '' },
        { id: 203, title: '2.C. Hazırlık Eğitimi', content: '' },
        { id: 204, title: '2.D. Çift Ana Dal - Yan Dal', content: '' },
        { id: 205, title: '2.E. Uzaktan Eğitim', content: '' },
        { id: 206, title: '2.F. Akreditasyon', content: '' }
      ]
    },
    {
      id: 3,
      title: '3. Kampüs',
      children: [
        { id: 301, title: '3.A. Ulaşım', content: '' },
        { id: 302, title: '3.B. Yaşam', content: '' },
        { id: 303, title: '3.C. Topluluklar', content: '' },
        { id: 304, title: '3.D. Kütüphane', content: '' },
        { id: 305, title: '3.E. Sağlık Olanakları', content: '' },
        { id: 306, title: '3.F. Spor Olanakları', content: '' },
        { id: 307, title: '3.G. Yeme-İçme', content: '' },
        { id: 308, title: '3.H. Diğer Olanaklar', content: '' }
      ]
    },
    {
      id: 5,
      title: '5. Uluslararası',
      children: []
    }
  ];

  showConfirmDialog = false;
  menuItemToDelete: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private universityService: UniversityService
  ) { }

  ngOnInit(): void {
    this.universityId = +this.route.snapshot.paramMap.get('id');
    this.loadUniversity();
    // In a real app, you would also load the menu data for this university
    this.loadUniversityMenus();
  }

  loadUniversity(): void {
    this.universityService.getUniversity(this.universityId).subscribe(
      (data: any) => {
        this.university = data;
      },
      (error) => {
        console.error('Error loading university:', error);
      }
    );
  }

  loadUniversityMenus(): void {
    // In a real app, you would load menu data from a service
    // For now, we'll use the hardcoded menuStructure
    console.log('Loading menus for university ID:', this.universityId);
  }

  editMenuItem(menuItem: any): void {
    this.router.navigate(['/admin/universities/menus/edit', this.universityId, menuItem.id]);
  }

  confirmDeleteMenuItem(menuItem: any, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.menuItemToDelete = menuItem;
    this.showConfirmDialog = true;
  }

  deleteMenuItem(): void {
    if (this.menuItemToDelete) {
      // In a real app, make an API call to delete the menu item
      console.log('Deleting menu item:', this.menuItemToDelete);
      
      // For demo purposes, we'll just update our local structure
      for (const category of this.menuStructure) {
        category.children = category.children.filter(item => item.id !== this.menuItemToDelete.id);
      }
      
      this.showConfirmDialog = false;
      this.menuItemToDelete = null;
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.menuItemToDelete = null;
  }
}