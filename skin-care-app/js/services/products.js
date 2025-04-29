class ProductService {
  constructor() {
    this.products = {
      'جاف': [
        { 
          id: 1, 
          name: 'مرطب كثيف للبشرة الجافة', 
          description: 'يحتوي على حمض الهيالورونيك لترطيب عميق',
          image: '/assets/products/moisturizer.jpg',
          price: 45.99,
          rating: 4.8
        },
        {
          id: 2,
          name: 'زيت الترطيب الليلي',
          description: 'مزيج من الزيوت الطبيعية لترطيب طوال الليل',
          image: '/assets/products/night-oil.jpg',
          price: 55.50,
          rating: 4.9
        }
      ],
      'دهني': [
        {
          id: 3,
          name: 'جل مرطب خفيف',
          description: 'تركيبة خفيفة غير لزجة للبشرة الدهنية',
          image: '/assets/products/gel-moisturizer.jpg',
          price: 35.99,
          rating: 4.7
        }
      ],
      'مختلط': [
        {
          id: 4,
          name: 'مرطب متوازن',
          description: 'يناسب المناطق الجافة والدهنية في الوجه',
          image: '/assets/products/balanced-moisturizer.jpg',
          price: 42.99,
          rating: 4.6
        }
      ],
      'حساس': [
        {
          id: 5,
          name: 'منتجات خالية من العطور',
          description: 'تركيبة لطيفة خالية من المهيجات',
          image: '/assets/products/fragrance-free.jpg',
          price: 39.99,
          rating: 4.9
        }
      ]
    };
  }

  getBySkinType(skinType) {
    const recommended = [];
    
    // إضافة منتجات عامة لجميع أنواع البشرة
    recommended.push({
      id: 6,
      name: 'واقي شمس SPF 50+',
      description: 'حماية من الشمس للاستخدام اليومي',
      image: '/assets/products/sunscreen.jpg',
      price: 29.99,
      rating: 4.8
    });

    // إضافة منتجات خاصة بنوع البشرة
    if (this.products[skinType]) {
      recommended.push(...this.products[skinType]);
    }

    return recommended;
  }
}

window.productService = new ProductService();