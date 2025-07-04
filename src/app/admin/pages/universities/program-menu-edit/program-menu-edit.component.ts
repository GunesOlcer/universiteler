// src/app/admin/pages/universities/program-menu-edit/program-menu-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../../../services/program.service';

@Component({
  selector: 'app-program-menu-edit',
  templateUrl: './program-menu-edit.component.html',
  styleUrls: ['./program-menu-edit.component.scss']
})
export class ProgramMenuEditComponent implements OnInit {
  programId: number;
  menuItemId: number;
  program: any = {};
  menuItem: any = {};
  contentForm: FormGroup;
  submitted = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService
  ) {
    this.contentForm = this.createForm();
  }

  ngOnInit(): void {
    this.programId = +this.route.snapshot.paramMap.get('programId');
    this.menuItemId = +this.route.snapshot.paramMap.get('menuItemId');
    
    this.loadProgram();
    this.loadMenuItem();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
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

  loadMenuItem(): void {
    // In a real app, you would call a service to get the menu item
    // For now, we'll use mock data
    const mockMenuItems = [
      { id: 1, title: 'Ayrıntılı Bilgi', content: 'Program hakkında detaylı bilgi buraya gelecek.' },
      { id: 2, title: 'Akademik Kadro', content: 'Programın akademik kadrosu buraya gelecek.' },
      { id: 3, title: 'Geçmiş Yıllar', content: 'Programın geçmiş yıllardaki durumu buraya gelecek.' },
      { id: 4, title: 'Özel Koşullar', content: 'Programa ait özel koşullar buraya gelecek.' }
    ];
    
    this.menuItem = mockMenuItems.find(item => item.id === this.menuItemId) || {};
    
    if (this.menuItem) {
      this.contentForm.patchValue({
        title: this.menuItem.title,
        content: this.menuItem.content
      });
    }
  }

  // Helper to access form controls easily in the template
  get f() {
    return this.contentForm.controls;
  }

  saveContent(): void {
    this.submitted = true;
    
    if (this.contentForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    // In a real app, you would call a service to save the changes
    setTimeout(() => {
      this.submitting = false;
      this.router.navigate(['/admin/programs/menus', this.programId]);
    }, 1000);
  }
}