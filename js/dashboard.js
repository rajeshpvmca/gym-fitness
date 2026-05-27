// Check if user is logged in
const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

let currentSection = "overview";

// Preloader handling
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");
      // Initialize AOS after preloader
      if (typeof AOS !== "undefined") {
        AOS.init({ duration: 1000, once: true });
      }
      renderRoleDashboard();
      setupNavigation();
      initSidebarToggle();
    }, 2000);
  }
});

/**
 * Modern Chart.js Initialization
 */
function initCharts() {
  if (currentSection !== "overview") return;

  const ctx1 = document.getElementById("chartAnalytics1");
  const ctx2 = document.getElementById("chartAnalytics2");

  if (!ctx1 || !ctx2) return;

  // Shared Chart Configuration
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
        ticks: { font: { size: 10 } },
      },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    },
  };

  if (user.role === "Admin") {
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Revenue",
            data: [1200, 2100, 1800, 3200, 2400, 4500, 3800],
            borderColor: "#ffc107",
            backgroundColor: "rgba(255,193,7,0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: lineOptions,
    });

    new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: ["Basic", "Standard", "Ultimate"],
        datasets: [
          {
            data: [350, 480, 420],
            backgroundColor: ["#333", "#666", "#ffc107"],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "75%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, font: { size: 11 } },
          },
        },
      },
    });
  } else if (user.role === "Trainer") {
    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
        datasets: [
          {
            label: "Sessions",
            data: [4, 7, 2, 5, 8, 3],
            backgroundColor: "#ffc107",
            borderRadius: 5,
          },
        ],
      },
      options: lineOptions,
    });

    new Chart(ctx2, {
      type: "line",
      data: {
        labels: ["W1", "W2", "W3", "W4"],
        datasets: [
          {
            label: "Avg. Rating",
            data: [4.2, 4.5, 4.8, 4.9],
            borderColor: "#212529",
            tension: 0.4,
          },
        ],
      },
      options: lineOptions,
    });
  } else {
    // Member
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Calories",
            data: [2100, 1850, 2400, 2200, 2600, 1500, 2100],
            borderColor: "#ffc107",
            tension: 0.4,
          },
        ],
      },
      options: lineOptions,
    });

    new Chart(ctx2, {
      type: "radar",
      data: {
        labels: ["Strength", "Endurance", "Flexibility", "Speed", "Agility"],
        datasets: [
          {
            data: [85, 70, 60, 90, 75],
            backgroundColor: "rgba(255,193,7,0.2)",
            borderColor: "#ffc107",
            pointBackgroundColor: "#ffc107",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { r: { ticks: { display: false } } },
      },
    });
  }
}

function setupNavigation() {
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      currentSection = link.getAttribute("data-section");
      updateSectionHeader();
      renderRoleDashboard();

      // Refresh AOS for new content
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    });
  });
}

function updateSectionHeader() {
  const desc = document.getElementById("sectionDescription");
  const descriptions = {
    overview: "Here's what's happening in your fitness zone today.",
    schedule: "Manage your time and upcoming training sessions.",
    profile: "Keep your personal information and goals up to date.",
    payments: "Track your subscriptions and transaction history.",
    settings: "Configure your account and notification preferences.",
  };
  if (desc) desc.innerText = descriptions[currentSection] || "";
}

