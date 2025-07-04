import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { CountryService } from '../../../../core/services/country.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Country, CountryFilterParams } from '../../../../core/models/country.model';
import { Status, getStatusName } from '../../../../core/models/base.model';

interface ExportFormat {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit, OnDestroy {
  countries: Country[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  loading = false;
  exporting = false;
  
  filters: CountryFilterParams = {
    searchTerm: '',
    status: undefined,
    pageNumber: 1,
    pageSize: 10
  };
  
  filterPanelOpen = true;
  showConfirmDialog = false;
  countryToDelete: Country | null = null;
  Math = Math;
  Status = Status;

  exportFormats: ExportFormat[] = [
    { key: 'excel', label: 'Excel (.xlsx)', icon: 'fas fa-file-excel' },
    { key: 'csv', label: 'CSV (.csv)', icon: 'fas fa-file-csv' },
    { key: 'pdf', label: 'PDF (.pdf)', icon: 'fas fa-file-pdf' }
  ];

  showExportDropdown = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private countryService: CountryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🏁 [CountriesList] Component initialized');
    this.checkAuthentication();
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAuthentication(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          console.error('❌ [CountriesList] User not authenticated');
          this.router.navigate(['/admin/login']);
        } else {
          console.log('✅ [CountriesList] User authenticated');
        }
      });
  }

  loadCountries(): void {
    this.loading = true;
    console.log('🔄 [CountriesList] Loading countries with filters:', this.filters);
    
    const params: CountryFilterParams = {
      ...this.filters,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };

    this.countryService.getAllPaginated(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ [CountriesList] Countries loaded:', response);
          this.countries = response.data;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.currentPage = response.pageNumber;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ [CountriesList] Error loading countries:', error);
          this.showError('Ülkeler yüklenirken hata oluştu: ' + error.message);
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    console.log('🔍 [CountriesList] Applying filters:', this.filters);
    this.currentPage = 1;
    this.loadCountries();
  }

  resetFilters(): void {
    console.log('🔄 [CountriesList] Resetting filters');
    this.filters = {
      searchTerm: '',
      status: undefined,
      pageNumber: 1,
      pageSize: 10
    };
    this.currentPage = 1;
    this.loadCountries();
  }

  onPageChange(page: number): void {
    console.log('📄 [CountriesList] Page changed to:', page);
    this.currentPage = page;
    this.loadCountries();
  }

  confirmDelete(country: Country): void {
    console.log('🗑️ [CountriesList] Confirm delete for country:', country.name);
    this.countryToDelete = country;
    this.showConfirmDialog = true;
  }

  deleteCountry(): void {
    if (!this.countryToDelete) return;

    console.log('🗑️ [CountriesList] Deleting country:', this.countryToDelete.name);

    this.countryService.delete(this.countryToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ [CountriesList] Country deleted successfully');
          this.countries = this.countries.filter(c => c.id !== this.countryToDelete!.id);
          this.totalItems--;
          this.showConfirmDialog = false;
          this.countryToDelete = null;
          this.showSuccess('Ülke başarıyla silindi.');
          
          // If current page is empty and not the first page, go to previous page
          if (this.countries.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadCountries();
          }
        },
        error: (error) => {
          console.error('❌ [CountriesList] Error deleting country:', error);
          this.showError('Ülke silinirken hata oluştu: ' + error.message);
          this.showConfirmDialog = false;
          this.countryToDelete = null;
        }
      });
  }

  cancelDelete(): void {
    console.log('🚫 [CountriesList] Delete cancelled');
    this.showConfirmDialog = false;
    this.countryToDelete = null;
  }

  exportData(format: string): void {
    console.log('📤 [CountriesList] Exporting data in format:', format);
    this.exporting = true;
    this.showExportDropdown = false;

    // Get all countries for export (without pagination)
    const exportParams: CountryFilterParams = {
      ...this.filters,
      pageNumber: 1,
      pageSize: 9999 // Large number to get all records
    };

    this.countryService.getAllPaginated(exportParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          switch (format) {
            case 'excel':
              this.exportToExcel(response.data);
              break;
            case 'csv':
              this.exportToCSV(response.data);
              break;
            case 'pdf':
              this.exportToPDF(response.data);
              break;
            default:
              this.showError('Desteklenmeyen export formatı');
          }
          this.exporting = false;
        },
        error: (error) => {
          console.error('❌ [CountriesList] Export error:', error);
          this.showError('Export işlemi sırasında hata oluştu: ' + error.message);
          this.exporting = false;
        }
      });
  }

  private exportToExcel(data: Country[]): void {
    const headers = ['ID', 'Ülke Adı', 'Ülke Kodu', 'Durum', 'Oluşturma Tarihi'];
    const rows = data.map(country => [
      country.id,
      country.name,
      country.code,
      this.getStatusName(country.status),
      new Date(country.createdDate).toLocaleDateString('tr-TR')
    ]);

    this.downloadFile([headers, ...rows], 'countries.xlsx', 'excel');
  }

  private exportToCSV(data: Country[]): void {
    const headers = ['ID', 'Ülke Adı', 'Ülke Kodu', 'Durum', 'Oluşturma Tarihi'];
    const csvContent = [
      headers.join(','),
      ...data.map(country => [
        country.id,
        `"${country.name}"`,
        country.code,
        `"${this.getStatusName(country.status)}"`,
        new Date(country.createdDate).toLocaleDateString('tr-TR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, 'countries.csv');
  }

  private exportToPDF(data: Country[]): void {
    // Simple PDF export - in a real application, you'd use a library like jsPDF
    const content = `
      Ülke Listesi
      Tarih: ${new Date().toLocaleDateString('tr-TR')}
      
      ${data.map(country => 
        `${country.name} (${country.code}) - ${this.getStatusName(country.status)}`
      ).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    this.downloadBlob(blob, 'countries.txt');
    
    // Show message about PDF
    this.showInfo('PDF export için gelişmiş kütüphane gerekiyor. Şimdilik metin dosyası olarak indirildi.');
  }

  private downloadFile(data: any[], filename: string, type: string): void {
    // Simple implementation - in production use libraries like SheetJS for Excel
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename.replace('.xlsx', '.csv'));
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.showSuccess(`${filename} başarıyla indirildi.`);
  }

  toggleExportDropdown(): void {
    this.showExportDropdown = !this.showExportDropdown;
  }

  closeExportDropdown(): void {
    this.showExportDropdown = false;
  }

  getStatusName(status: Status): string {
    return getStatusName(status);
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case Status.Active: return 'status-active';
      case Status.Passive: return 'status-passive';
      case Status.Pending: return 'status-pending';
      case Status.Deleted: return 'status-deleted';
      default: return 'status-unknown';
    }
  }

  getActiveCount(): number {
    return this.countries.filter(country => country.status === Status.Active).length;
  }

  trackByCountryId(index: number, country: Country): number {
    return country.id;
  }

  private showSuccess(message: string): void {
    console.log('✅ Success:', message);
    // TODO: Replace with proper toast notification service
    alert(message);
  }

  private showError(message: string): void {
    console.error('❌ Error:', message);
    // TODO: Replace with proper toast notification service
    alert(message);
  }

  private showInfo(message: string): void {
    console.log('ℹ️ Info:', message);
    // TODO: Replace with proper toast notification service
    alert(message);
  }
}