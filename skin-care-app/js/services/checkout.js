class CheckoutService {
  constructor() {
    this.currentStep = 1;
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.init();
    
    // استماع لتحديثات السلة من الصفحات الأخرى
    window.addEventListener('cartUpdated', () => {
      this.cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.displayOrderSummary();
    });
  }

  init() {
    this.displayOrderSummary();
    this.setupEventListeners();
    this.showStep(this.currentStep);
  }

  displayOrderSummary() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-amount');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    this.cart.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div class="item-info">${item.name}</div>
        <div class="item-price">${item.price} د.ج</div>
        <button class="remove-item" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      cartItems.appendChild(itemElement);
      total += item.price;
    });

    // إضافة أحداث الحذف
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.currentTarget.getAttribute('data-index');
        this.removeItem(index);
      });
    });
    
    cartTotal.textContent = `${total} د.ج`;
    this.updateCheckoutButton(total);
  }

  removeItem(index) {
    this.cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.displayOrderSummary();
    
    // إرسال حدث لتحديث السلة في الصفحات الأخرى
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  }

  updateCheckoutButton(total) {
    const checkoutBtn = document.querySelector('.next-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = total <= 0;
    }
  }

  setupEventListeners() {
    // التنقل بين الخطوات
    document.querySelector('.next-btn')?.addEventListener('click', () => this.nextStep());
    document.querySelector('.back-btn')?.addEventListener('click', () => this.prevStep());
    
    // تأكيد الطلب
    document.querySelector('.confirm-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.confirmOrder();
    });
  }

  showStep(stepNumber) {
    document.querySelectorAll('.checkout-body section').forEach(section => {
      section.classList.remove('active');
    });
    
    const sections = ['cart-section', 'payment-section', 'confirmation-section'];
    if (stepNumber <= sections.length) {
      document.querySelector(`.${sections[stepNumber-1]}`)?.classList.add('active');
    }
    
    // تحديث خطوات التقدم
    document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
      step.classList.toggle('active', index < stepNumber);
    });
  }

  nextStep() {
    if (this.currentStep < 3 && this.cart.length > 0) {
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  confirmOrder() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    if (!paymentMethod) {
      alert('الرجاء اختيار طريقة دفع');
      return;
    }

    // هنا يمكنك إضافة إرسال البيانات للخادم
    alert(`تم تأكيد الطلب! طريقة الدفع: ${paymentMethod}`);
    
    // مسح السلة بعد التأكيد
    this.cart = [];
    localStorage.removeItem('cart');
    
    // الانتقال لخطوة التأكيد
    this.currentStep = 3;
    this.showStep(this.currentStep);
    
    // إرسال حدث لتحديث السلة في الصفحات الأخرى
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  }
}

// تهيئة الخدمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  new CheckoutService();
});