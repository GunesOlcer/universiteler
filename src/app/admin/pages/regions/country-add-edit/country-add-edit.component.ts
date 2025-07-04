import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CountryService } from '../../../../core/services/country.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Country, CountryCreateRequest, CountryUpdateRequest } from '../../../../core/models/country.model';
import { Status, getStatusName } from '../../../../core/models/base.model';

@Component({
  selector: 'app-country-add-edit',
  templateUrl: './country-add-edit.component.html',
  styleUrls: ['./country-add-edit.component.scss']
})
export class CountryAddEditComponent implements OnInit, OnDestroy {
  countryForm: FormGroup;
  isEditMode = false;
  countryId: number | null = null;
  submitted = false;
  submitting = false;
  loading = false;
  Status = Status;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
    private authService: AuthService
  ) {
    this.countryForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('🏁 [CountryAddEdit] Component initialized');
    this.checkAuthentication();
    this.initializeComponent();
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
          console.error('❌ [CountryAddEdit] User not authenticated');
          this.router.navigate(['/admin/login']);
        } else {
          console.log('✅ [CountryAddEdit] User authenticated');
        }
      });
  }

  private initializeComponent(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.isEditMode = true;
      this.countryId = +id;
      console.log('📝 [CountryAddEdit] Edit mode - Country ID:', this.countryId);
      this.loadCountry(this.countryId);
    } else {
      console.log('🆕 [CountryAddEdit] Create mode initialized');
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      code: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10)
      ]],
      status: [Status.Active, Validators.required]
    });
  }

  loadCountry(id: number): void {
    this.loading = true;
    console.log('🔄 [CountryAddEdit] Loading country:', id);

    this.countryService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (country: Country) => {
          console.log('✅ [CountryAddEdit] Country loaded:', country);
          this.countryForm.patchValue({
            name: country.name,
            code: country.code,
            status: country.status
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ [CountryAddEdit] Error loading country:', error);
          this.loading = false;
          this.showError('Ülke yüklenirken hata oluştu: ' + error.message);
          this.router.navigate(['/admin/countries']);
        }
      });
  }

  get f() { 
    return this.countryForm.controls; 
  }

  onCodeInput(event: any): void {
    const value = event.target.value.toUpperCase();
    this.countryForm.patchValue({ code: value });
  }

  saveCountry(): void {
    this.submitted = true;
    
    console.log('💾 [CountryAddEdit] Save country attempt:', {
      isEditMode: this.isEditMode,
      formValid: this.countryForm.valid,
      formValue: this.countryForm.value
    });

    if (this.countryForm.invalid) {
      console.log('❌ [CountryAddEdit] Form is invalid');
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.countryId) {
      this.updateCountry();
    } else {
      this.createCountry();
    }
  }

  private createCountry(): void {
    const createRequest: CountryCreateRequest = this.countryForm.value;
    
    console.log('➕ [CountryAddEdit] Creating country:', createRequest);

    this.countryService.create(createRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (country: Country) => {
          console.log('✅ [CountryAddEdit] Country created successfully:', country);
          this.showSuccess('Ülke başarıyla oluşturuldu.');
          this.router.navigate(['/admin/countries']);
        },
        error: (error) => {
          console.error('❌ [CountryAddEdit] Error creating country:', error);
          this.showError('Ülke oluşturulurken hata oluştu: ' + error.message);
          this.submitting = false;
        }
      });
  }

  private updateCountry(): void {
    if (!this.countryId) return;

    const updateRequest: CountryUpdateRequest = {
      id: this.countryId,
      ...this.countryForm.value
    };

    console.log('✏️ [CountryAddEdit] Updating country:', updateRequest);

    this.countryService.update(this.countryId, updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (country: Country) => {
          console.log('✅ [CountryAddEdit] Country updated successfully:', country);
          this.showSuccess('Ülke başarıyla güncellendi.');
          this.router.navigate(['/admin/countries']);
        },
        error: (error) => {
          console.error('❌ [CountryAddEdit] Error updating country:', error);
          this.showError('Ülke güncellenirken hata oluştu: ' + error.message);
          this.submitting = false;
        }
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.countryForm.controls).forEach(key => {
      const control = this.countryForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    console.log('🚫 [CountryAddEdit] Operation cancelled');
    this.router.navigate(['/admin/countries']);
  }

  getStatusName(status: Status): string {
    return getStatusName(status);
  }

  getStatusOptions() {
    return [
      { value: Status.Active, label: this.getStatusName(Status.Active) },
      { value: Status.Passive, label: this.getStatusName(Status.Passive) },
      { value: Status.Pending, label: this.getStatusName(Status.Pending) }
    ];
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
}