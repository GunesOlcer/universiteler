import { Component, Input } from '@angular/core';
import { Article, ArticleCategory, getCategoryName, getCategoryKey } from '../../../core/models/article.model';
import { ArticleService } from '../../../core/services/article.service';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: Article;

  constructor(private articleService: ArticleService) {}

  getImageUrl(): string {
    return this.articleService.getImageUrl(this.article.imagePath);
  }

  getCategoryName(): string {
    return getCategoryName(this.article.category);
  }

  getCategoryClass(): string {
    return getCategoryKey(this.article.category);
  }
}