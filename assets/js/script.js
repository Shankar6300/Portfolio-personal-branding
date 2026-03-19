'use strict';

/**
 * Navbar toggle (mobile)
 */
const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");

navToggleBtn.addEventListener("click", function () {
  header.classList.toggle("nav-active");
  this.classList.toggle("active");
});

const navbarLinks = document.querySelectorAll("[data-nav-link]");

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    header.classList.remove("nav-active");
    navToggleBtn.classList.remove("active");
  });
}


/**
 * Header + Back to top on scroll
 */
const backTopBtn = document.querySelector("[data-back-to-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

// scroll spy – highlight navbar link based on current section
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", function () {
  const scrollY = window.pageYOffset;
  sections.forEach(function (section) {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 70; // account for header height
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      const activeLink = document.querySelector(".navbar-link.active");
      if (activeLink) activeLink.classList.remove("active");
      const newLink = document.querySelector(`.navbar-link[href=\"#${sectionId}\"]`);
      if (newLink) newLink.classList.add("active");
    }
  });
});


/**
 * Scroll reveal animations - animate elements as they come into view
 */
function revealOnScroll() {
  const revealElements = document.querySelectorAll(
    '.about-card, .about-right, .skills-item, .project-card, .cert-card, .achievement-item, .edu-card, .section-subtitle, .section-title, .section-text, .contact-item, .resume-contact-link, .resume-tab-btn'
  );

  revealElements.forEach(function (element) {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 100;

    if (elementTop < window.innerHeight - elementVisible) {
      if (!element.classList.contains('show')) {
        element.classList.add('show');
        // add animation delay based on index or just simple fade
        element.style.animation = 'fadeInUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
      }
    }
  });
}

window.addEventListener('scroll', revealOnScroll);

document.addEventListener("DOMContentLoaded", function () {
  revealOnScroll();
});

/**
 * Parallax effect on hero avatar with mouse movement
 */
const heroAvatar = document.querySelector(".hero-avatar");
if (heroAvatar) {
  document.addEventListener("mousemove", function (e) {
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    // apply to avatar specifically so we don't break wrapper's css animation
    heroAvatar.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
}

/**
 * Skills tab filter
 */
const skillsTabBtns = document.querySelectorAll(".skills-tab-btn");
const skillsItems = document.querySelectorAll(".skills-item[data-category]");

skillsTabBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    skillsTabBtns.forEach(function (b) { b.classList.remove("active"); });
    this.classList.add("active");

    const filter = this.getAttribute("data-filter");

    skillsItems.forEach(function (item) {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});


/**
 * Project filter
 */
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card[data-category]");

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) { b.classList.remove("active"); });
    this.classList.add("active");

    const filter = this.getAttribute("data-filter");
    let visibleIndex = 0;

    projectCards.forEach(function (card) {
      const shouldShow = filter === "all" || card.getAttribute("data-category") === filter;

      if (shouldShow) {
        card.classList.remove("hidden", "project-filter-out");
        card.style.setProperty("--project-stagger", `${visibleIndex * 70}ms`);
        card.classList.remove("project-filter-in");
        void card.offsetWidth;
        card.classList.add("project-filter-in");
        visibleIndex += 1;
      } else {
        card.classList.remove("project-filter-in");
        card.classList.add("project-filter-out");
        window.setTimeout(function () {
          if (card.classList.contains("project-filter-out")) {
            card.classList.add("hidden");
          }
        }, 280);
      }
    });
  });
});


/**
 * Resume tabs
 */
const resumeTabBtns = document.querySelectorAll(".resume-tab-btn");
const resumeTabContents = document.querySelectorAll(".resume-tab-content");

resumeTabBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    resumeTabBtns.forEach(function (b) { b.classList.remove("active"); });
    resumeTabContents.forEach(function (c) { c.classList.remove("active"); });

    this.classList.add("active");
    const tabId = "tab-" + this.getAttribute("data-tab");
    const target = document.getElementById(tabId);
    if (target) target.classList.add("active");
  });
});

/**
 * Theme Toggle (Light/Dark Mode)
 */
const themeToggleBtn = document.querySelector("[data-theme-btn]");
const bodyElements = document.body;

// Check if theme preference exists in localStorage
if (localStorage.getItem("theme") === "light") {
  bodyElements.classList.add("light-theme");
  document.querySelector('.dark-icon').style.display = 'block';
  document.querySelector('.light-icon').style.display = 'none';
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", function () {
    bodyElements.classList.toggle("light-theme");
    
    // Toggle icons
    const darkIcon = document.querySelector(".dark-icon");
    const lightIcon = document.querySelector(".light-icon");
    
    if (bodyElements.classList.contains("light-theme")) {
      localStorage.setItem("theme", "light");
      darkIcon.style.display = 'block';
      lightIcon.style.display = 'none';
    } else {
      localStorage.setItem("theme", "dark");
      darkIcon.style.display = 'none';
      lightIcon.style.display = 'block';
    }
  });
}

/**
 * Animated Skills Progress Bars on Scroll
 */
const skillBars = document.querySelectorAll(".skills-progress");

// Store the target width and reset to 0
skillBars.forEach(bar => {
  bar.dataset.width = bar.style.width;
  bar.style.width = "0%";
  bar.style.transition = "width 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
});

const skillObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Re-apply the target width when skills section is visible
      const barsToAnimate = entry.target.querySelectorAll(".skills-progress");
      barsToAnimate.forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById("skills");
if (skillsSection) {
  skillObserver.observe(skillsSection);
}

/**
 * Contact form submission (sends email via FormSubmit)
 */
const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  const formStatus = contactForm.querySelector("[data-form-status]");
  const submitBtn = contactForm.querySelector(".btn-submit");
  const defaultBtnText = submitBtn ? submitBtn.textContent : "Send Message";

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    if (formStatus) {
      formStatus.textContent = "Sending your message...";
      formStatus.className = "form-status pending";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      if (formStatus) {
        formStatus.textContent = "Message sent successfully. I will get back to you soon.";
        formStatus.className = "form-status success";
      }

      contactForm.reset();
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = "Unable to send right now. Please use the email link beside the form.";
        formStatus.className = "form-status error";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultBtnText;
      }
    }
  });
}

/**
 * Advanced Premium UI Behaviors
 */

// 1. Custom Cursor
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

if (cursorDot && cursorOutline && window.innerWidth >= 990) {
  window.addEventListener("mousemove", function(e) {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Smooth trailing effect for outline
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Cursor Hover effects
  const interactiveElements = document.querySelectorAll("a, button, .interactive-card, .btn");
  interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      cursorOutline.classList.remove("cursor-hover");
    });
  });
}

// 2. Scroll Progress Bar
const scrollProgress = document.getElementById("scroll-progress");
if (scrollProgress) {
  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
  });
}

// 3. Spotlight Hover Effect for Cards
const cards = document.querySelectorAll(".project-card, .about-card, .experience-card, .cert-card, .edu-card");
cards.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});
