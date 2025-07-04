import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from '../../../../core/services/city.service';
import { CountryService } from '../../../../core/services/country.service';
import { City, CityCreateRequest, CityUpdateRequest, RegionType } from '../../../../core/models/city.model';
import { Country } from '../../../../core/models/country.model';
import { Status } from '../../../../core/models/base.model';

@Component({
  selector: 'app-city-add-edit',
  templateUrl: './city-add-edit.component.html',
  styleUrls: ['./city-add-edit.component.scss']
})
export class CityAddEditComponent implements OnInit {
  cityForm: FormGroup;
  isEditMode = false;
  cityId: number | null = null;
  submitted = false;
  submitting = false;
  loading = false;
  countries: Country[] = [];
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  existingImagePath: string | null = null;
  
  Status = Status;
  RegionType = RegionType;

  @ViewChild('imageInput') imageInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private countryService: CountryService
  ) {
    this.cityForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCountries();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.cityId = +id;
      this.loadCity(this.cityId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      countryId: ['', Validators.required],
      description: [''],
      region: [''],
      population: [null],
      studentPopulation: [null],
      hasAirport: [false],
      hasTrainStation: [false],
      hasHighSpeedTrain: [false],
      status: [Status.Active, Validators.required]
    });
  }

  loadCountries(): void {
    this.countryService.getAll().subscribe({
      next: (countries) => {
        this.countries = countries;
        console.log('📋 [CityAddEdit] Countries loaded:', countries);
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }

  loadCity(id: number): void {
    this.loading = true;
    this.cityService.getById(id).subscribe({
      next: (city) => {
        console.log('📋 [CityAddEdit] City loaded:', city);
        this.cityForm.patchValue({
          name: city.name,
          countryId: city.countryId,
          description: city.description || '',
          region: city.region || '',
          population: city.population || null,
          studentPopulation: city.studentPopulation || null,
          hasAirport: city.hasAirport,
          hasTrainStation: city.hasTrainStation,
          hasHighSpeedTrain: city.hasHighSpeedTrain,
          status: city.status
        });
        
        if (city.imageUrl) {
          this.imagePreview = city.imageUrl;
          this.existingImagePath = city.imagePath || '';
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading city:', error);
        this.loading = false;
        this.router.navigate(['/admin/cities']);
      }
    });
  }

  get f() { 
    return this.cityForm.controls; 
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('📷 [CityAddEdit] Image selected:', file.name, 'Size:', file.size);
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.existingImagePath = null;
    if (this.imageInput) {
      this.imageInput.nativeElement.value = '';
    }
  }

  saveCity(): void {
    this.submitted = true;

    if (this.cityForm.invalid) {
      console.log('❌ [CityAddEdit] Form is invalid:', this.cityForm.errors);
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;

    const formValues = this.cityForm.value;
    console.log('📋 [CityAddEdit] Form values:', formValues);

    if (this.isEditMode && this.cityId) {
      const updateRequest: CityUpdateRequest = {
        id: this.cityId,
        name: formValues.name,
        description: formValues.description || '',
        countryId: parseInt(formValues.countryId.toString()),
        region: formValues.region || null,
        population: formValues.population || null,
        studentPopulation: formValues.studentPopulation || null,
        hasAirport: !!formValues.hasAirport,
        hasTrainStation: !!formValues.hasTrainStation,
        hasHighSpeedTrain: !!formValues.hasHighSpeedTrain,
        status: formValues.status,
        image: this.selectedFile || undefined,
        existingImagePath: this.existingImagePath || undefined
      };

      console.log('✏️ [CityAddEdit] Update request:', updateRequest);

      this.cityService.update(this.cityId, updateRequest).subscribe({
        next: (result) => {
          console.log('✅ [CityAddEdit] City updated successfully:', result);
          this.router.navigate(['/admin/cities']);
        },
        error: (error) => {
          console.error('❌ [CityAddEdit] Error updating city:', error);
          this.submitting = false;
        }
      });
    } else {
      const createRequest: CityCreateRequest = {
        name: formValues.name,
        description: formValues.description || '',
        countryId: parseInt(formValues.countryId.toString()),
        region: formValues.region || null,
        population: formValues.population || null,
        studentPopulation: formValues.studentPopulation || null,
        hasAirport: !!formValues.hasAirport,
        hasTrainStation: !!formValues.hasTrainStation,
        hasHighSpeedTrain: !!formValues.hasHighSpeedTrain,
        status: formValues.status,
        image: this.selectedFile || undefined
      };

      console.log('➕ [CityAddEdit] Create request:', createRequest);

      this.cityService.create(createRequest).subscribe({
        next: (result) => {
          console.log('✅ [CityAddEdit] City created successfully:', result);
          this.router.navigate(['/admin/cities']);
        },
        error: (error) => {
          console.error('❌ [CityAddEdit] Error creating city:', error);
          this.submitting = false;
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cityForm.controls).forEach(key => {
      const control = this.cityForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/cities']);
  }

  getRegionOptions() {
    return Object.keys(RegionType)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        value: RegionType[key as keyof typeof RegionType],
        label: this.getRegionName(RegionType[key as keyof typeof RegionType])
      }));
  }

  getRegionName(region: RegionType): string {
    switch (region) {
      case RegionType.Marmara: return 'Marmara';
      case RegionType.Aegean: return 'Ege';
      case RegionType.Mediterranean: return 'Akdeniz';
      case RegionType.CentralAnatolia: return 'İç Anadolu';
      case RegionType.BlackSea: return 'Karadeniz';
      case RegionType.EasternAnatolia: return 'Doğu Anadolu';
      case RegionType.SoutheasternAnatolia: return 'Güneydoğu Anadolu';
      default: return 'Bilinmiyor';
    }
  }
}