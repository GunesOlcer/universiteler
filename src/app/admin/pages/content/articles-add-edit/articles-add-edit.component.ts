import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-articles-add-edit',
  templateUrl: './articles-add-edit.component.html',
  styleUrls: ['./articles-add-edit.component.scss']
})
export class ArticlesAddEditComponent implements OnInit {
  articleForm: FormGroup;
  isEditMode = false;
  submitted = false;
  submitting = false;
  selectedId: number | null = null;
  
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
    this.articleForm = this.formBuilder.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      subtitle: [''],
      content: ['', Validators.required],
      mainImageUrl: [''],
      seoKeywords: [''],
      seoDescription: [''],
      isActive: [true],
      isImportant: [false]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.selectedId = +id;
      this.isEditMode = true;
      this.loadArticle();
    }
  }

  loadArticle(): void {
    if (this.selectedId) {
      // getArticleById yerine getArticle metodunu kullanın
      this.contentService.getArticle(this.selectedId).subscribe(
        (data: any) => {
          this.articleForm.patchValue(data);
          this.mainImagePreview = data.mainImageUrl;
        },
        (error) => {
          console.error('Error loading article:', error);
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
    this.articleForm.patchValue({ mainImageUrl: '' });
  }

  generateSlug(): void {
    const title = this.articleForm.get('title')?.value;
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
        
      this.articleForm.patchValue({ slug });
    }
  }

  get f() {
    return this.articleForm.controls;
  }

  saveArticle(): void {
    this.submitted = true;

    if (this.articleForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = new FormData();
    
    Object.keys(this.articleForm.controls).forEach(key => {
      formData.append(key, this.articleForm.get(key)?.value);
    });

    if (this.selectedFile) {
      formData.append('mainImage', this.selectedFile);
    }

    if (this.isEditMode && this.selectedId) {
      this.contentService.updateArticle(this.selectedId, formData).subscribe(
        () => {
          this.router.navigate(['/admin/articles']);
        },
        (error) => {
          console.error('Error updating article:', error);
          this.submitting = false;
        }
      );
    } else {
      this.contentService.createArticle(formData).subscribe(
        () => {
          this.router.navigate(['/admin/articles']);
        },
        (error) => {
          console.error('Error creating article:', error);
          this.submitting = false;
        }
      );
    }
  }
}