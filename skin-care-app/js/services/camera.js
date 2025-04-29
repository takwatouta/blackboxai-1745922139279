// تعريف قاعدة البيانات مباشرة في الملف
const skinDatabase = {
  skinTypes: {
    dry: {
      description: "بشرة جافة تحتاج لترطيب مكثف",
      recommended: [
        {id: 1, name: "مرطب كثيف", category: "moisturizer"},
        {id: 2, name: "زيت ليل", category: "oil"}
      ]
    },
    oily: {
      description: "بشرة دهنية تحتاج منتجات خفيفة",
      recommended: [
        {id: 3, name: "جل مرطب", category: "gel"},
        {id: 4, name: "منظف لطيف", category: "cleanser"}
      ]
    },
    combination: {
      description: "بشرة مختلطة تحتاج توازن في الترطيب",
      recommended: [
        {id: 5, name: "مرطب متوازن", category: "balancing"},
        {id: 6, name: "تونر", category: "toner"}
      ]
    }
  },
  getProductsBySkinType: function(skinType) {
    return this.skinTypes[skinType] || [];
  }
};

class CameraService {
  constructor() {
    this.video = document.getElementById('cameraFeed');
    this.canvas = document.getElementById('faceOverlay');
    this.ctx = this.canvas?.getContext('2d');
    this.stream = null;
    this.facingMode = 'user';
    this.isCameraActive = false;
  }

  async checkCameraPermission() {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({
          name: 'camera'
        });
        
        if (permissionStatus.state === 'denied') {
          this.showError(`
            <div>
              <p>تم رفض إذن الكاميرا</p>
              <p>يرجى:</p>
              <ol>
                <li>تحديث إعدادات المتصفح</li>
                <li>السماح باستخدام الكاميرا</li>
                <li>إعادة تحميل الصفحة</li>
              </ol>
            </div>
          `);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log('Permission API not supported, continuing...');
      return true;
    }
  }

  async init() {
    try {
      // التحقق من وجود عناصر DOM
      if (!this.video || !this.canvas) {
        this.showError('عناصر الكاميرا غير موجودة في الصفحة');
        return false;
      }

      // التحقق من دعم واجهة الكاميرا
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.showError('المتصفح لا يدعم وصول الكاميرا');
        return false;
      }

      // التحقق من وجود كاميرا
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      
      if (!hasCamera) {
        this.showError('لم يتم العثور على كاميرا متاحة');
        return false;
      }

      // التحقق من الأذونات
      if (!await this.checkCameraPermission()) {
        return false;
      }

      // إعداد قيود الكاميرا
      const constraints = {
        video: { 
          facingMode: this.facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.video.srcObject = this.stream;
        
        await new Promise((resolve, reject) => {
          this.video.onloadedmetadata = () => {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            this.isCameraActive = true;
            resolve();
          };
          
          this.video.onerror = () => {
            reject(new Error('فشل تحميل تدفق الفيديو'));
          };
          
          setTimeout(() => {
            reject(new Error('تجاوز وقت انتظار الكاميرا'));
          }, 5000);
        });

        return true;
      } catch (error) {
        console.error('Camera stream error:', error);
        this.showError('فشل في تشغيل الكاميرا: ' + error.message);
        this.stopCamera();
        return false;
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
      this.showError('فشل تهيئة الكاميرا');
      return false;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }
    this.isCameraActive = false;
  }

  showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
      errorEl.innerHTML = `
        <div class="error-content">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
        </div>
      `;
      errorEl.style.display = 'block';
    }
  }

  // باقي دوال الخدمة...
}

// جعل الكلاس متاحًا بشكل عام
window.CameraService = CameraService;

// التهيئة التلقائية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  if (!window.cameraService) {
    window.cameraService = new CameraService();
    window.cameraService.init();
  }
});