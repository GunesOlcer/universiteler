import { Component, Input, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @ViewChild('fileInput') fileInput: ElementRef;
  
  @Input() acceptedTypes = 'image/*';
  @Input() maxFileSize = 1024 * 1024 * 4; // 4MB
  @Input() minDimensions = { width: 0, height: 0 };
  @Input() maxDimensions = { width: 0, height: 0 };
  @Input() currentImageUrl = '';
  @Input() helperText = '';
  
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errors: string[] = [];
  isDragOver = false; // Track drag state for visual feedback
  
  private onChange: (file: File | null) => void = () => {};
  private onTouched: () => void = () => {};
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateFile(file);
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.validateFile(file);
    }
  }
  
  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.errors = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.onChange(null);
  }
  
  removeImage(): void {
    this.currentImageUrl = '';
    this.onChange(null);
  }
  
  writeValue(value: any): void {
    // If the value is a File object, use it
    if (value instanceof File) {
      this.validateFile(value);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }
  
  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  private validateFile(file: File): void {
    this.errors = [];
    
    // Check file type
    if (this.acceptedTypes !== '*' && !file.type.match(new RegExp(this.acceptedTypes.replace('*', '.*')))) {
      this.errors.push(`Dosya türü uygun değil. Kabul edilen türler: ${this.acceptedTypes}`);
    }
    
    // Check file size
    if (file.size > this.maxFileSize) {
      const maxSizeMB = this.maxFileSize / (1024 * 1024);
      this.errors.push(`Dosya boyutu çok büyük. Maksimum dosya boyutu: ${maxSizeMB} MB`);
    }
    
    // If it's an image, check dimensions
    if (file.type.startsWith('image/') && (this.minDimensions.width > 0 || this.minDimensions.height > 0 || 
        this.maxDimensions.width > 0 || this.maxDimensions.height > 0)) {
      
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        if (this.minDimensions.width > 0 && img.width < this.minDimensions.width) {
          this.errors.push(`Resim genişliği çok küçük. Minimum genişlik: ${this.minDimensions.width}px`);
        }
        
        if (this.minDimensions.height > 0 && img.height < this.minDimensions.height) {
          this.errors.push(`Resim yüksekliği çok küçük. Minimum yükseklik: ${this.minDimensions.height}px`);
        }
        
        if (this.maxDimensions.width > 0 && img.width > this.maxDimensions.width) {
          this.errors.push(`Resim genişliği çok büyük. Maksimum genişlik: ${this.maxDimensions.width}px`);
        }
        
        if (this.maxDimensions.height > 0 && img.height > this.maxDimensions.height) {
          this.errors.push(`Resim yüksekliği çok büyük. Maksimum yükseklik: ${this.maxDimensions.height}px`);
        }
        
        if (this.errors.length === 0) {
          this.selectedFile = file;
          this.previewUrl = objectUrl;
          this.onChange(file);
        } else {
          this.selectedFile = null;
          this.previewUrl = null;
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
          this.onChange(null);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        this.errors.push('Geçersiz resim dosyası.');
        this.selectedFile = null;
        this.previewUrl = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.onChange(null);
      };
      
      img.src = objectUrl;
      
    } else {
      // For non-image files or when no dimension checks are needed
      if (this.errors.length === 0) {
        this.selectedFile = file;
        this.previewUrl = URL.createObjectURL(file);
        this.onChange(file);
      } else {
        this.selectedFile = null;
        this.previewUrl = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.onChange(null);
      }
    }
  }
}