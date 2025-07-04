import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ContentFormatterService {

  constructor(private sanitizer: DomSanitizer) {}

  formatContent(content: string): SafeHtml {
    if (!content) return '';
    
    let formatted = content;
    
    // Convert line breaks to HTML
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    if (!formatted.startsWith('<p>')) {
      formatted = '<p>' + formatted + '</p>';
    }
    
    // Format headers
    formatted = formatted.replace(/#{3}\s*(.*)/g, '<h3>$1</h3>');
    formatted = formatted.replace(/#{2}\s*(.*)/g, '<h2>$1</h2>');
    formatted = formatted.replace(/#{1}\s*(.*)/g, '<h1>$1</h1>');
    
    // Format bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Format italic text
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Format lists
    formatted = formatted.replace(/^[-•*]\s(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}