export class ContentFormatterUtil {
  static formatContent(content: string): string {
    if (!content) return '';
    
    // Basic formatting - convert line breaks to <br> tags
    let formatted = content.replace(/\n/g, '<br>');
    
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formatted = formatted.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
    
    return formatted;
  }

  static stripHtml(content: string): string {
    if (!content) return '';
    return content.replace(/<[^>]*>/g, '');
  }
}