import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';

export type DialogType = 'default' | 'danger' | 'warning' | 'success' | 'info';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() title = 'Onay';
  @Input() message = 'Bu işlemi yapmak istediğinizden emin misiniz?';
  @Input() confirmButtonText = 'Evet';
  @Input() cancelButtonText = 'Hayır';
  @Input() type: DialogType = 'default';
  @Input() icon?: string;
  @Input() showIcon = true;
  @Input() isProcessing = false;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
  
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.onCancel();
  }
  
  getIcon(): string {
    if (this.icon) return this.icon;
    
    switch (this.type) {
      case 'danger': return 'exclamation-triangle';
      case 'warning': return 'exclamation-circle';
      case 'success': return 'check-circle';
      case 'info': return 'info-circle';
      default: return 'question-circle';
    }
  }
  
  getIconClass(): string {
    switch (this.type) {
      case 'danger': return 'icon-danger';
      case 'warning': return 'icon-warning';
      case 'success': return 'icon-success';
      case 'info': return 'icon-info';
      default: return 'icon-default';
    }
  }
  
  getButtonClass(): string {
    switch (this.type) {
      case 'danger': return 'btn-danger';
      case 'warning': return 'btn-warning';
      case 'success': return 'btn-success';
      case 'info': return 'btn-info';
      default: return 'btn-primary';
    }
  }
}