async function loadComponents() {

  // =========================
  // LOAD HEADER
  // =========================
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    const headerRes = await fetch("header.html");
    headerPlaceholder.innerHTML = await headerRes.text();

    // Active Navbar Link
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navbar-nav .nav-link")
      .forEach((link) => {
        if (link.getAttribute("href") === currentPath) {
          link.classList.add("active");
        }
      });

    // Handle Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
      });
    }

    // Check Login Status & Update Header
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const authLinks = document.getElementById("nav-auth-links");

    if (loggedInUser && authLinks) {
      authLinks.innerHTML = `
        <a href="dashboard.html" class="btn btn-warning btn-sm px-3 fw-bold me-2">Dashboard</a>
        <button onclick="logout()" class="btn btn-danger btn-sm px-3 fw-bold">Logout</button>
      `;
    }

    // Handle body scroll lock for mobile menu
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
      navbarCollapse.addEventListener('show.bs.collapse', () => {
        document.body.style.overflow = 'hidden';
      });
      navbarCollapse.addEventListener('hide.bs.collapse', () => {
        document.body.style.overflow = 'auto';
      });
    }
  }

  // =========================
  // LOAD FOOTER
  // =========================
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    const footerRes = await fetch("footer.html");
    footerPlaceholder.innerHTML = await footerRes.text();

    // Newsletter Validation & Redirection
    const newsletterForm = document.querySelector(".input-group[action='404.html']");
    const newsletterEmail = document.getElementById("newsletterEmail");

    if (newsletterForm && newsletterEmail) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = newsletterEmail.value;
        const emailPattern = /^[^\s@]+@[^\s@]+$/;

        if (emailPattern.test(email)) {
          window.location.href = "404.html";
        }
      });
    }
  }

  // =========================
  // SMOOTH SCROLL
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // =========================
  // PRELOADER
  // =========================
  const preloader = document.getElementById("preloader");

  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("preloader-hidden");
      AOS.init({ duration: 1200, once: true });
    }, 2000);
  } else {
    AOS.init({ duration: 1200, once: true });
  }

  // =========================
  // ALL SWIPERS
  // =========================
  const swipers = {};

  document.querySelectorAll(".swiper").forEach((slider) => {

    const swiperClass = slider.classList[1];

    // Specific configuration for Hero Slider
    if (swiperClass === 'heroSwiper') {
      swipers[swiperClass] = new Swiper(".heroSwiper", {
        effect: "fade",
        loop: true,
        speed: 2000,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        allowTouchMove: false, // Prevents users from dragging the background
      });
      return; // Skip the default multi-slide config below
    }

    // Specific configuration for Testimonial Slider
    if (swiperClass === 'testimonialSwiper') {
      swipers[swiperClass] = new Swiper(".testimonialSwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 1000,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
      return;
    }

    swipers[swiperClass] = new Swiper(`.${swiperClass}`, {

      slidesPerView: 4,
      spaceBetween: 25,
      loop: true,
      speed: 800,

      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      breakpoints: {

        0: {
          slidesPerView: 1,
        },

        576: {
          slidesPerView: 2,
        },

        768: {
          slidesPerView: 3,
        },

        1024: {
            slidesPerView: 3,
        },

        1200: {
            slidesPerView: 4,
        }

      },

    });

  });

  // =========================
  // BLOG SIDEBAR NEWSLETTER
  // =========================
  const blogForm = document.getElementById("blogNewsletterForm");
  const blogEmail = document.getElementById("blogNewsletterEmail");

  if (blogForm && blogEmail) {
    blogForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = blogEmail.value;
      const emailPattern = /^[^\s@]+@[^\s@]+$/;

      if (emailPattern.test(email)) {
        window.location.href = "404.html";
      }
    });
  }

 }

/**
 * Achievement Counter Animation
 */
function initCounters() {
  // Handles both .num (from Achievements) and .progress-num (from Stats)
  const counters = document.querySelectorAll('.num, .progress-num');
  const speed = 200;

  const startCounter = (counter) => {
    const target = +counter.getAttribute('data-val');
    let count = 0;
    const increment = target / speed;

    const updateCount = () => {
      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  };

  const animateProgressBars = (container) => {
    const bars = container.querySelectorAll('.progress-bar');
    bars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-width');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startCounter(entry.target);
    });
  }, { threshold: 1.0 });

  counters.forEach(counter => observer.observe(counter));

  // Observer specifically for the Stats section to trigger bar widths
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateProgressBars(entry.target);
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }
}

/**
 * Global logout handler used across all pages via the dynamic header
 */
window.logout = function() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
};

 loadComponents().then(() => initCounters());