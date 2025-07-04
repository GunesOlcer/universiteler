import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() maxVisiblePages = 5;
  @Input() showPageSizes = false;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() currentPageSize = 10;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  
  visiblePages: number[] = [];
  showJumpToPage = false;
  jumpToPageValue: number = 1;
  
  ngOnChanges(changes: SimpleChanges): void {
    this.updateVisiblePages();
    // Reset jump to page value when current page changes
    if (changes['currentPage']) {
      this.jumpToPageValue = this.currentPage;
    }
  }
  
  updateVisiblePages(): void {
    if (this.totalPages <= this.maxVisiblePages) {
      // Show all pages
      this.visiblePages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      // Show a subset of pages with ellipsis logic
      const halfMax = Math.floor(this.maxVisiblePages / 2);
      
      // Always show first and last page
      if (this.currentPage <= halfMax + 1) {
        // Near the start
        this.visiblePages = Array.from({ length: this.maxVisiblePages - 1 }, (_, i) => i + 1);
        this.visiblePages.push(-1); // Ellipsis
        this.visiblePages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - halfMax) {
        // Near the end
        this.visiblePages = [1, -1];
        this.visiblePages = this.visiblePages.concat(
          Array.from(
            { length: this.maxVisiblePages - 1 }, 
            (_, i) => this.totalPages - (this.maxVisiblePages - 2) + i
          )
        );
      } else {
        // Middle case
        this.visiblePages = [1, -1];
        this.visiblePages = this.visiblePages.concat(
          Array.from(
            { length: this.maxVisiblePages - 3 }, 
            (_, i) => this.currentPage - Math.floor((this.maxVisiblePages - 3) / 2) + i
          )
        );
        this.visiblePages.push(-1);
        this.visiblePages.push(this.totalPages);
      }
    }
  }
  
  onPageClick(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
  
  onPageSizeChange(event: Event): void {
    const pageSize = parseInt((event.target as HTMLSelectElement).value, 10);
    if (pageSize !== this.currentPageSize) {
      this.pageSizeChange.emit(pageSize);
    }
  }
  
  toggleJumpToPage(): void {
    this.showJumpToPage = !this.showJumpToPage;
    if (this.showJumpToPage) {
      this.jumpToPageValue = this.currentPage;
      setTimeout(() => {
        const input = document.getElementById('jumpToPageInput');
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }
  
  jumpToPage(): void {
    const page = Math.min(Math.max(1, this.jumpToPageValue), this.totalPages);
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
    this.showJumpToPage = false;
  }
  
  onJumpInputKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.jumpToPage();
    } else if (event.key === 'Escape') {
      this.showJumpToPage = false;
    }
  }
  
  isEllipsis(page: number): boolean {
    return page === -1;
  }
}