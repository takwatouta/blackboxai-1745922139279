// Main application script
document.addEventListener('DOMContentLoaded', () => {
  // Animation for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.5s ease ${index * 0.1}s`;
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  });

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('skinCareToken');
  if (isLoggedIn) {
    const loginBtn = document.querySelector('a[href="auth/login.html"]');
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fas fa-user"></i> الحساب الشخصي';
      loginBtn.href = 'analysis/camera.html';
    }
  }

  // Add service worker for PWA functionality
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

  // تحديث عداد السلة
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
      
      // إضافة تأثير عند التحديث
      if (totalItems > 0) {
        cartCount.classList.add('animate-bounce');
        setTimeout(() => {
          cartCount.classList.remove('animate-bounce');
        }, 1000);
      }
    }
  }

  // تحديث العداد عند تحميل الصفحة
  updateCartCount();

  // تحديث العداد عند تغيير السلة
  window.addEventListener('storage', updateCartCount);
});
