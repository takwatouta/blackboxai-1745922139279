class CheckoutService {
  constructor() {
    this.currentStep = 1;
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.init();
  }

  init() {
    this.displayOrderSummary();
    this.setupEventListeners();
    this.showStep(this.currentStep);
  }

  displayOrderSummary() {
    const orderItems = document.querySelector('.order-items');
    const orderTotal = document.querySelector('.total-price');
    
    orderItems.innerHTML = '';
    let total = 0;
    
    this.cart.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'order-item';
      itemElement.innerHTML = `
        <span>${item.name}</span>
        <span>${item.price} د.ج</span>
        <button class="remove-item" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      orderItems.appendChild(itemElement);
      total += item.price;
    });

    // إضافة حدث لحذف العناصر
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.currentTarget.getAttribute('data-index');
        this.cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.displayOrderSummary();
      });
    });
    
    orderTotal.textContent = `${total} د.ج`;
    this.updateCheckoutButton(total);
  }

  updateCheckoutButton(total) {
    const checkoutBtn = document.querySelector('.btn-next');
    if (checkoutBtn) {
      checkoutBtn.disabled = total <= 0;
      checkoutBtn.textContent = total > 0 ? 'متابعة إلى معلومات الدفع' : 'السلة فارغة';
    }
  }

  setupEventListeners() {
    // يمكن إضافة المزيد من المستمعين للأحداث هنا
  }

  showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => {
      step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
  }

  nextStep() {
    if (this.currentStep < 4 && this.cart.length > 0) {
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
    if (paymentMethod) {
      // هنا يمكنك إضافة منطق تأكيد الطلب
      this.nextStep(); // الانتقال إلى شاشة التأكيد
      
      // مسح السلة بعد التأكيد
      localStorage.removeItem('cart');
    }
  }
}

// دالة للوصول إلى الخدمة من الواجهة
function nextStep() {
  window.checkoutService.nextStep();
}

function prevStep() {
  window.checkoutService.prevStep();
}

function confirmOrder() {
  window.checkoutService.confirmOrder();
}

document.addEventListener('DOMContentLoaded', () => {
  window.checkoutService = new CheckoutService();
});