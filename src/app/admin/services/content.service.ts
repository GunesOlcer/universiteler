// src/app/admin/services/content.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = `${environment.apiUrl}/content`;

  constructor(private http: HttpClient) { }

  // Mock haberler için
  private mockNews = [
    { 
      id: 1, 
      title: 'Üniversiteler için Kayıt Tarihleri Açıklandı', 
      slug: 'universiteler-icin-kayit-tarihleri-aciklandi',
      subtitle: 'YÖK 2023-2024 akademik yılı kayıt tarihlerini duyurdu',
      content: '<p>YÖK tarafından yapılan duyuruya göre, üniversite kayıtları 5-10 Eylül tarihleri arasında yapılacak. Öğrencilerin e-devlet üzerinden veya üniversitelere bizzat giderek kayıt yaptırabilecekleri belirtildi.</p><p>Elektronik kayıt yaptırmak isteyen öğrencilerin e-devlet şifresi edinmeleri gerekiyor. Kayıt için gerekli belgeler üniversitelerin web sitelerinde yayınlanacak.</p>',
      coverImageUrl: 'assets/images/content/news/news1.jpg',
      isActive: true,
      isImportant: true,
      type: 'news',
      createdAt: new Date('2023-08-15')
    },
    { 
      id: 2, 
      title: 'YÖK\'ten Yeni Burslar', 
      slug: 'yokten-yeni-burslar',
      subtitle: 'Lisansüstü öğrencilere yönelik burslar artırıldı',
      content: '<p>YÖK, lisansüstü öğrencilere yönelik burs miktarlarını artırdığını açıkladı. Yeni düzenlemeye göre yüksek lisans öğrencilerine aylık 3000 TL, doktora öğrencilerine ise 4500 TL burs verilecek.</p><p>Burs başvuruları 1-15 Eylül tarihleri arasında YÖK\'ün resmi web sitesi üzerinden yapılabilecek. Başvuru sonuçları Ekim ayı içerisinde açıklanacak.</p>',
      coverImageUrl: 'assets/images/content/news/news2.jpg',
      isActive: true,
      isImportant: false,
      type: 'news',
      createdAt: new Date('2023-08-10')
    },
    { 
      id: 3, 
      title: 'Üniversiteler Arası Spor Şenliği', 
      slug: 'universiteler-arasi-spor-senligi',
      subtitle: 'İstanbul\'daki üniversiteler arası spor şenliği başlıyor',
      content: '<p>İstanbul\'daki üniversiteler arasında düzenlenen geleneksel spor şenliği, bu yıl 20-30 Ekim tarihleri arasında gerçekleştirilecek. Futbol, basketbol, voleybol, tenis ve atletizm branşlarında yarışmaların düzenleneceği etkinliğe tüm üniversite öğrencileri katılabilecek.</p><p>Etkinliğe katılmak isteyen öğrenciler, üniversitelerinin spor koordinatörlüklerine başvurabilirler. Yarışmalarda dereceye giren öğrencilere çeşitli ödüller verilecek.</p>',
      coverImageUrl: 'assets/images/content/news/news3.jpg',
      isActive: true,
      isImportant: false,
      type: 'news',
      createdAt: new Date('2023-08-05')
    },
    { 
      id: 4, 
      title: 'Duyuru: Web Sitesi Bakımı', 
      slug: 'duyuru-web-sitesi-bakimi',
      subtitle: 'Site bakım çalışması yapılacaktır',
      content: '<p>Değerli kullanıcılarımız, 15 Ağustos Salı günü saat 02:00-05:00 arasında web sitemizde planlı bakım çalışması yapılacaktır. Bu saatler arasında sitemize erişim kısıtlı olabilir veya kesintiler yaşanabilir.</p><p>Anlayışınız için teşekkür ederiz.</p>',
      coverImageUrl: 'assets/images/content/news/news4.jpg',
      isActive: true,
      isImportant: true,
      type: 'announcement',
      createdAt: new Date('2023-08-13')
    },
    { 
      id: 5, 
      title: 'Duyuru: Yurt Başvuruları', 
      slug: 'duyuru-yurt-basvurulari',
      subtitle: 'Yurt başvuruları başlamıştır',
      content: '<p>Değerli öğrenciler, 2023-2024 akademik yılı için yurt başvuruları başlamıştır. Başvurular 20 Ağustos\'a kadar devam edecektir.</p><p>Başvuruları web sitemizin "Yurt Başvurusu" bölümünden yapabilirsiniz.</p>',
      coverImageUrl: 'assets/images/content/news/news5.jpg',
      isActive: false,
      isImportant: false,
      type: 'announcement',
      createdAt: new Date('2023-08-01')
    }
  ];

  // Mock makaleler için
  private mockArticles = [
    { 
      id: 1, 
      title: 'Üniversite Tercihinde Dikkat Edilmesi Gerekenler', 
      slug: 'universite-tercihinde-dikkat-edilmesi-gerekenler',
      subtitle: 'Doğru üniversite tercihi için püf noktaları',
      content: '<p>Üniversite tercihi, bir öğrencinin geleceğini şekillendiren en önemli kararlardan biridir. Bu makalede, doğru üniversite tercihi yaparken dikkat edilmesi gereken noktaları ele alacağız.</p><p>İlk olarak, ilgi alanlarınızı ve yeteneklerinizi değerlendirmelisiniz. Sevdiğiniz ve başarılı olduğunuz alanlarda eğitim almak, üniversite hayatınızı daha verimli geçirmenizi sağlar. İkinci olarak, üniversitenin akademik itibarını araştırmalısınız. Üniversitenin akreditasyonları, öğretim üyelerinin kalitesi ve mezunlarının iş bulma oranları bu konuda size fikir verebilir.</p><p>Üçüncü olarak, üniversitenin sunduğu imkanları değerlendirmelisiniz. Laboratuvarlar, kütüphaneler, spor tesisleri, öğrenci kulüpleri gibi faktörler üniversite hayatınızı zenginleştirir. Son olarak, üniversitenin bulunduğu şehri ve yaşam maliyetlerini göz önünde bulundurmalısınız. Eğitim sürecinizde rahat edebileceğiniz bir şehir ve bütçenize uygun bir yaşam maliyeti tercih etmeniz önemlidir.</p>',
      coverImageUrl: 'assets/images/content/articles/article1.jpg',
      isActive: true,
      isImportant: true,
      publishAt: new Date('2023-08-15T10:00:00'),
      createdAt: new Date('2023-08-10')
    },
    { 
      id: 2, 
      title: 'Yurt Yaşamına Uyum Sağlama Rehberi', 
      slug: 'yurt-yasamina-uyum-saglama-rehberi',
      subtitle: 'Yurt hayatına alışmanın yolları',
      content: '<p>Üniversiteye başlamanın en zorlu yanlarından biri, ailenizden uzakta, yurt yaşamına uyum sağlamaktır. Bu makalede, yurt yaşamına kolay adapte olmanın yollarını ele alacağız.</p><p>İlk olarak, yurda yerleşmeden önce ihtiyaç duyacağınız temel eşyaların bir listesini yapmalısınız. Nevresim takımı, banyo eşyaları, ders çalışma malzemeleri gibi temel ihtiyaçları önceden temin etmek, yerleşim sürecinizi kolaylaştırır. İkinci olarak, yurt kurallarını öğrenmelisiniz. Her yurdun kendine özgü kuralları vardır ve bu kurallara uymak, hem ceza almamak hem de uyumlu bir ortam yaratmak için önemlidir.</p><p>Üçüncü olarak, oda arkadaşınızla iyi bir iletişim kurmalısınız. Beklentilerinizi ve tercihlerinizi açıkça konuşmak, olası anlaşmazlıkları önler. Son olarak, yurdunuzdaki sosyal etkinliklere katılmalısınız. Bu etkinlikler, yeni arkadaşlar edinmenize ve yurt ortamına hızla alışmanıza yardımcı olur.</p>',
      coverImageUrl: 'assets/images/content/articles/article2.jpg',
      isActive: true,
      isImportant: false,
      publishAt: new Date('2023-08-12T14:00:00'),
      createdAt: new Date('2023-08-08')
    },
    { 
      id: 3, 
      title: 'Etkili Ders Çalışma Teknikleri', 
      slug: 'etkili-ders-calisma-teknikleri',
      subtitle: 'Akademik başarıyı artırmak için yöntemler',
      content: '<p>Üniversite hayatında akademik başarı, etkili ders çalışma teknikleriyle doğrudan ilişkilidir. Bu makalede, ders çalışma verimliliğinizi artıracak yöntemleri ele alacağız.</p><p>İlk olarak, düzenli çalışma alışkanlığı edinmelisiniz. Her gün belirli saatlerde ders çalışmak, bilgilerin kalıcı olmasını sağlar. İkinci olarak, Pomodoro tekniği gibi zaman yönetimi metotlarını kullanabilirsiniz. Bu teknik, 25 dakika çalışma ve 5 dakika mola şeklinde uygulanır ve dikkat dağınıklığını önler.</p><p>Üçüncü olarak, aktif öğrenme stratejileri geliştirmelisiniz. Sadece okumak yerine, notlar almak, özet çıkarmak, sorular çözmek gibi aktif yöntemler kullanmak öğrenmeyi kolaylaştırır. Son olarak, düzenli tekrarlar yapmalısınız. Öğrenilen bilgilerin belirli aralıklarla tekrar edilmesi, unutmayı önler ve kalıcı öğrenmeyi sağlar.</p>',
      coverImageUrl: 'assets/images/content/articles/article3.jpg',
      isActive: true,
      isImportant: true,
      publishAt: new Date('2023-08-20T09:00:00'),
      createdAt: new Date('2023-08-05')
    }
  ];

  // Mock sayfalar için
  private mockPages = [
    {
      id: 1,
      title: 'Hakkımızda',
      slug: 'hakkimizda',
      subtitle: 'Üniversiteler.net hakkında',
      content: '<p>Üniversiteler.net, Türkiye\'deki tüm üniversiteler hakkında kapsamlı bilgiler sunan bir platformdur. Amacımız, üniversite tercih sürecinde öğrencilere rehberlik etmek ve doğru kararlar vermelerini sağlamaktır.</p><p>Platformumuzda, üniversitelerin akademik programları, kampüs olanakları, yurt imkanları ve şehir bilgileri gibi detaylı içerikler bulabilirsiniz. Ayrıca, uzman eğitimcilerimizin hazırladığı rehber makaleler ve öğrenci deneyimleri de sizlere yol gösterecektir.</p><p>Üniversiteler.net ekibi olarak, doğru ve güncel bilgileri sizlere sunmak için sürekli çalışıyoruz. Herhangi bir sorunuz veya öneriniz için bizimle iletişime geçebilirsiniz.</p>',
      coverImageUrl: 'assets/images/content/pages/about.jpg',
      isActive: true,
      dynamicMenuIds: [1]
    },
    {
      id: 2,
      title: 'Gizlilik Politikası',
      slug: 'gizlilik-politikasi',
      subtitle: 'Kişisel verilerin korunması',
      content: '<p>Üniversiteler.net olarak, kullanıcılarımızın gizliliğine önem veriyoruz. Bu politika, web sitemizi kullanırken toplanan, işlenen ve saklanan kişisel verilerin nasıl korunduğunu açıklamaktadır.</p><p>Sitemizi kullanarak, bu gizlilik politikasını kabul etmiş olursunuz. Eğer bu politikayı kabul etmiyorsanız, lütfen sitemizi kullanmayı bırakınız.</p><p>Topladığımız bilgiler arasında adınız, e-posta adresiniz, IP adresiniz ve tarayıcı çerezleri bulunmaktadır. Bu bilgileri, hizmetlerimizi iyileştirmek, kullanıcı deneyimini kişiselleştirmek ve yasal yükümlülüklerimizi yerine getirmek için kullanıyoruz.</p><p>Kişisel verileriniz, yalnızca sizin izninizle üçüncü taraflarla paylaşılır. Verilerinize erişim talep etme, düzeltme veya silme haklarına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.</p>',
      coverImageUrl: 'assets/images/content/pages/privacy.jpg',
      isActive: true,
      dynamicMenuIds: [1]
    },
    {
      id: 3,
      title: 'İletişim',
      slug: 'iletisim',
      subtitle: 'Bizimle iletişime geçin',
      content: '<p>Üniversiteler.net ekibi olarak, sorularınız, önerileriniz ve geri bildirimleriniz için her zaman buradayız. Aşağıdaki iletişim bilgilerimizden bize ulaşabilirsiniz.</p><p><strong>E-posta:</strong> info@universiteler.net</p><p><strong>Telefon:</strong> 0212 345 67 89</p><p><strong>Adres:</strong> Merkez Mahallesi, Atatürk Caddesi, No: 123, Beşiktaş / İstanbul</p><p>Çalışma saatlerimiz: Pazartesi - Cuma, 09:00 - 18:00</p><p>Sosyal medya hesaplarımızdan da bizi takip edebilir ve mesaj gönderebilirsiniz:</p><p>Facebook: /universitelernet<br>Twitter: @universitelernet<br>Instagram: @universitelernet</p>',
      coverImageUrl: 'assets/images/content/pages/contact.jpg',
      isActive: true,
      dynamicMenuIds: [1]
    }
  ];

  // Mock dinamik menüler için
  private mockDynamicMenus = [
    {
      id: 1,
      title: 'Ana Menü',
      adminTitle: 'Header Menü',
      items: [
        { id: 1, title: 'Ana Sayfa', linkType: 'custom', url: '/' },
        { id: 2, title: 'Üniversiteler', linkType: 'module', url: '/universiteler' },
        { id: 3, title: 'Bölümler', linkType: 'module', url: '/bolumler' },
        { id: 4, title: 'Şehirler', linkType: 'module', url: '/sehirler' },
        { id: 5, title: 'Yurtlar', linkType: 'module', url: '/yurtlar' },
        { id: 6, title: 'Hakkımızda', linkType: 'page', url: '/sayfalar/hakkimizda' },
        { id: 7, title: 'İletişim', linkType: 'page', url: '/sayfalar/iletisim' }
      ]
    },
    {
      id: 2,
      title: 'Footer Menü',
      adminTitle: 'Alt Menü',
      items: [
        { id: 8, title: 'Hakkımızda', linkType: 'page', url: '/sayfalar/hakkimizda' },
        { id: 9, title: 'Gizlilik Politikası', linkType: 'page', url: '/sayfalar/gizlilik-politikasi' },
        { id: 10, title: 'İletişim', linkType: 'page', url: '/sayfalar/iletisim' }
      ]
    }
  ];

  // Mock modül menüleri için
  private mockModuleMenus = [
    {
      id: 1,
      title: 'Üniversite Menüleri',
      adminTitle: 'Üniversite Modül Menüsü',
      slug: 'universite',
      items: [
        { id: 1, title: 'Genel Bilgiler', url: 'genel-bilgiler' },
        { id: 2, title: 'Fakülteler', url: 'fakulteler' },
        { id: 3, title: 'Bölümler', url: 'bolumler' },
        { id: 4, title: 'Yurtlar', url: 'yurtlar' },
        { id: 5, title: 'Şehir Bilgisi', url: 'sehir-bilgisi' }
      ]
    },
    {
      id: 2,
      title: 'Bölüm Menüleri',
      adminTitle: 'Bölüm Modül Menüsü',
      slug: 'bolum',
      items: [
        { id: 6, title: 'Genel Bilgiler', url: 'genel-bilgiler' },
        { id: 7, title: 'Programlar', url: 'programlar' },
        { id: 8, title: 'Puanlar', url: 'puanlar' },
        { id: 9, title: 'İş İmkanları', url: 'is-imkanlari' }
      ]
    },
    {
      id: 3,
      title: 'Şehir Menüleri',
      adminTitle: 'Şehir Modül Menüsü',
      slug: 'sehir',
      items: [
        { id: 10, title: 'Genel Bilgiler', url: 'genel-bilgiler' },
        { id: 11, title: 'Üniversiteler', url: 'universiteler' },
        { id: 12, title: 'Yurtlar', url: 'yurtlar' },
        { id: 13, title: 'Yaşam', url: 'yasam' }
      ]
    }
  ];

  // Mock yardım konuları için
  private mockHelpCategories = [
    {
      id: 1,
      name: 'Genel Sorular',
      topics: [
        {
          id: 1,
          title: 'Üniversiteler.net nedir?',
          content: '<p>Üniversiteler.net, Türkiye\'deki tüm üniversiteler hakkında kapsamlı bilgiler sunan bir platformdur. Amacımız, üniversite tercih sürecinde öğrencilere rehberlik etmek ve doğru kararlar vermelerini sağlamaktır.</p><p>Platformumuzda, üniversitelerin akademik programları, kampüs olanakları, yurt imkanları ve şehir bilgileri gibi detaylı içerikler bulabilirsiniz. Ayrıca, uzman eğitimcilerimizin hazırladığı rehber makaleler ve öğrenci deneyimleri de sizlere yol gösterecektir.</p>'
        },
        {
          id: 2,
          title: 'Üniversiteler.net\'i nasıl kullanabilirim?',
          content: '<p>Üniversiteler.net\'i kullanmak oldukça kolaydır. Ana sayfadaki arama kutusunu kullanarak üniversite, bölüm veya şehir araması yapabilirsiniz. Ayrıca, üst menüdeki kategorilerden ilgilendiğiniz alana gidebilirsiniz.</p><p>Detaylı arama yapmak için "Gelişmiş Arama" özelliğini kullanabilirsiniz. Bu özellik, özel kriterler belirleyerek arama yapmanızı sağlar. Sonuçları filtreleyebilir ve karşılaştırabilirsiniz.</p><p>Üniversite veya bölüm sayfalarında, temel bilgilerin yanı sıra yorumlar, puanlar ve diğer öğrencilerin deneyimlerini de görebilirsiniz. Bu bilgiler, karar verme sürecinizde size yardımcı olacaktır.</p>'
        }
      ]
    },
    {
      id: 2,
      name: 'Üyelik İşlemleri',
      topics: [
        {
          id: 3,
          title: 'Nasıl üye olabilirim?',
          content: '<p>Üniversiteler.net\'e üye olmak için sağ üst köşedeki "Üye Ol" butonuna tıklayın. Açılan formda, ad-soyad, e-posta adresi ve şifre bilgilerinizi girerek üyelik işlemini tamamlayabilirsiniz.</p><p>Alternatif olarak, Google veya Facebook hesaplarınızla da hızlı üyelik yapabilirsiniz. Üyelik işlemi tamamlandıktan sonra, e-posta adresinize bir onay linki gönderilecektir. Bu linke tıklayarak üyeliğinizi aktifleştirebilirsiniz.</p>'
        },
        {
          id: 4,
          title: 'Şifremi unuttum, ne yapmalıyım?',
          content: '<p>Şifrenizi unuttuysanız, giriş sayfasındaki "Şifremi Unuttum" linkine tıklayabilirsiniz. Açılan sayfada, üyelik için kullandığınız e-posta adresinizi girmeniz istenecektir.</p><p>E-posta adresinizi girdikten sonra, size bir şifre sıfırlama linki gönderilecektir. Bu linke tıklayarak yeni bir şifre belirleyebilirsiniz. İşlem tamamlandıktan sonra, yeni şifrenizle giriş yapabilirsiniz.</p><p>Eğer e-posta almadıysanız, spam veya gereksiz e-posta klasörünüzü kontrol etmeyi unutmayın. Hala sorun yaşıyorsanız, support@universiteler.net adresine e-posta göndererek yardım isteyebilirsiniz.</p>'
        }
      ]
    },
    {
      id: 3,
      name: 'Teknik Sorunlar',
      topics: [
        {
          id: 5,
          title: 'Site yavaş yükleniyor, ne yapabilirim?',
          content: '<p>Sitemizin yavaş yüklenmesi durumunda, aşağıdaki adımları deneyebilirsiniz:</p><ol><li>Tarayıcınızın önbelleğini temizleyin</li><li>Farklı bir tarayıcı kullanmayı deneyin</li><li>İnternet bağlantınızı kontrol edin</li><li>Tarayıcınızı güncelleyin</li></ol><p>Bu adımlar sorunu çözmezse, lütfen teknik destek ekibimize bildirin: support@universiteler.net</p>'
        },
        {
          id: 6,
          title: 'Sayfa görüntüleme hatası alıyorum, ne yapmalıyım?',
          content: '<p>Sayfa görüntüleme hatası alıyorsanız, aşağıdaki adımları deneyebilirsiniz:</p><ol><li>Sayfayı yenilemeyi deneyin (F5 tuşu)</li><li>Tarayıcınızın önbelleğini temizleyin</li><li>Farklı bir tarayıcı kullanmayı deneyin</li><li>Tarayıcı eklentilerinizi geçici olarak devre dışı bırakın</li></ol><p>Eğer sorun devam ederse, lütfen bize hata mesajının ekran görüntüsünü ve hangi tarayıcıyı kullandığınızı belirterek e-posta gönderin: support@universiteler.net</p>'
        }
      ]
    }
  ];

  // Haberlerle ilgili metotlar
  getNews(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/news`, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredNews = [...this.mockNews];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.title) {
        filteredNews = filteredNews.filter(n => 
          n.title.toLowerCase().includes(params.title.toLowerCase())
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredNews = filteredNews.filter(n => n.isActive === isActive);
      }
      
      if (params.type) {
        filteredNews = filteredNews.filter(n => n.type === params.type);
      }
    }
    
    // Sıralama: En yeni haberler önce
    filteredNews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Sayfalama için
    const totalItems = filteredNews.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredNews.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredNews = filteredNews.slice(start, end);
    
    return of({
      items: filteredNews,
      totalItems: totalItems
    });
  }

  getNewsItem(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/news/${id}`);
    
    // Mock veri için
    const newsItem = this.mockNews.find(n => n.id === id);
    return of(newsItem || {});
  }

  createNews(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/news`, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockNews.length + 1 });
  }

  updateNews(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/news/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteNews(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/news/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  // Makalelerle ilgili metotlar
  getArticles(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/articles`, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredArticles = [...this.mockArticles];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.title) {
        filteredArticles = filteredArticles.filter(a => 
          a.title.toLowerCase().includes(params.title.toLowerCase())
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredArticles = filteredArticles.filter(a => a.isActive === isActive);
      }
    }
    
    // Sıralama: En yeni makaleler önce
    filteredArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Sayfalama için
    const totalItems = filteredArticles.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredArticles.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredArticles = filteredArticles.slice(start, end);
    
    return of({
      items: filteredArticles,
      totalItems: totalItems
    });
  }

  getArticle(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/articles/${id}`);
    
    // Mock veri için
    const article = this.mockArticles.find(a => a.id === id);
    return of(article || {});
  }

  createArticle(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/articles`, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockArticles.length + 1 });
  }

  updateArticle(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/articles/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteArticle(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/articles/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  // Sayfalarla ilgili metotlar
  getPages(params?: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/pages`, { params });
    
    // Mock veri için - filtreleme işlemleri
    let filteredPages = [...this.mockPages];
    
    // Filtreleme işlemleri
    if (params) {
      if (params.title) {
        filteredPages = filteredPages.filter(p => 
          p.title.toLowerCase().includes(params.title.toLowerCase())
        );
      }
      
      if (params.status) {
        const isActive = params.status === 'active';
        filteredPages = filteredPages.filter(p => p.isActive === isActive);
      }
      
      if (params.dynamicMenuId) {
        filteredPages = filteredPages.filter(p => 
          p.dynamicMenuIds && p.dynamicMenuIds.includes(parseInt(params.dynamicMenuId))
        );
      }
    }
    
    // Sayfalama için
    const totalItems = filteredPages.length;
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : filteredPages.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    filteredPages = filteredPages.slice(start, end);
    
    return of({
      items: filteredPages,
      totalItems: totalItems
    });
  }

  getPage(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/pages/${id}`);
    
    // Mock veri için
    const page = this.mockPages.find(p => p.id === id);
    return of(page || {});
  }

  createPage(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/pages`, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockPages.length + 1 });
  }

  updatePage(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/pages/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deletePage(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/pages/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  // Dinamik menülerle ilgili metotlar
  getDynamicMenus(): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/dynamic-menus`);
    
    // Mock veri için
    return of(this.mockDynamicMenus);
  }

  getDynamicMenu(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/dynamic-menus/${id}`);
    
    // Mock veri için
    const menu = this.mockDynamicMenus.find(m => m.id === id);
    return of(menu || {});
  }

  createDynamicMenu(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/dynamic-menus`, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockDynamicMenus.length + 1 });
  }

  updateDynamicMenu(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/dynamic-menus/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteDynamicMenu(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/dynamic-menus/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  // Dinamik menü öğeleri ile ilgili metotlar
  createDynamicMenuItem(menuId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/dynamic-menus/${menuId}/items`, data);
    
    // Mock veri için
    return of({ success: true, id: 100 }); // Yeni bir ID
  }

  updateDynamicMenuItem(menuId: number, itemId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/dynamic-menus/${menuId}/items/${itemId}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteDynamicMenuItem(menuId: number, itemId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/dynamic-menus/${menuId}/items/${itemId}`);
    
    // Mock veri için
    return of({ success: true });
  }

  // Modül menüleri ile ilgili metotlar
  getModuleMenus(): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/module-menus`);
    
    // Mock veri için
    return of(this.mockModuleMenus);
  }

  getModuleMenu(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/module-menus/${id}`);
    
    // Mock veri için
    const menu = this.mockModuleMenus.find(m => m.id === id);
    return of(menu || {});
  }

  createModuleMenu(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/module-menus`, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockModuleMenus.length + 1 });
  }

  updateModuleMenu(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/module-menus/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteModuleMenu(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/module-menus/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  // Modül menü öğeleri ile ilgili metotlar
  createModuleMenuItem(menuId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/module-menus/${menuId}/items`, data);
    
    // Mock veri için
    return of({ success: true, id: 100 }); // Yeni bir ID
  }

  updateModuleMenuItem(menuId: number, itemId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/module-menus/${menuId}/items/${itemId}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteModuleMenuItem(menuId: number, itemId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/module-menus/${menuId}/items/${itemId}`);
    
    // Mock veri için
    return of({ success: true });
  }

  // Yardım kategorileri ve konuları ile ilgili metotlar
  getHelpCategories(): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/help-categories`);
    
    // Mock veri için
    return of(this.mockHelpCategories);
  }

  getHelpCategory(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.get<any>(`${this.apiUrl}/help-categories/${id}`);
    
    // Mock veri için
    const category = this.mockHelpCategories.find(c => c.id === id);
    return of(category || {});
  }

  createHelpCategory(data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/help-categories`, data);
    
    // Mock veri için
    return of({ success: true, id: this.mockHelpCategories.length + 1 });
  }

  updateHelpCategory(id: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/help-categories/${id}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteHelpCategory(id: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/help-categories/${id}`);
    
    // Mock veri için
    return of({ success: true });
  }

  createHelpTopic(categoryId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.post<any>(`${this.apiUrl}/help-categories/${categoryId}/topics`, data);
    
    // Mock veri için
    return of({ success: true, id: 100 }); // Yeni bir ID
  }

  updateHelpTopic(categoryId: number, topicId: number, data: any): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.put<any>(`${this.apiUrl}/help-categories/${categoryId}/topics/${topicId}`, data);
    
    // Mock veri için
    return of({ success: true });
  }

  deleteHelpTopic(categoryId: number, topicId: number): Observable<any> {
    // Gerçek API bağlantısı için
    // return this.http.delete<any>(`${this.apiUrl}/help-categories/${categoryId}/topics/${topicId}`);
    
    // Mock veri için
    return of({ success: true });
  }
}