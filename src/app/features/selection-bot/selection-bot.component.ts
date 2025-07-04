import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeUntil, finalize, catchError } from 'rxjs/operators';
import { Subject, forkJoin, of } from 'rxjs';
import { 
  University, 
  Department, 
  Faculty, 
  City, 
  Program,
  SelectionResult,
  SelectionFilterRequest,
  EducationType,
  ScoreType,
  ScholarshipType,
  ProgramQuota,
  ProgramRanking,
  RegionType,
  UniversityType,
  getEducationTypeName,
  getScoreTypeName,
  getScholarshipTypeName,
  getUniversityTypeName
} from '../../core/models';
import { 
  SelectionService,
  UniversityService,
  DepartmentService,
  FacultyService,
  CityService,
  ProgramService
} from '../../core/services';

@Component({
  selector: 'app-selection-bot',
  templateUrl: './selection-bot.component.html',
  styleUrls: ['./selection-bot.component.scss']
})
export class SelectionBotComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Loading states
  isLoading = false;
  isInitialLoading = true;
  isSearching = false;
  
  // Error handling
  errorMessage = '';
  
  // Breadcrumb items
  breadcrumbItems = [
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Tercih Robotu', path: null }
  ];
  
  // Data arrays
  allUniversities: University[] = [];
  allDepartments: Department[] = [];
  allFaculties: Faculty[] = [];
  allCities: City[] = [];
  allPrograms: Program[] = [];
  searchResults: SelectionResult[] = [];
  
  // Filter form controls
  cityFilter = new FormControl('');
  universityTypeFilter = new FormControl('');
  tuitionTypeFilter = new FormControl('');
  educationTypeFilter = new FormControl('');
  scoreTypeFilter = new FormControl('');
  universityFilter = new FormControl('');
  facultyFilter = new FormControl('');
  programFilter = new FormControl('');
  yearFilter = new FormControl('');
  quotaFilter = new FormControl('');
  occupancyFilter = new FormControl('');
  placedFilter = new FormControl('');
  rankingFilter = new FormControl('');
  minScoreFilter = new FormControl('');
  maxScoreFilter = new FormControl('');
  
  // Unique values for filters
  uniqueCities: string[] = [];
  uniqueUniversityTypes: string[] = [];
  uniqueTuitionTypes: string[] = [];
  uniqueEducationTypes: string[] = [];
  uniqueScoreTypes: string[] = [];
  uniqueUniversities: string[] = [];
  uniqueFaculties: string[] = [];
  uniqueYears: number[] = [];
  
  // Display settings
  resultsSorting = 'score_desc';
  programResultsView = 'table';
  currentProgramPage = 1;
  itemsPerPage = 20;
  
  // Comparison
  selectedProgramsForComparison: SelectionResult[] = [];
  maxProgramComparisonItems = 4;
  
  // Modals
  showProgramDetailModal = false;
  showProgramCompareModal = false;
  selectedProgram: SelectionResult | null = null;
  selectedProgramDetails: any = null;
  
  // Enums for template
  EducationType = EducationType;
  ScoreType = ScoreType;
  ScholarshipType = ScholarshipType;
  UniversityType = UniversityType;
  RegionType = RegionType;
  
  @ViewChild('resultsSection') resultsSection!: ElementRef;
  
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private route: ActivatedRoute,
    private selectionService: SelectionService,
    private universityService: UniversityService,
    private departmentService: DepartmentService,
    private facultyService: FacultyService,
    private cityService: CityService,
    private programService: ProgramService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Tercih Robotu - Üniversite ve Program Bul');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Tercih robotumuzu kullanarak puanınıza ve tercihlerinize uygun üniversite ve programları bulun.' 
    });
    
    this.loadInitialData();
    this.setupFilters();
    
    // URL parametrelerini kontrol et
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params.programCode) {
        this.searchByProgramCode(params.programCode);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData() {
    this.isInitialLoading = true;
    this.errorMessage = '';
    
    forkJoin({
      universities: this.universityService.getAll().pipe(catchError(() => of([]))),
      departments: this.departmentService.getAllDepartments().pipe(catchError(() => of([]))),
      faculties: this.facultyService.getAll().pipe(catchError(() => of({ data: [] }))),
      cities: this.cityService.getAll().pipe(catchError(() => of([]))),
      programs: this.programService.getAll().pipe(catchError(() => of([])))
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isInitialLoading = false)
    ).subscribe({
      next: (data) => {
        this.allUniversities = data.universities;
        this.allDepartments = data.departments;
        this.allFaculties = data.faculties.data || [];
        this.allCities = data.cities;
        this.allPrograms = data.programs;
        
        this.loadUniqueValues();
        this.performInitialSearch();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Veriler yüklenirken hata oluştu';
        console.error('Initial data loading error:', error);
      }
    });
  }

  private performInitialSearch() {
    // Perform a default search to show some results
    const defaultFilter: SelectionFilterRequest = {
      scoreType: ScoreType.SAY,
      score: 0,
      year: new Date().getFullYear()
    };
    
    this.searchPrograms(defaultFilter);
  }

  private searchByProgramCode(programCode: string) {
    const filter: SelectionFilterRequest = {
      scoreType: ScoreType.SAY,
      score: 0,
      year: new Date().getFullYear(),
      programName: programCode
    };
    
    this.searchPrograms(filter);
  }

  private searchPrograms(filter: SelectionFilterRequest) {
    this.isSearching = true;
    this.errorMessage = '';
    
    this.selectionService.searchPrograms(filter).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isSearching = false)
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.updateUniqueValuesFromResults();
        this.currentProgramPage = 1;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Arama sırasında hata oluştu';
        this.searchResults = [];
        console.error('Search error:', error);
      }
    });
  }

  private setupFilters() {
    // Filter change listeners with debounce
    const filterControls = [
      this.cityFilter,
      this.universityTypeFilter,
      this.tuitionTypeFilter,
      this.educationTypeFilter,
      this.scoreTypeFilter,
      this.universityFilter,
      this.facultyFilter,
      this.programFilter,
      this.yearFilter,
      this.quotaFilter,
      this.occupancyFilter,
      this.placedFilter,
      this.rankingFilter,
      this.minScoreFilter,
      this.maxScoreFilter
    ];

    filterControls.forEach(control => {
      control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe(() => this.applyFilters());
    });
  }

  private applyFilters() {
    const filter: SelectionFilterRequest = {
      scoreType: this.scoreTypeFilter.value ? this.getScoreTypeByName(this.scoreTypeFilter.value) : ScoreType.SAY,
      score: 0,
      year: this.yearFilter.value ? Number(this.yearFilter.value) : new Date().getFullYear(),
      programName: this.programFilter.value || undefined,
      cityIds: this.cityFilter.value ? [this.getCityIdByName(this.cityFilter.value)].filter(id => id > 0) : undefined,
      universityTypes: this.universityTypeFilter.value ? [this.getUniversityTypeByName(this.universityTypeFilter.value)] : undefined,
      scholarshipTypes: this.tuitionTypeFilter.value ? [this.getScholarshipTypeByName(this.tuitionTypeFilter.value)] : undefined,
      educationTypes: this.educationTypeFilter.value ? [this.getEducationTypeByName(this.educationTypeFilter.value)] : undefined,
      universityIds: this.universityFilter.value ? [this.getUniversityIdByName(this.universityFilter.value)].filter(id => id > 0) : undefined,
      facultyIds: this.facultyFilter.value ? [this.getFacultyIdByName(this.facultyFilter.value)].filter(id => id > 0) : undefined,
      minQuota: this.quotaFilter.value ? Number(this.quotaFilter.value) : undefined,
      minScore: this.minScoreFilter.value ? Number(this.minScoreFilter.value) : undefined,
      maxScore: this.maxScoreFilter.value ? Number(this.maxScoreFilter.value) : undefined,
      minRanking: this.rankingFilter.value ? Number(this.rankingFilter.value) : undefined
    };

    this.searchPrograms(filter);
  }

  private loadUniqueValues() {
    // Extract unique values from loaded data
    this.uniqueCities = [...new Set(this.allCities.map(c => c.name))].sort();
    this.uniqueUniversityTypes = [
      getUniversityTypeName(UniversityType.State),
      getUniversityTypeName(UniversityType.Foundation),
      getUniversityTypeName(UniversityType.Private),
      getUniversityTypeName(UniversityType.KKTC)
    ];
    
    this.uniqueEducationTypes = [
      getEducationTypeName(EducationType.FormalEducation),
      getEducationTypeName(EducationType.EveningEducation),
      getEducationTypeName(EducationType.DistanceEducation)
    ];
      
    this.uniqueScoreTypes = [
      getScoreTypeName(ScoreType.SAY),
      getScoreTypeName(ScoreType.SOZ),
      getScoreTypeName(ScoreType.EA),
      getScoreTypeName(ScoreType.DIL),
      getScoreTypeName(ScoreType.TYT)
    ];
      
    this.uniqueTuitionTypes = [
      getScholarshipTypeName(ScholarshipType.None),
      getScholarshipTypeName(ScholarshipType.Full),
      getScholarshipTypeName(ScholarshipType.Percent75),
      getScholarshipTypeName(ScholarshipType.Percent50),
      getScholarshipTypeName(ScholarshipType.Percent25)
    ];
      
    this.uniqueUniversities = [...new Set(this.allUniversities.map(u => u.name))].sort();
    this.uniqueFaculties = [...new Set(this.allFaculties.map(f => f.name))].sort();
    
    // Generate years (current year and 4 previous years)
    const currentYear = new Date().getFullYear();
    this.uniqueYears = Array.from({length: 5}, (_, i) => currentYear - i);
  }

  private updateUniqueValuesFromResults() {
    if (this.searchResults.length > 0) {
      // Update unique values based on search results
      this.uniqueCities = [...new Set(this.searchResults.map(r => r.cityName))].sort();
      this.uniqueUniversities = [...new Set(this.searchResults.map(r => r.universityName))].sort();
      this.uniqueFaculties = [...new Set(this.searchResults.map(r => r.facultyName))].sort();
      this.uniqueYears = [...new Set(this.searchResults.map(r => r.year))].sort((a, b) => b - a);
    }
  }

  // Filter program results locally
  filterPrograms(): SelectionResult[] {
    return this.searchResults.filter(program => {
      // Apply local filters
      if (this.cityFilter.value && program.cityName !== this.cityFilter.value) {
        return false;
      }
      
      if (this.universityTypeFilter.value && !this.matchesUniversityType(program)) {
        return false;
      }
      
      if (this.tuitionTypeFilter.value && program.scholarshipTypeName !== this.tuitionTypeFilter.value) {
        return false;
      }
      
      if (this.educationTypeFilter.value && program.educationTypeName !== this.educationTypeFilter.value) {
        return false;
      }
      
      if (this.scoreTypeFilter.value && !this.matchesScoreType(program)) {
        return false;
      }
      
      if (this.universityFilter.value && program.universityName !== this.universityFilter.value) {
        return false;
      }
      
      if (this.facultyFilter.value && program.facultyName !== this.facultyFilter.value) {
        return false;
      }
      
      if (this.programFilter.value && !program.programName.toLowerCase().includes(this.programFilter.value.toLowerCase())) {
        return false;
      }
      
      if (this.yearFilter.value && program.year !== Number(this.yearFilter.value)) {
        return false;
      }
      
      if (this.quotaFilter.value && program.quota !== Number(this.quotaFilter.value)) {
        return false;
      }
      
      if (this.occupancyFilter.value && (program.filledRate || 0) !== Number(this.occupancyFilter.value)) {
        return false;
      }
      
      if (this.placedFilter.value && (program.enrolled || 0) !== Number(this.placedFilter.value)) {
        return false;
      }
      
      if (this.rankingFilter.value && (program.minRanking || 0) !== Number(this.rankingFilter.value)) {
        return false;
      }
      
      if (this.minScoreFilter.value && (program.minScore || 0) < Number(this.minScoreFilter.value)) {
        return false;
      }
      
      if (this.maxScoreFilter.value && (program.minScore || 0) > Number(this.maxScoreFilter.value)) {
        return false;
      }
      
      return true;
    });
  }

  getSortedPrograms(): SelectionResult[] {
    let programs = this.filterPrograms();
    
    switch (this.resultsSorting) {
      case 'ranking':
        programs.sort((a, b) => (a.minRanking || 9999) - (b.minRanking || 9999));
        break;
      case 'score_desc':
        programs.sort((a, b) => (b.minScore || 0) - (a.minScore || 0));
        break;
      case 'score_asc':
        programs.sort((a, b) => (a.minScore || 0) - (b.minScore || 0));
        break;
      case 'name_asc':
        programs.sort((a, b) => a.programName.localeCompare(b.programName));
        break;
      case 'name_desc':
        programs.sort((a, b) => b.programName.localeCompare(a.programName));
        break;
    }
    
    return programs;
  }

  resetFilters() {
    this.cityFilter.setValue('');
    this.universityTypeFilter.setValue('');
    this.tuitionTypeFilter.setValue('');
    this.educationTypeFilter.setValue('');
    this.scoreTypeFilter.setValue('');
    this.universityFilter.setValue('');
    this.facultyFilter.setValue('');
    this.programFilter.setValue('');
    this.yearFilter.setValue('');
    this.quotaFilter.setValue('');
    this.occupancyFilter.setValue('');
    this.placedFilter.setValue('');
    this.rankingFilter.setValue('');
    this.minScoreFilter.setValue('');
    this.maxScoreFilter.setValue('');
    this.currentProgramPage = 1;
  }

  onSortChange(event: any) {
    this.resultsSorting = event.target.value;
    this.currentProgramPage = 1;
  }

  toggleProgramResultView(view: string) {
    this.programResultsView = view;
  }

  // Program detail operations
  openProgramDetail(program: SelectionResult) {
    this.selectedProgram = program;
    this.loadProgramDetails(program.programId);
    this.showProgramDetailModal = true;
  }

  private loadProgramDetails(programId: number) {
    this.isLoading = true;
    
    forkJoin({
      program: this.programService.getById(programId).pipe(catchError(() => of(null))),
      quotas: this.programService.getProgramQuotas(programId).pipe(catchError(() => of([]))),
      rankings: this.programService.getProgramRankings(programId).pipe(catchError(() => of([])))
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.selectedProgramDetails = {
          ...data.program,
          quotas: data.quotas,
          rankings: data.rankings
        };
      },
      error: (error) => {
        console.error('Program details loading error:', error);
        this.selectedProgramDetails = null;
      }
    });
  }

  closeProgramDetail() {
    this.showProgramDetailModal = false;
    this.selectedProgram = null;
    this.selectedProgramDetails = null;
  }

  // Comparison operations
  toggleProgramCompare(program: SelectionResult) {
    const index = this.selectedProgramsForComparison.findIndex(p => p.programId === program.programId);
    
    if (index === -1) {
      if (this.selectedProgramsForComparison.length < this.maxProgramComparisonItems) {
        this.selectedProgramsForComparison.push(program);
      }
    } else {
      this.selectedProgramsForComparison.splice(index, 1);
    }
  }

  isProgramSelectedForComparison(program: SelectionResult): boolean {
    return this.selectedProgramsForComparison.some(p => p.programId === program.programId);
  }

  showProgramCompare() {
    if (this.selectedProgramsForComparison.length > 1) {
      this.showProgramCompareModal = true;
    }
  }

  closeProgramCompareModal() {
    this.showProgramCompareModal = false;
  }

  // Utility methods
  getUniversityById(id: number): University | undefined {
    return this.allUniversities.find(u => u.id === id);
  }

  getDepartmentById(id: number): Department | undefined {
    return this.allDepartments.find(d => d.id === id);
  }

  // Helper methods for type conversions
  private getCityIdByName(name: string): number {
    const city = this.allCities.find(c => c.name === name);
    return city?.id || 0;
  }

  private getUniversityIdByName(name: string): number {
    const university = this.allUniversities.find(u => u.name === name);
    return university?.id || 0;
  }

  private getFacultyIdByName(name: string): number {
    const faculty = this.allFaculties.find(f => f.name === name);
    return faculty?.id || 0;
  }

  private getUniversityTypeByName(name: string): UniversityType {
    switch (name) {
      case 'Devlet': return UniversityType.State;
      case 'Vakıf': return UniversityType.Foundation;
      case 'Özel': return UniversityType.Private;
      case 'KKTC': return UniversityType.KKTC;
      default: return UniversityType.State;
    }
  }

  private getEducationTypeByName(name: string): EducationType {
    switch (name) {
      case 'Örgün Öğretim': return EducationType.FormalEducation;
      case 'İkinci Öğretim': return EducationType.EveningEducation;
      case 'Uzaktan Öğretim': return EducationType.DistanceEducation;
      default: return EducationType.FormalEducation;
    }
  }

  private getScholarshipTypeByName(name: string): ScholarshipType {
    switch (name) {
      case 'Ücretli': return ScholarshipType.None;
      case 'Burslu': return ScholarshipType.Full;
      case '%75 İndirimli': return ScholarshipType.Percent75;
      case '%50 İndirimli': return ScholarshipType.Percent50;
      case '%25 İndirimli': return ScholarshipType.Percent25;
      default: return ScholarshipType.None;
    }
  }

  private getScoreTypeByName(name: string): ScoreType {
    switch (name) {
      case 'SAY': return ScoreType.SAY;
      case 'SÖZ': return ScoreType.SOZ;
      case 'EA': return ScoreType.EA;
      case 'DİL': return ScoreType.DIL;
      case 'TYT': return ScoreType.TYT;
      default: return ScoreType.SAY;
    }
  }

  private matchesUniversityType(program: SelectionResult): boolean {
    const university = this.getUniversityById(this.getUniversityIdByProgramResult(program));
    if (!university) return false;
    
    const selectedTypeName = this.universityTypeFilter.value;
    const universityTypeName = getUniversityTypeName(university.type);
    return universityTypeName === selectedTypeName;
  }

  private matchesScoreType(program: SelectionResult): boolean {
    const selectedScoreTypeName = this.scoreTypeFilter.value;
    return getScoreTypeName(program.scoreType) === selectedScoreTypeName;
  }

  getUniversityIdByProgramResult(program: SelectionResult): number {
    const university = this.allUniversities.find(u => u.name === program.universityName);
    return university?.id || 0;
  }

  // Trend analysis (if historical data is available)
  hasProgramTrendData(program: SelectionResult): boolean {
    return program.trend !== undefined && program.trend !== null;
  }

  isProgramScoreIncreasing(program: SelectionResult): boolean {
    return program.trend === 'up';
  }

  getProgramScoreDifference(program: SelectionResult): number {
    // This would need to be implemented based on your backend data structure
    return 0;
  }

  // Export and share operations
  exportResults(format: string) {
    console.log(`Exporting results as ${format}`);
    // Implement export functionality
  }

  shareResults() {
    const url = `${window.location.origin}${window.location.pathname}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Tercih Robotu Sonuçları',
        text: 'Tercih robotundan bulduğum programlara göz atın!',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Paylaşım linki panoya kopyalandı!');
      });
    }
  }

  // Getter for template access
  get isAnyLoading(): boolean {
    return this.isInitialLoading || this.isLoading || this.isSearching;
  }
}