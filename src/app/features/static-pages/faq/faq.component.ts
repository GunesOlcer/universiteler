// src/app/features/static-pages/faq/faq.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['../static-pages-shared.scss', './faq.component.scss']
})
export class FaqComponent implements OnInit {
  // FAQ kategorileri ve soruları
  faqCategories = [
    {
      title: 'Öğrenciler için Sorular',
      questions: [
        {
          question: 'üniversiteler.net nasıl çalışır?',
          answer: 'üniversiteler.net, Türkiye ve Kuzey Kıbrıs\'taki üniversiteleri tanıtan ve öğrencilere kapsamlı bilgiler sunan bir platformdur. Üniversitelerin akademik programları, kampüs olanakları, öğrenci yaşamı ve sosyal aktiviteler hakkında detaylı bilgi sağlar.'
        },
        {
          question: 'Platform üzerinden nasıl üniversite bulabilirim?',
          answer: 'Platformda yer alan akıllı filtreleme ve gelişmiş arama özelliklerini kullanarak ilgi alanlarınıza, tercih ettiğiniz şehir veya bölüme göre üniversiteleri arayabilirsiniz. Tercih robotu ile de size en uygun üniversite önerilerini alabilirsiniz.'
        }
      ]
    },
    {
      title: 'Veliler için Sorular',
      questions: [
        {
          question: 'üniversiteler.net nedir?',
          answer: 'üniversiteler.net, Türkiye ve Kuzey Kıbrıs\'taki üniversiteler, yükseköğretim programları, yurtlar ve şehirler hakkında detaylı bilgi sunan bir platformdur. Üniversite adaylarına ve ailelerine rehberlik etmeyi amaçlayan site, çeşitli karşılaştırmalar ve özel içerikler ile tercih sürecini kolaylaştırır.'
        },
        {
          question: 'üniversiteler.net güvenli midir?',
          answer: 'üniversiteler.net, üniversiteler tarafından sağlanan güncel ve doğru bilgileri sunar. Platform, kullanıcıların güvenle bilgi almasını sağlamak için sürekli olarak veri güncellemeleri ve doğrulamalar yapar.'
        },
        {
          question: 'üniversiteler.net hangi hizmetleri sunuyor?',
          answer: 'üniversiteler.net, üniversiteler hakkında kapsamlı bilgi sunmanın yanı sıra tercih robotu, yurt bilgileri, kampüs tanıtımları, burs imkanları, ve yükseköğretim programları hakkında detaylı içerikler gibi ek hizmetler sağlar. Bu hizmetler, tercih sürecini daha kolay ve bilinçli hale getirir.'
        }
      ]
    }
  ];

  // Açık olan soru
  expandedQuestions: { [key: string]: boolean } = {};

  constructor() {}

  ngOnInit(): void {
    // Sayfa başlığını güncelle
    document.title = 'Sıkça Sorulan Sorular | Üniversite Rehberi';
    
    // İlk başta tüm soruları kapat
    this.faqCategories.forEach(category => {
      category.questions.forEach((q, index) => {
        this.expandedQuestions[`${category.title}-${index}`] = false;
      });
    });
  }

  // Soruyu açıp kapatma fonksiyonu
  toggleQuestion(categoryTitle: string, questionIndex: number): void {
    const key = `${categoryTitle}-${questionIndex}`;
    this.expandedQuestions[key] = !this.expandedQuestions[key];
  }

  // Sorunun açık olup olmadığını kontrol etme fonksiyonu
  isQuestionExpanded(categoryTitle: string, questionIndex: number): boolean {
    const key = `${categoryTitle}-${questionIndex}`;
    return this.expandedQuestions[key];
  }
}