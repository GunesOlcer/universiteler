import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface BreadcrumbItem {
  label: string;
  url?: string;
  active: boolean;
}

interface CountryCode {
  name: string;
  nativeName: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isLoading = false;
  formSubmitted = false;
  formSuccess = false;
  formError = false;
  
  // Breadcrumb için gerekli veri
  breadcrumbPath: BreadcrumbItem[] = [];
  
  // Ülke kodları dropdown için
  showCountryDropdown = false;
  countryCodes: CountryCode[] = [
    { name: 'Turkey', nativeName: 'Türkiye', code: '+90', flag: '🇹🇷' },
    { name: 'United Kingdom', nativeName: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Germany', nativeName: 'Deutschland', code: '+49', flag: '🇩🇪' },
    { name: 'Russia', nativeName: 'Россия', code: '+7', flag: '🇷🇺' },
    { name: 'Afghanistan', nativeName: 'افغانستان', code: '+93', flag: '🇦🇫' },
    { name: 'United States', nativeName: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'France', nativeName: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'Italy', nativeName: 'Italia', code: '+39', flag: '🇮🇹' },
    { name: 'Spain', nativeName: 'España', code: '+34', flag: '🇪🇸' },
    { name: 'Netherlands', nativeName: 'Nederland', code: '+31', flag: '🇳🇱' },
  ];
  selectedCountry: CountryCode = this.countryCodes[0]; // Default to Turkey
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    // Form oluştur
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]]
    });
    
    // Sayfa başlığını güncelleyelim
    this.updatePageMetadata();
    
    // Breadcrumb yolunu ayarla
    this.breadcrumbPath = [
      {label: 'Ana Sayfa', url: '/', active: false},
      {label: 'İletişim', url: '/iletisim', active: true}
    ];
  }
  
  private updatePageMetadata(): void {
    document.title = 'İletişim | Üniversite Rehberi';
  }
  
  toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
  }
  
  selectCountry(country: CountryCode): void {
    this.selectedCountry = country;
    this.showCountryDropdown = false;
  }
  
  closeCountryDropdown(): void {
    this.showCountryDropdown = false;
  }

  // Telefon numarasını formatlayan fonksiyon (güncellendi)
  formatPhoneNumber(event: any): void {
    const input = event.target;
    // İmleç pozisyonunu kaydet
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const previousValue = input.value;
    
    // Sayılar dışındaki karakterleri kaldır
    let value = input.value.replace(/\D/g, '');
    
    // Maksimum 10 sayı ile sınırla
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    // Formatlama: 555 555 55 55
    let formattedValue = '';
    
    if (value.length > 0) {
      formattedValue += value.substring(0, Math.min(3, value.length));
    }
    
    if (value.length > 3) {
      formattedValue += ' ' + value.substring(3, Math.min(6, value.length));
    }
    
    if (value.length > 6) {
      formattedValue += ' ' + value.substring(6, Math.min(8, value.length));
    }
    
    if (value.length > 8) {
      formattedValue += ' ' + value.substring(8, 10);
    }
    
    // Değeri formatlanmış olarak güncelle
    input.value = formattedValue;
    
    // Form değerini sadece rakamlarla güncelle (validation için)
    this.contactForm.get('phone').setValue(value, { emitEvent: false });
    
    // İmleç pozisyonunu hesapla ve ayarla
    if (formattedValue !== previousValue) {
      // Eski değerde kaç boşluk vardı
      const oldSpaces = (previousValue.substring(0, start).match(/ /g) || []).length;
      
      // Yeni değerde kaç boşluk var
      const newSpaces = (formattedValue.substring(0, start).match(/ /g) || []).length;
      
      // Boşluk farkına göre imleç pozisyonunu ayarla
      const newPosition = start + (newSpaces - oldSpaces);
      
      // İmleç pozisyonunu ayarla
      setTimeout(() => {
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  }
  
  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.contactForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    // Formdan ve ülke kodundan telefon numarasını oluştur
    const formData = {
      ...this.contactForm.value,
      phone: this.contactForm.value.phone ? 
        `${this.selectedCountry.code} ${this.contactForm.value.phone}` : 
        ''
    };
    
    // API çağrısı simülasyonu
    setTimeout(() => {
      this.isLoading = false;
      this.formSuccess = true;
      
      console.log('Form data gönderildi:', formData);
      
      // Form verilerini sıfırla
      this.contactForm.reset();
      this.formSubmitted = false;
      
      // Başarı mesajını 5 saniye sonra kaldır
      setTimeout(() => {
        this.formSuccess = false;
      }, 5000);
    }, 1500);
  }
  
  // Form kontrolleri için yardımcı getter
  get f() { return this.contactForm.controls; }
}