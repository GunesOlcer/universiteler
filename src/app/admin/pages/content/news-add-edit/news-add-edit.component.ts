import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-news-add-edit',
  templateUrl: './news-add-edit.component.html',
  styleUrls: ['./news-add-edit.component.scss']
})
export class NewsAddEditComponent implements OnInit {
  newsForm: FormGroup;
  isEditMode = false;
  submitted = false;
  submitting = false;
  selectedId: number | null = null; // string'den number'a değiştirildi
  
  mainImagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.newsForm = this.formBuilder.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      subtitle: [''],
      content: ['', Validators.required],
      mainImageUrl: [''],
      seoKeywords: [''],
      seoDescription: [''],
      isActive: [true],
      type: ['news', Validators.required],
      isImportant: [false]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.selectedId = +id; // string'i number'a çevir
      this.isEditMode = true;
      this.loadNews();
    }
  }

  loadNews(): void {
    if (this.selectedId) {
      // getNewsById metodu yoksa, alternatif olarak getNews kullanabilirsiniz
      this.contentService.getNews({ id: this.selectedId }).subscribe(
        (data: any) => {
          this.newsForm.patchValue(data);
          this.mainImagePreview = data.mainImageUrl;
        },
        (error) => {
          console.error('Error loading news:', error);
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
    this.newsForm.patchValue({ mainImageUrl: '' });
  }

  generateSlug(): void {
    const title = this.newsForm.get('title')?.value;
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
        
      this.newsForm.patchValue({ slug });
    }
  }

  get f() {
    return this.newsForm.controls;
  }

  saveNews(): void {
    this.submitted = true;

    if (this.newsForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = new FormData();
    
    Object.keys(this.newsForm.controls).forEach(key => {
      formData.append(key, this.newsForm.get(key)?.value);
    });

    if (this.selectedFile) {
      formData.append('mainImage', this.selectedFile);
    }

    if (this.isEditMode && this.selectedId) {
      this.contentService.updateNews(this.selectedId, formData).subscribe(
        () => {
          this.router.navigate(['/admin/news']);
        },
        (error) => {
          console.error('Error updating news:', error);
          this.submitting = false;
        }
      );
    } else {
      this.contentService.createNews(formData).subscribe(
        () => {
          this.router.navigate(['/admin/news']);
        },
        (error) => {
          console.error('Error creating news:', error);
          this.submitting = false;
        }
      );
    }
  }
}