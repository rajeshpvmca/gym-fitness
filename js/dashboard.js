// Check if user is logged in
const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

// Preloader handling
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");
      // Initialize AOS after preloader
      if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
      }
      renderRoleDashboard();
      initSidebarToggle();
    }, 2000);
  }
});

function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggleBtn && sidebar && overlay) {
    const toggle = () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
      document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : 'initial';
    };

    toggleBtn.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
    
    // Close when clicking a link on mobile
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) toggle();
      });
    });
  }
}

function renderRoleDashboard() {
  const userNameEl = document.getElementById("userName");
  const welcomeUserEl = document.getElementById("welcomeUser");
  const roleBadgeEl = document.getElementById("userRoleBadge");
  const roleContentEl = document.getElementById("roleContent");

  if (userNameEl) userNameEl.innerText = user.name;
  if (welcomeUserEl) welcomeUserEl.innerText = `Welcome back, ${user.name}!`;
  if (roleBadgeEl) roleBadgeEl.innerText = user.role;

  let html = "";

  // Admin View
  if (user.role === "Admin") {
    html = `
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-users primary h1 mb-3"></i>
          <h3 class="fw-bold">1,250</h3>
          <p class="text-muted mb-0">Total Members</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-money primary h1 mb-3"></i>
          <h3 class="fw-bold">$12,450</h3>
          <p class="text-muted mb-0">Monthly Revenue</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="300">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-clock-o primary h1 mb-3"></i>
          <h3 class="fw-bold">85%</h3>
          <p class="text-muted mb-0">Gym Capacity</p>
        </div>
      </div>
    `;
  } 
  // Trainer View
  else if (user.role === "Trainer") {
    html = `
      <div class="col-md-4" data-aos="zoom-in">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-list-alt primary h1 mb-3"></i>
          <h3 class="fw-bold">8</h3>
          <p class="text-muted mb-0">Today's Sessions</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-heartbeat primary h1 mb-3"></i>
          <h3 class="fw-bold">24</h3>
          <p class="text-muted mb-0">Active Clients</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-star primary h1 mb-3"></i>
          <h3 class="fw-bold">4.9</h3>
          <p class="text-muted mb-0">Trainer Rating</p>
        </div>
      </div>
    `;
  } 
  // Member View (Default)
  else {
    html = `
      <div class="col-md-4" data-aos="zoom-in">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-fire primary h1 mb-3"></i>
          <h3 class="fw-bold">15</h3>
          <p class="text-muted mb-0">Day Streak</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-line-chart primary h1 mb-3"></i>
          <h3 class="fw-bold">-4.2kg</h3>
          <p class="text-muted mb-0">Weight Progress</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 text-center rounded-4 h-100">
          <i class="fa fa-bolt primary h1 mb-3"></i>
          <h3 class="fw-bold">850</h3>
          <p class="text-muted mb-0">Calories Burnt Today</p>
        </div>
      </div>
    `;
  }

  if (roleContentEl) roleContentEl.innerHTML = html;
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
