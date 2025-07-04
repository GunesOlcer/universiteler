import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-pages-add-edit',
  templateUrl: './pages-add-edit.component.html',
  styleUrls: ['./pages-add-edit.component.scss']
})
export class PagesAddEditComponent implements OnInit {
  pageForm: FormGroup;
  isEditMode = false;
  submitted = false;
  submitting = false;
  selectedId: number | null = null;
  
  mainImagePreview: string | null = null;
  selectedFile: File | null = null;
  dynamicMenus: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDynamicMenus();
    this.checkEditMode();
  }

  initForm(): void {
    this.pageForm = this.formBuilder.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      subtitle: [''],
      content: ['', Validators.required],
      mainImageUrl: [''],
      seoKeywords: [''],
      seoDescription: [''],
      dynamicMenuIds: [[]],
      isActive: [true]
    });
  }

  loadDynamicMenus(): void {
    this.contentService.getDynamicMenus().subscribe(
      (data: any) => {
        this.dynamicMenus = data;
      },
      (error) => {
        console.error('Error loading dynamic menus:', error);
      }
    );
  }

  checkEditMode(): void {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.selectedId = +id;
      this.isEditMode = true;
      this.loadPage();
    }
  }

  loadPage(): void {
    if (this.selectedId) {
      this.contentService.getPage(this.selectedId).subscribe(
        (data: any) => {
          this.pageForm.patchValue(data);
          this.mainImagePreview = data.mainImageUrl;
        },
        (error) => {
          console.error('Error loading page:', error);
        }
      );
    }
  }

  onMainImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece resim dosyası seçin');
        return;
      }

      // Validate file size (4MB max)
      if (file.size > 4 * 1024 * 1024) {
        alert('Resim dosyası en fazla 4MB olabilir');
        return;
      }

      this.selectedFile = file;

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeMainImage(): void {
    this.mainImagePreview = null;
    this.selectedFile = null;
    this.pageForm.patchValue({ mainImageUrl: '' });
  }

  generateSlug(): void {
    const title = this.pageForm.get('title')?.value;
    if (title) {
      let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Türkçe karakterleri değiştir
      slug = slug
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
        
      this.pageForm.patchValue({ slug });
    }
  }

  get f() {
    return this.pageForm.controls;
  }

  savePage(): void {
    this.submitted = true;

    if (this.pageForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = new FormData();
    
    Object.keys(this.pageForm.controls).forEach(key => {
      const value = this.pageForm.get(key)?.value;
      if (key === 'dynamicMenuIds' && Array.isArray(value)) {
        value.forEach((id: any) => {
          formData.append('dynamicMenuIds[]', id);
        });
      } else {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('mainImage', this.selectedFile);
    }

    if (this.isEditMode && this.selectedId) {
      this.contentService.updatePage(this.selectedId, formData).subscribe(
        () => {
          this.router.navigate(['/admin/pages']);
        },
        (error) => {
          console.error('Error updating page:', error);
          this.submitting = false;
        }
      );
    } else {
      this.contentService.createPage(formData).subscribe(
        () => {
          this.router.navigate(['/admin/pages']);
        },
        (error) => {
          console.error('Error creating page:', error);
          this.submitting = false;
        }
      );
    }
  }
}