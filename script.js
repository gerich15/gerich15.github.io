// DOM элементы
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-menu");
const applicationForm = document.getElementById("applicationForm");
const newsletterForm = document.getElementById("newsletterForm");

// ===== ОБЩИЕ ФУНКЦИИ =====

// темы
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDarkTheme = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }

  // слайд учителей
  updateTeacherSlider();
});

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  menuToggle.querySelector("i").classList.toggle("fa-bars");
  menuToggle.querySelector("i").classList.toggle("fa-times");
});

// Закрытие меню при клике
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.querySelector("i").classList.add("fa-bars");
    menuToggle.querySelector("i").classList.remove("fa-times");
  });
});

// ===== СЛАЙДЕР ПРЕПОДАВАТЕЛЕЙ =====
const teacherSlides = document.querySelectorAll(".teacher-slide");
const prevTeacherBtn = document.getElementById("prevTeacher");
const nextTeacherBtn = document.getElementById("nextTeacher");
const teacherMiniatures = document.querySelectorAll(".miniature");
let currentTeacherSlide = 0;
let isAnimating = false;

function updateTeacherSlider() {
  if (isAnimating) return;

  isAnimating = true;

  teacherSlides.forEach((slide) => {
    slide.classList.remove("active");
  });

  teacherMiniatures.forEach((miniature) => {
    miniature.classList.remove("active");
  });

  teacherSlides[currentTeacherSlide].classList.add("active");
  teacherMiniatures[currentTeacherSlide].classList.add("active");

  if (prevTeacherBtn) prevTeacherBtn.disabled = currentTeacherSlide === 0;
  if (nextTeacherBtn)
    nextTeacherBtn.disabled = currentTeacherSlide === teacherSlides.length - 1;

  setTimeout(() => {
    isAnimating = false;
  }, 500);
}

if (prevTeacherBtn) {
  prevTeacherBtn.addEventListener("click", () => {
    if (currentTeacherSlide > 0) {
      currentTeacherSlide--;
      updateTeacherSlider();
    }
  });
}

if (nextTeacherBtn) {
  nextTeacherBtn.addEventListener("click", () => {
    if (currentTeacherSlide < teacherSlides.length - 1) {
      currentTeacherSlide++;
      updateTeacherSlider();
    }
  });
}

teacherMiniatures.forEach((miniature) => {
  miniature.addEventListener("click", function () {
    const index = parseInt(this.getAttribute("data-index"));
    if (index !== currentTeacherSlide) {
      currentTeacherSlide = index;
      updateTeacherSlider();
    }
  });
});

// Автоматическая смена фоток
let autoSlideInterval;

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentTeacherSlide = (currentTeacherSlide + 1) % teacherSlides.length;
    updateTeacherSlider();
  }, 8000);
}

function stopAutoSlide() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
}

const teachersSlider = document.querySelector(".teachers-slider");
if (teachersSlider) {
  teachersSlider.addEventListener("mouseenter", stopAutoSlide);
  teachersSlider.addEventListener("mouseleave", startAutoSlide);

  updateTeacherSlider();
  startAutoSlide();
}

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    stopAutoSlide();
  } else {
    startAutoSlide();
  }
});

// ===== ОБРАБОТКА ФОРМ =====
if (applicationForm) {
  applicationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      course: document.getElementById("course").value,
      message: document.getElementById("message").value,
    };

    // тут нада отправка на сервер
    console.log("Заявка отправлена:", formData);

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.innerHTML = '<i class="fas fa-check"></i> Заявка отправлена!';
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = "#28a745";

    setTimeout(() => {
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.backgroundColor = "";

      showNotification(
        "Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
        "success"
      );
    }, 2000);
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value;

    console.log("Подписка на новости:", email);

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-check"></i>';
    submitBtn.style.backgroundColor = "#28a745";

    setTimeout(() => {
      emailInput.value = "";
      submitBtn.innerHTML = originalHTML;
      submitBtn.style.backgroundColor = "";

      showNotification("Вы успешно подписались на наши новости!", "success");
    }, 1500);
  });
}

// уведомление
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${
        type === "success" ? "check-circle" : "info-circle"
      }"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #333;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        transition: transform 0.3s ease;
      }
      
      .notification.success {
        background-color: #28a745;
      }
      
      .notification.info {
        background-color: #17a2b8;
      }
      
      .notification .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .notification .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 15px;
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    });

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Анимация при прокрутке == запомнить ==
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated");
    }
  });
}, observerOptions);

document
  .querySelectorAll(".feature-card, .example-card, .course-card")
  .forEach((el) => {
    observer.observe(el);
  });

// ===== Интерактивная хрень =====

