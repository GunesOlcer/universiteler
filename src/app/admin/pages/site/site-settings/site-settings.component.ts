// src/app/admin/pages/site/site-settings/site-settings.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiteService } from '../../../services/site.service';

@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss']
})
export class SiteSettingsComponent implements OnInit {
  siteSettings: any = {};
  allowedIps: string[] = [];
  
  siteStatusForm: FormGroup;
  ipForm: FormGroup;
  
  showConfirmDialog = false;
  ipToDelete: string | null = null;
  
  isSaving = false;
  settingsSaved = false;
  ipAdded = false;

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService
  ) {
    this.siteStatusForm = this.createSiteStatusForm();
    this.ipForm = this.createIpForm();
  }

  ngOnInit(): void {
    this.loadSiteSettings();
  }

  createSiteStatusForm(): FormGroup {
    return this.fb.group({
      siteStatus: ['open', Validators.required]
    });
  }

  createIpForm(): FormGroup {
    return this.fb.group({
      ipAddress: ['', [Validators.required, Validators.pattern('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')]]
    });
  }

  loadSiteSettings(): void {
    this.siteService.getSiteSettings().subscribe(
      (data: any) => {
        this.siteSettings = data;
        this.allowedIps = data.allowedIps || [];
        
        this.siteStatusForm.patchValue({
          siteStatus: data.siteStatus
        });
      },
      (error) => {
        console.error('Error loading site settings:', error);
      }
    );
  }

  // Site Status Form
  saveSiteStatus(): void {
    if (this.siteStatusForm.invalid) {
      return;
    }
    
    this.isSaving = true;
    
    const data = {
      siteStatus: this.siteStatusForm.value.siteStatus
    };
    
    this.siteService.updateSiteSettings(data).subscribe(
      () => {
        this.isSaving = false;
        this.settingsSaved = true;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.settingsSaved = false;
        }, 3000);
      },
      (error) => {
        console.error('Error updating site settings:', error);
        this.isSaving = false;
      }
    );
  }

  // IP Form
  addIpAddress(): void {
    if (this.ipForm.invalid) {
      return;
    }
    
    const ip = this.ipForm.value.ipAddress;
    
    // Check if IP already exists
    if (this.allowedIps.includes(ip)) {
      // Set error on IP field
      this.ipForm.get('ipAddress')?.setErrors({ duplicate: true });
      return;
    }
    
    this.siteService.addAllowedIp(ip).subscribe(
      () => {
        this.allowedIps.push(ip);
        this.ipForm.reset();
        this.ipAdded = true;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.ipAdded = false;
        }, 3000);
      },
      (error) => {
        console.error('Error adding allowed IP:', error);
      }
    );
  }

  // Delete IP Methods
  confirmDeleteIp(ip: string): void {
    this.ipToDelete = ip;
    this.showConfirmDialog = true;
  }

  deleteIp(): void {
    if (this.ipToDelete) {
      this.siteService.removeAllowedIp(this.ipToDelete).subscribe(
        () => {
          this.allowedIps = this.allowedIps.filter(ip => ip !== this.ipToDelete);
          this.showConfirmDialog = false;
          this.ipToDelete = null;
        },
        (error) => {
          console.error('Error deleting IP:', error);
          this.showConfirmDialog = false;
          this.ipToDelete = null;
        }
      );
    }
  }

  cancelDeleteIp(): void {
    this.showConfirmDialog = false;
    this.ipToDelete = null;
  }
}