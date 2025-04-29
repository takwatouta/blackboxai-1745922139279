class CameraService {
  constructor() {
    this.video = document.getElementById('cameraFeed');
    this.canvas = document.getElementById('faceOverlay');
    this.ctx = this.canvas?.getContext('2d');
    this.stream = null;
    this.facingMode = 'user';
    this.isCameraActive = false;
  }

  // دالة لتحميل نماذج الذكاء الاصطناعي
  async loadModels() {
    try {
      const canUseWebGL = this.checkWebGLSupport();
      
      if (canUseWebGL) {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/public/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/public/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/public/models');
        return true;
      } else {
        this.showWebGLError();
        return this.loadSimpleAnalysis();
      }
    } catch (error) {
      console.error('فشل تحميل النماذج:', error);
      this.showError(this.getErrorMessage(error));
      return false;
    }
  }

  // دالة التحليل البديل بدون WebGL
  loadSimpleAnalysis() {
    return new Promise((resolve) => {
      this.showMessage('جارٍ تحميل نظام التحليل البسيط...');
      
      // ضبط أبعاد Canvas
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      
      // رسم الصورة على Canvas
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      
      // تحليل لون البشرة
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const skinTone = this.analyzeSkinTone(imageData);
      
      this.showMessage(`تم تحديد لون البشرة: ${skinTone}`);
      resolve(true);
    });
  }

  // دالة تحليل لون البشرة
  analyzeSkinTone(imageData) {
    let r = 0, g = 0, b = 0, count = 0;
    
    // حساب متوسط الألوان
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
      count++;
    }

    const avgR = Math.round(r / count);
    const avgG = Math.round(g / count);
    const avgB = Math.round(b / count);

    // تصنيف لون البشرة
    if (avgR > 200 && avgG > 180 && avgB > 160) return 'فاتح جداً';
    if (avgR > 180 && avgG > 150 && avgB > 130) return 'فاتح';
    if (avgR > 150 && avgG > 120 && avgB > 100) return 'متوسط';
    if (avgR > 120 && avgG > 90 && avgB > 70) return 'غامق';
    return 'غامق جداً';
  }

  // باقي الدوال الأساسية...
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  getErrorMessage(error) {
    if (error.name === 'NotAllowedError') {
      return 'يجب منح الإذن لاستخدام الكاميرا';
    } else if (error.name === 'NotFoundError') {
      return 'لم يتم العثور على كاميرا متاحة';
    } else if (error.name === 'NotReadableError') {
      return 'الكاميرا قيد الاستخدام من قبل تطبيق آخر';
    } else if (error.message.includes('WebGL')) {
      return 'المتصفح لا يدعم WebGL المطلوب للتحليل';
    }
    return 'حدث خطأ أثناء محاولة الوصول للكاميرا';
  }

  showWebGLError() {
    this.showError('المتصفح لا يدعم ميزة WebGL المطلوبة. جارٍ استخدام نظام تحليل بديل');
  }

  showError(message) {
    const cameraView = document.querySelector('.camera-view');
    if (cameraView) {
      cameraView.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>حدث خطأ</h3>
          <p>${message}</p>
          <button class="btn retry-btn">إعادة المحاولة</button>
        </div>
      `;
      document.querySelector('.retry-btn')?.addEventListener('click', () => this.init());
    }
  }

  showMessage(message) {
    const cameraView = document.querySelector('.camera-view');
    if (cameraView) {
      cameraView.innerHTML += `
        <div class="info-message">
          <i class="fas fa-info-circle"></i>
          <p>${message}</p>
        </div>
      `;
    }
  }

  async init() {
    try {
      // التحقق من وجود عناصر DOM
      if (!this.video || !this.canvas) {
        throw new Error('عناصر الكاميرا غير موجودة في الصفحة');
      }

      // التحقق من دعم واجهة MediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('المتصفح لا يدعم الوصول إلى الكاميرا');
      }

      // تحميل النماذج
      if (!await this.loadModels()) {
        return;
      }

      // إعداد قيود الكاميرا
      const constraints = {
        video: { 
          facingMode: this.facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, min: 15 }
        }
      };

      // الحصول على تدفق الكاميرا
      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
        .catch(error => {
          throw new Error(`فشل الوصول للكاميرا: ${error.message}`);
        });

      this.video.srcObject = this.stream;
      
      // انتظار تحميل بيانات الفيديو
      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.canvas.width = this.video.videoWidth;
          this.canvas.height = this.video.videoHeight;
          this.isCameraActive = true;
          resolve();
        };
        this.video.onerror = () => {
          throw new Error('فشل تحميل الفيديو من الكاميرا');
        };
      });

    } catch (error) {
      console.error('فشل تهيئة الكاميرا:', error);
      this.showError(this.getErrorMessage(error));
      this.stopCamera();
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraActive = false;
  }
}

// تهيئة الخدمة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  new CameraService().init();
});