document.addEventListener("DOMContentLoaded", function () {
  const codeTabs = document.querySelectorAll(".code-tab");
  const codeSnippets = document.querySelectorAll(".code-snippet");
  const visualDemos = document.querySelectorAll(".visual-demo");

  codeTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.dataset.tab;

      codeTabs.forEach((t) => t.classList.remove("active"));
      codeSnippets.forEach((s) => s.classList.remove("active"));
      visualDemos.forEach((d) => d.classList.remove("active"));

      this.classList.add("active");
      document.getElementById(`${tabName}-snippet`).classList.add("active");
      document.getElementById(`${tabName}-demo`).classList.add("active");
    });
  });

  // ===== Демо 1 =====
  const demoEmail = document.getElementById("demo-email");
  const demoPassword = document.getElementById("demo-password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const validateBtn = document.getElementById("validate-btn");
  const validationResult = document.getElementById("validation-result");

  function highlightCodeLine(lineClass) {
    document.querySelectorAll(".code-highlight").forEach((el) => {
      el.classList.remove("active");
    });

    const codeLine = document.querySelector(`#security-code .${lineClass}`);
    if (codeLine) {
      codeLine.classList.add("active");

      setTimeout(() => {
        codeLine.classList.remove("active");
      }, 1500);
    }
  }

  demoEmail.addEventListener("input", function () {
    const isValid = this.value.includes("@");

    if (this.value && !isValid) {
      this.classList.add("error");
      emailError.style.display = "flex";
      highlightCodeLine("email-error");
    } else {
      this.classList.remove("error");
      emailError.style.display = "none";
    }
  });

  demoPassword.addEventListener("input", function () {
    const isValid = this.value.length >= 8;

    if (this.value && !isValid) {
      this.classList.add("error");
      passwordError.style.display = "flex";
      highlightCodeLine("password-error");
    } else {
      this.classList.remove("error");
      passwordError.style.display = "none";
    }
  });

  validateBtn.addEventListener("click", function () {
    const emailValid = demoEmail.value.includes("@");
    const passwordValid = demoPassword.value.length >= 8;

    validationResult.className = "validation-result";

    if (!demoEmail.value && !demoPassword.value) {
      validationResult.innerHTML =
        '<i class="fas fa-info-circle"></i> Заполните поля для проверки';
      return;
    }

    if (emailValid && passwordValid) {
      validationResult.classList.add("success");
      validationResult.innerHTML =
        '<i class="fas fa-check-circle"></i> Валидация пройдена успешно!';
    } else {
      validationResult.classList.add("error");
      validationResult.innerHTML =
        '<i class="fas fa-times-circle"></i> Исправьте ошибки в форме';
    }
  });

  // ===== Демо 2 =====
  const animatedBoxes = document.querySelectorAll(".animated-box");
  const counter1 = document.getElementById("counter1");
  const counter2 = document.getElementById("counter2");
  const counter3 = document.getElementById("counter3");

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 30);
  }

  function checkVisibility() {
    const demoSection = document.getElementById("demo");
    const demoRect = demoSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (demoRect.top < windowHeight * 0.5 && demoRect.bottom > 0) {
      animatedBoxes.forEach((box, index) => {
        setTimeout(() => {
          box.classList.add("animated");
        }, index * 200);
      });

      if (!counter1.classList.contains("animated")) {
        counter1.classList.add("animated");
        counter2.classList.add("animated");
        counter3.classList.add("animated");

        animateCounter(counter1, 125);
        animateCounter(counter2, 98);
        animateCounter(counter3, 2540);
      }
    }
  }

  window.addEventListener("scroll", checkVisibility);

  // ===== Демо 3 =====
  const draggableItems = document.querySelectorAll(".draggable-item");
  const dropArea = document.getElementById("drop-area");
  const dropCount = document.getElementById("drop-count");
  const clearDropsBtn = document.getElementById("clear-drops");

  let droppedItems = 0;

  draggableItems.forEach((item) => {
    item.addEventListener("dragstart", function (e) {
      this.classList.add("dragging");
      e.dataTransfer.setData("text/plain", this.dataset.type);
      e.dataTransfer.effectAllowed = "move";
    });

    item.addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });
  });

  dropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", function () {
    this.classList.remove("drag-over");
  });

  dropArea.addEventListener("drop", function (e) {
    e.preventDefault();
    this.classList.remove("drag-over");

    const dataType = e.dataTransfer.getData("text/plain");
    if (!dataType) return;

    const originalItem = document.querySelector(`[data-type="${dataType}"]`);
    const clonedItem = originalItem.cloneNode(true);
    clonedItem.draggable = false;
    clonedItem.classList.remove("dragging");
    clonedItem.style.animation = "dropItem 0.3s ease";

    if (this.querySelector("p")) {
      this.innerHTML = "";
    }

    this.appendChild(clonedItem);

    droppedItems++;
    dropCount.textContent = droppedItems;

    const codeLines = document.querySelectorAll(
      "#interaction-code .code-highlight"
    );
    codeLines.forEach((line) => line.classList.remove("active"));

    if (droppedItems === 1) {
      codeLines[0].classList.add("active");
      setTimeout(() => codeLines[0].classList.remove("active"), 1500);
    } else if (droppedItems === 2) {
      codeLines[1].classList.add("active");
      setTimeout(() => codeLines[1].classList.remove("active"), 1500);
    }
  });

  clearDropsBtn.addEventListener("click", function () {
    dropArea.innerHTML = "<p>Перетащите сюда элементы</p>";
    droppedItems = 0;
    dropCount.textContent = "0";
  });

  // ===== Кнопки управления =====
  const resetBtn = document.getElementById("reset-demo");
  const runCodeBtn = document.getElementById("run-code");

  resetBtn.addEventListener("click", function () {
    demoEmail.value = "";
    demoPassword.value = "";
    demoEmail.classList.remove("error");
    demoPassword.classList.remove("error");
    emailError.style.display = "none";
    passwordError.style.display = "none";
    validationResult.className = "validation-result";
    validationResult.innerHTML = "";

    animatedBoxes.forEach((box) => {
      box.classList.remove("animated");
    });

    counter1.textContent = "0";
    counter2.textContent = "0";
    counter3.textContent = "0";
    counter1.classList.remove("animated");
    counter2.classList.remove("animated");
    counter3.classList.remove("animated");

    dropArea.innerHTML = "<p>Перетащите сюда элементы</p>";
    droppedItems = 0;
    dropCount.textContent = "0";

    showNotification(
      "Демо сброшено! Прокрутите страницу чтобы увидеть анимации снова.",
      "info"
    );
  });

  runCodeBtn.addEventListener("click", function () {
    const activeTab = document.querySelector(".code-tab.active").dataset.tab;
    const codeLines = document.querySelectorAll(
      `#${activeTab}-code .code-highlight`
    );

    let i = 0;
    function highlightNextLine() {
      if (i < codeLines.length) {
        codeLines[i].classList.add("active");

        setTimeout(() => {
          codeLines[i].classList.remove("active");
          i++;
          highlightNextLine();
        }, 800);
      }
    }

    highlightNextLine();

    switch (activeTab) {
      case "security":
        if (!demoEmail.value) demoEmail.value = "testmail.com";
        if (!demoPassword.value) demoPassword.value = "123";

        setTimeout(() => {
          validateBtn.click();
        }, 1000);
        break;

      case "animation":
        animatedBoxes.forEach((box, index) => {
          setTimeout(() => {
            box.classList.add("animated");
          }, index * 200);
        });

        animateCounter(counter1, 125);
        animateCounter(counter2, 98);
        animateCounter(counter3, 2540);
        break;

      case "interaction":
        setTimeout(() => {
          const types = ["html", "css", "js"];
          types.forEach((type, index) => {
            setTimeout(() => {
              const originalItem = document.querySelector(
                `[data-type="${type}"]`
              );
              const clonedItem = originalItem.cloneNode(true);
              clonedItem.draggable = false;
              clonedItem.style.animation = "dropItem 0.3s ease";

              if (dropArea.querySelector("p")) {
                dropArea.innerHTML = "";
              }

              dropArea.appendChild(clonedItem);
              droppedItems++;
              dropCount.textContent = droppedItems;
            }, index * 500);
          });
        }, 500);
        break;
    }

    showNotification(
      "Код выполнен! Смотрите результат в правой панели.",
      "success"
    );
  });

  // ===== Проценты при скролле =====
  const progressFill = document.getElementById("demo-progress");
  const progressPercent = document.getElementById("progress-percent");

  function updateProgressBar() {
    const demoSection = document.getElementById("demo");
    const demoRect = demoSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    let progress = 0;

    if (demoRect.top < 0) {
      const visibleHeight =
        windowHeight - Math.max(0, demoRect.bottom - windowHeight);
      const totalHeight = demoRect.height;
      progress = Math.min(
        100,
        Math.max(0, (visibleHeight / totalHeight) * 100)
      );
    }

    progressFill.style.width = `${progress}%`;
    progressPercent.textContent = `${Math.round(progress)}%`;
  }

  window.addEventListener("scroll", updateProgressBar);
  window.addEventListener("resize", updateProgressBar);

  updateProgressBar();

  console.log("Интерактивная демонстрация загружена!");
});
