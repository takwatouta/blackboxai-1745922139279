// Authentication Service
class AuthService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  // Register new user
  register(userData) {
    return new Promise((resolve, reject) => {
      // Check if user already exists
      const userExists = this.users.some(user => user.email === userData.email);
      if (userExists) {
        reject('البريد الإلكتروني مسجل مسبقاً');
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };

      this.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(this.users));
      
      // Auto-login after registration
      this.login(userData.email, userData.password)
        .then(resolve)
        .catch(reject);
    });
  }

  // Login user
  login(email, password) {
    return new Promise((resolve, reject) => {
      const user = this.users.find(u => u.email === email);
      
      if (!user) {
        reject('البريد الإلكتروني غير مسجل');
        return;
      }

      if (user.password !== password) {
        reject('كلمة المرور غير صحيحة');
        return;
      }

      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      resolve(user);
    });
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }
}

// Initialize auth service
const authService = new AuthService();

// Login form handler
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      authService.login(email, password)
        .then((user) => {
          // Redirect to home page after successful login
          window.location.href = '../analysis/camera.html';
        })
        .catch((error) => {
          // Show error message
          alert(error);
        });
    });
  }
});