function initSidebarToggle() {
  const toggleBtn = document.getElementById("sidebarToggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (toggleBtn && sidebar && overlay) {
    const toggle = () => {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("show");
      // Only lock vertical scroll to preserve horizontal hidden state
      document.body.style.overflowY = sidebar.classList.contains("show")
        ? "hidden"
        : "auto";
    };

    toggleBtn.addEventListener("click", toggle);
    overlay.addEventListener("click", toggle);

    // Close when clicking a link on mobile

    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
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

  const templates = {
    Admin: {
      overview: `
      <!-- Stats Section -->
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="bg-primary p-3 rounded-circle text-dark d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fa fa-users h4 mb-0"></i>
            </div>
            <span class="badge bg-success">+12%</span>
          </div>
          <h2 class="fw-bold mb-1">1,250</h2>
          <p class="text-muted small text-uppercase fw-bold mb-0">Total Members</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="bg-primary p-3 rounded-circle text-dark d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;"><i class="fa fa-money h4 mb-0"></i></div>
            <span class="badge bg-success">+$2.4k</span>
          </div>
          <h2 class="fw-bold mb-1">$15,840</h2>
          <p class="text-muted small text-uppercase fw-bold mb-0">Monthly Revenue</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="zoom-in" data-aos-delay="300">
        <div class="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="bg-primary p-3 rounded-circle text-dark d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;"><i class="fa fa-id-card h4 mb-0"></i></div>
            <span class="badge bg-warning">5 New</span>
          </div>
          <h2 class="fw-bold mb-1">42</h2>
          <p class="text-muted small text-uppercase fw-bold mb-0">Active Trainers</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="col-lg-8" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">Revenue Analytics</h5>
            <select class="form-select form-select-sm w-auto border-0 bg-light">
              <option>Last 7 Days</option>
              <option>Monthly</option>
            </select>
          </div>
          <div style="height: 300px;"><canvas id="chartAnalytics1"></canvas></div>
        </div>
      </div>
      <div class="col-lg-4" data-aos="fade-up" data-aos-delay="200">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4">Member Distribution</h5>
          <div style="height: 300px;"><canvas id="chartAnalytics2"></canvas></div>
        </div>
      </div>

      <!-- Recent Registrations Table -->
      <div class="col-lg-8" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
          <h5 class="fw-bold mb-4">New Member Requests</h5>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="fw-bold">Rajesh Kumar</div><span class="small text-muted">rajesh@gmail.com</span></td>
                  <td><span class="badge bg-warning text-dark">Ultimate</span></td>
                  <td><span class="text-success small fw-bold">Verified</span></td>
                  <td><button class="btn btn-sm btn-dark rounded-pill px-3">Review</button></td>
                </tr>
                <tr>
                  <td><div class="fw-bold">Sneha Kapoor</div><span class="small text-muted">sneha@gym.com</span></td>
                  <td><span class="badge bg-light text-dark">Basic</span></td>
                  <td><span class="text-warning small fw-bold">Pending</span></td>
                  <td><button class="btn btn-sm btn-dark rounded-pill px-3">Review</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Admin Actions -->
      <div class="col-lg-4" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white h-100">
          <h5 class="fw-bold mb-4">Quick Actions</h5>
          <button class="btn btn-warning w-100 mb-3 fw-bold rounded-pill">Add New Trainer</button>
          <button class="btn btn-outline-light w-100 mb-3 fw-bold rounded-pill">View Revenue Report</button>
          <button class="btn btn-outline-light w-100 fw-bold rounded-pill">Send Notifications</button>
          <div class="mt-4 p-3 bg-white bg-opacity-10 rounded-3">
            <p class="small mb-0">System Status: <span class="text-success fw-bold">Operational</span></p>
            <p class="small mb-0">Last Backup: 2h ago</p>
          </div>
        </div>
      </div>`,
      schedule: `
        <div class="col-12" data-aos="fade-up">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Master Gym Schedule</h5>
            <div class="table-responsive">
              <table class="table table-bordered align-middle">
                <thead class="table-dark">
                  <tr>
                    <th>Time</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>06:00 AM</td><td class="bg-warning bg-opacity-10 fw-bold">Yoga Flow</td><td>-</td><td class="bg-warning bg-opacity-10 fw-bold">Yoga Flow</td><td>-</td><td class="bg-warning bg-opacity-10 fw-bold">Yoga Flow</td></tr>
                  <tr><td>10:00 AM</td><td>-</td><td class="bg-dark text-white fw-bold">Powerlifting</td><td>-</td><td class="bg-dark text-white fw-bold">Powerlifting</td><td>-</td></tr>
                  <tr><td>05:00 PM</td><td class="bg-warning bg-opacity-10 fw-bold">Zumba</td><td class="bg-warning bg-opacity-10 fw-bold">Zumba</td><td>-</td><td class="bg-warning bg-opacity-10 fw-bold">Zumba</td><td>-</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>`,
      profile: `
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
            <div class="bg-dark p-3 rounded-circle text-dark d-flex align-items-center justify-content-center mx-auto" style="width: 50px; height: 50px;">
              <i class="fa fa-user-secret primary h4 mb-0"></i>
            </div>
            <h4 class="fw-bold">${user.name}</h4>
            <p class="text-muted">Head Administrator</p>
            <hr>
            <p class="small text-start"><strong>Access Level:</strong> Super Admin</p>
            <p class="small text-start"><strong>Last Login:</strong> Today, 08:30 AM</p>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Admin Security Settings</h5>
            <div class="mb-3">
              <label class="form-label small fw-bold">Two-Factor Authentication</label>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" checked>
                <label class="form-check-label">Enable SMS verification</label>
              </div>
            </div>
            <button class="btn btn-dark rounded-pill px-4">Update Admin Profile</button>
          </div>
        </div>`,
      payments: `
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-3">Revenue Overview</h5>
            <h2 class="primary fw-bold">$158,400.00</h2>
            <p class="text-muted small">Total Annual Projected Revenue</p>
            <div class="progress mt-3" style="height: 10px;">
              <div class="progress-bar bg-success" style="width: 70%"></div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-3">Payroll Status</h5>
            <div class="d-flex justify-content-between mb-2"><span>Trainers (42)</span><span class="fw-bold">$12,000</span></div>
            <div class="d-flex justify-content-between mb-2"><span>Staff (15)</span><span class="fw-bold">$5,500</span></div>
            <button class="btn btn-outline-dark w-100 mt-3 rounded-pill">Approve Payouts</button>
          </div>
        </div>`,
      settings: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Global Gym Settings</h5>
            <div class="row g-3">
              <div class="col-md-6"><label class="small fw-bold">Gym Name</label><input type="text" class="form-control" value="Stackly Gym & Fitness"></div>
              <div class="col-md-6"><label class="small fw-bold">Support Email</label><input type="email" class="form-control" value="support@stacklygym.com"></div>
              <div class="col-md-4"><label class="small fw-bold">Tax Rate (%)</label><input type="number" class="form-control" value="18"></div>
              <div class="col-md-8"><label class="small fw-bold">Maintenance Schedule</label><select class="form-select"><option>Weekly (Sundays)</option><option>Monthly</option></select></div>
            </div>
            <button class="btn btn-warning fw-bold mt-4 rounded-pill px-5">SAVE CHANGES</button>
          </div>
        </div>`,
    },
    Trainer: {
      overview: `
      <div class="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
          <h4 class="primary fw-bold mb-1">08</h4>
          <p class="text-muted small mb-0">Sessions Today</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
          <h4 class="primary fw-bold mb-1">24</h4>
          <p class="text-muted small mb-0">Active Clients</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="300">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
          <h4 class="primary fw-bold mb-1">4.9</h4>
          <p class="text-muted small mb-0">Avg. Rating</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3" data-aos="zoom-in" data-aos-delay="400">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center">
          <h4 class="primary fw-bold mb-1">$450</h4>
          <p class="text-muted small mb-0">Weekly Tips</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="col-lg-6" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 class="fw-bold mb-4">Peak Training Hours</h5>
          <div style="height: 250px;"><canvas id="chartAnalytics1"></canvas></div>
        </div>
      </div>
      <div class="col-lg-6" data-aos="fade-up" data-aos-delay="200">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 class="fw-bold mb-4">Rating Trend</h5>
          <div style="height: 250px;"><canvas id="chartAnalytics2"></canvas></div>
        </div>
      </div>

      <div class="col-lg-7" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4"><i class="fa fa-calendar primary me-2"></i>Upcoming Classes</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center py-3 border-0 bg-light rounded-3 mb-2">
              <div><span class="fw-bold d-block">Morning Yoga Flow</span><small class="text-muted">06:00 AM - 07:30 AM</small></div>
              <span class="badge bg-dark rounded-pill">12 Members</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center py-3 border-0 bg-light rounded-3 mb-2">
              <div><span class="fw-bold d-block">Powerlifting Basics</span><small class="text-muted">10:00 AM - 11:30 AM</small></div>
              <span class="badge bg-dark rounded-pill">8 Members</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-lg-5" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4"><i class="fa fa-tasks primary me-2"></i>Daily Tasks</h5>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="task1" checked>
            <label class="form-check-label text-muted text-decoration-line-through" for="task1">Update Rajesh's diet plan</label>
          </div>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="task2">
            <label class="form-check-label" for="task2">Check gym floor equipment</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="task3">
            <label class="form-check-label" for="task3">Review new client signup notes</label>
          </div>
        </div>
      </div>`,
      schedule: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Personal Training Slots</h5>
            <div class="list-group">
              <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div><i class="fa fa-clock-o me-2 primary"></i> 08:00 AM - 09:00 AM</div>
                <div class="fw-bold">Rajesh Kumar</div>
                <span class="badge bg-success">Confirmed</span>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div><i class="fa fa-clock-o me-2 primary"></i> 11:00 AM - 12:00 PM</div>
                <div class="fw-bold">Open Slot</div>
                <button class="btn btn-sm btn-outline-warning">Book Client</button>
              </div>
            </div>
          </div>
        </div>`,
      profile: `
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
            <img src="assets/images/trainer4.webp" alt="Trainer" class="rounded-circle mx-auto d-block border border-3 border-warning shadow" style="width:120px; height:120px; object-fit:cover;">
              <h4 class="fw-bold mt-3 mb-2">${user.name}</h4>
                <span class="badge bg-warning text-dark px-3 py-2 rounded-pill">${user.role}</span>
          </div>
        </div>
        <div class="col-md-8 h-100">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-3">Professional Bio</h5>
            <textarea class="form-control mb-3" rows="5">Expert in high-intensity interval training (HIIT) and strength conditioning with over 8 years of experience helping clients reach their transformation goals.</textarea>
            <h6 class="fw-bold">Specializations</h6>
            <p class="text-muted">Powerlifting, Muscle Hypertrophy, Sports Nutrition</p>
          </div>
        </div>`,
      payments: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Earnings History</h5>
            <table class="table">
              <thead><tr><th>Month</th><th>Base Salary</th><th>PT Commission</th><th>Total</th></tr></thead>
              <tbody>
                <tr><td>June 2025</td><td>$2,500</td><td>$850</td><td class="fw-bold">$3,350</td></tr>
                <tr><td>May 2025</td><td>$2,500</td><td>$1,200</td><td class="fw-bold">$3,700</td></tr>
              </tbody>
            </table>
          </div>
        </div>`,
      settings: `
        <div class="col-12"><div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 class="fw-bold mb-3">Availability Settings</h5>
          <div class="form-check mb-2"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Available for New Clients</label></div>
          <div class="form-check mb-2"><input class="form-check-input" type="checkbox"><label class="form-check-label">Accept Group Classes</label></div>
        </div></div>`,
    },
    Member: {
      schedule: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Your Class Schedule</h5>
            <div class="alert alert-warning py-3 rounded-4 border-0">
              <i class="fa fa-info-circle me-2"></i> You have a <strong>Yoga Flow</strong> class starting in 45 minutes!
            </div>
            <div class="list-group list-group-flush mt-3">
              <div class="list-group-item d-flex justify-content-between py-3 border-0 bg-light rounded-4 mb-3">
                <span><i class="fa fa-calendar-check-o primary me-2"></i> Today, 06:00 PM</span>
                <span class="fw-bold">Boxing Fundamentals</span>
                <a href="#" class="text-danger small fw-bold">Cancel</a>
              </div>
            </div>
            <button class="btn btn-dark rounded-pill px-4 mt-2">Book New Class</button>
          </div>
        </div>`,
      profile: `
        <div class="col-lg-4 text-center">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div class="bg-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width:100px; height:100px;">
              <i class="fa fa-user text-dark" style="font-size:50px;"></i>
            </div>
            <h4 class="fw-bold">${user.name}</h4>
            <p class="text-muted small">${user.email}</p>
            <button class="btn btn-outline-warning btn-sm rounded-pill w-100">Upload Photo</button>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Personal Fitness Goals</h5>
            <div class="row g-3">
              <div class="col-md-6"><label class="small fw-bold">Target Weight (kg)</label><input type="number" class="form-control" value="75"></div>
              <div class="col-md-6"><label class="small fw-bold">Target Body Fat (%)</label><input type="number" class="form-control" value="15"></div>
              <div class="col-12"><label class="small fw-bold">Primary Goal</label><select class="form-select"><option>Muscle Gain</option><option>Weight Loss</option></select></div>
            </div>
          </div>
        </div>`,
      payments: `
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Billing History</h5>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>June 01, 2025</td><td>Ultimate Monthly Membership</td><td>$59.00</td><td><span class="text-success">Paid</span></td></tr>
                  <tr><td>May 01, 2025</td><td>Ultimate Monthly Membership</td><td>$59.00</td><td><span class="text-success">Paid</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>`,
      settings: `
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 class="fw-bold mb-4">Notification Preferences</h5>
            <div class="form-check mb-2"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Email Newsletters</label></div>
            <div class="form-check mb-2"><input class="form-check-input" type="checkbox" checked><label class="form-check-label">Class Reminders</label></div>
            <div class="form-check mb-2"><input class="form-check-input" type="checkbox"><label class="form-check-label">Promotional Offers</label></div>
          </div>
        </div>`,
      overview: `
      <!-- Member Progress Highlights -->
      <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-uppercase small mb-0">Daily Calories</h6>
            <i class="fa fa-fire primary h4 mb-0"></i>
          </div>
          <h2 class="fw-bold mb-3">1,850 <small class="h6 text-muted">/ 2,400</small></h2>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar bg-warning" style="width: 75%"></div>
          </div>
        </div>
      </div>
      <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-uppercase small mb-0">Weight Goal</h6>
            <i class="fa fa-balance-scale primary h4 mb-0"></i>
          </div>
          <h2 class="fw-bold mb-1">78.5 <small class="h6 text-muted">kg</small></h2>
          <p class="text-success small mb-0 fw-bold"><i class="fa fa-arrow-down me-1"></i>Lost 1.2kg this week</p>
        </div>
      </div>
      <div class="col-md-4" data-aos="fade-up" data-aos-delay="300">
        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white text-center h-100">
          <h6 class="fw-bold text-uppercase small mb-3">Member Since</h6>
          <h4 class="fw-bold mb-3">Jan 2025</h4>
          <span class="badge bg-primary text-dark rounded-pill">Ultimate Member</span>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="col-lg-8" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4">Calorie Burn Trend</h5>
          <div style="height: 250px;"><canvas id="chartAnalytics1"></canvas></div>
        </div>
      </div>
      <div class="col-lg-4" data-aos="fade-up" data-aos-delay="200">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4">Body Composition</h5>
          <div style="height: 250px;"><canvas id="chartAnalytics2"></canvas></div>
        </div>
      </div>

      <div class="col-lg-7" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white h-100 overflow-hidden position-relative">
          <div class="position-relative z-1">
            <h5 class="primary fw-bold mb-1">Today's Workout</h5>
            <h3 class="fw-bold mb-4 text-uppercase">Chest & Triceps Power</h3>
            <div class="row g-3">
              <div class="col-6">
                <div class="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                  <span class="d-block small text-light opacity-50">Bench Press</span>
                  <span class="fw-bold">4 Sets x 10 Reps</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                  <span class="d-block small text-light opacity-50">Cable Flys</span>
                  <span class="fw-bold">3 Sets x 15 Reps</span>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 bg-white bg-opacity-10 rounded-3 text-center">
                  <span class="d-block small text-light opacity-50">Dips</span>
                  <span class="fw-bold">3 Sets x Fail</span>
                </div>
              </div>
              <div class="col-6 d-flex align-items-center justify-content-center">
                <a href="#" class="primary fw-bold text-decoration-none">View Full Plan <i class="fa fa-arrow-right ms-2"></i></a>
              </div>
            </div>
          </div>
          <i class="fa fa-bolt position-absolute primary opacity-10" style="bottom: -50px; right: -20px; font-size: 200px;"></i>
        </div>
      </div>

      <!-- Membership Benefits / Upgrade -->
      <div class="col-lg-5" data-aos="fade-up">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold mb-4">Your Membership</h5>
          <div class="d-flex align-items-center gap-3 mb-4">
            <img src="assets/images/logoStackly.webp" height="40" class="rounded-pill bg-warning p-1">
            <div>
              <p class="mb-0 fw-bold">Stackly Ultimate Plan</p>
              <p class="small text-muted mb-0">Valid till Dec 2025</p>
            </div>
          </div>
          <div class="p-3 bg-light rounded-3 mb-4">
            <h6 class="small fw-bold text-uppercase mb-2">My Rewards</h6>
            <div class="d-flex align-items-center gap-2">
              <i class="fa fa-trophy primary"></i>
              <p class="small mb-0">Free Protein Shake Coupon Earned!</p>
            </div>
          </div>
          <button class="btn btn-outline-warning btn-dark w-100 rounded-pill fw-bold py-2 mt-auto">Extend Membership</button>
        </div>
      </div>`,
    },
  };

  const role = user.role; // Admin, Trainer, or Member
  roleContentEl.innerHTML =
    templates[role][currentSection] || templates.Member.overview;

  // Initialize charts after setting HTML
  if (currentSection === "overview") {
    initCharts();
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
