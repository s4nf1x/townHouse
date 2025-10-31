const header = document.querySelector('header');

if (header) {
  const toggleScrolledClass = () => {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', toggleScrolledClass);
  toggleScrolledClass();
}

document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      const targetElement = document.querySelector(href);

      if (targetElement) {
        e.preventDefault();

        const offset = 200; // Отступ в пикселях
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const sliderContainer = document.querySelector('.images-slider-container');
  const slider = document.querySelector('.images-slider');
  const images = slider.querySelectorAll('img');
  const imageCount = images.length;
  const imageWidth = 300;

  const scrollSpeedSeconds = 40;

  const totalWidth = imageCount * imageWidth;
  const pixelsPerSecond = totalWidth / scrollSpeedSeconds;

  let currentPosition = 0;
  let animationId;
  let lastTimestamp = 0;
  let isAutoScrollPaused = false;

  images.forEach(img => {
    const clone = img.cloneNode(true);
    slider.appendChild(clone);
  });

  function autoScroll(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(autoScroll);
      return;
    }

    if (isAutoScrollPaused) {
      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(autoScroll);
      return;
    }

    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    currentPosition -= pixelsPerSecond * (deltaTime / 1000);

    if (Math.abs(currentPosition) >= totalWidth) {
      currentPosition += totalWidth;

      slider.style.transition = 'none';
      slider.style.transform = `translateX(${currentPosition}px)`;

      requestAnimationFrame(() => {
        slider.style.transition = '';
      });
    } else {
      slider.style.transform = `translateX(${currentPosition}px)`;
    }

    animationId = requestAnimationFrame(autoScroll);
  }

  let isDragging = false;
  let startX;
  let startPosition;

  slider.addEventListener('mousedown', function(e) {
    isDragging = true;
    isAutoScrollPaused = true;
    startX = e.clientX;
    startPosition = currentPosition;
    cancelAnimationFrame(animationId);
    slider.style.cursor = 'grabbing';
    slider.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    currentPosition = startPosition + deltaX;

    const extendedWidth = totalWidth * 2;

    if (currentPosition > 0) {
      currentPosition = -extendedWidth + currentPosition;
    } else if (Math.abs(currentPosition) >= extendedWidth) {
      currentPosition = currentPosition % extendedWidth;
    }

    slider.style.transform = `translateX(${currentPosition}px)`;
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      slider.style.cursor = 'grab';
      slider.style.transition = '';

      if (Math.abs(currentPosition) >= totalWidth) {
        currentPosition = currentPosition % totalWidth;
      }

      isAutoScrollPaused = false;
      animationId = requestAnimationFrame(autoScroll);
    }
  });

  sliderContainer.addEventListener('mouseleave', function() {
    if (!isDragging) {
      animationId = requestAnimationFrame(autoScroll);
    }
  });

  slider.addEventListener('touchstart', function(e) {
    isDragging = true;
    isAutoScrollPaused = true;
    startX = e.touches[0].clientX;
    startPosition = currentPosition;
    cancelAnimationFrame(animationId);
    slider.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    currentPosition = startPosition + deltaX;

    const extendedWidth = totalWidth * 2;

    if (currentPosition > 0) {
      currentPosition = -extendedWidth + currentPosition;
    } else if (Math.abs(currentPosition) >= extendedWidth) {
      currentPosition = currentPosition % extendedWidth;
    }

    slider.style.transform = `translateX(${currentPosition}px)`;
  });

  document.addEventListener('touchend', function() {
    if (isDragging) {
      isDragging = false;
      slider.style.transition = '';

      if (Math.abs(currentPosition) >= totalWidth) {
        currentPosition = currentPosition % totalWidth;
      }

      isAutoScrollPaused = false;
      animationId = requestAnimationFrame(autoScroll);
    }
  });

  animationId = requestAnimationFrame(autoScroll);
});


const mobileMenuButton = document.querySelector('.mobile-menu-button');
const closeMenuButton = document.querySelector('.close-menu-mobile');
const headerNav = document.querySelector('.header-nav');
let isMenuOpen = false;

function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    headerNav.classList.add('show');
  } else {
    headerNav.classList.remove('show');
  }
}

function closeMobileMenu() {
  isMenuOpen = false;
  headerNav.classList.remove('show');
}

mobileMenuButton.addEventListener('click', toggleMobileMenu);
closeMenuButton.addEventListener('click', closeMobileMenu);

document.addEventListener('click', (e) => {
  if (isMenuOpen &&
      !headerNav.contains(e.target) &&
      !mobileMenuButton.contains(e.target)) {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    closeMobileMenu();
  }
});


// Скрипт модальных окон

document.addEventListener('DOMContentLoaded', function() {
  var modalButtons = document.querySelectorAll('.open-modal-dialog'),
      overlay = document.querySelector('body'),
      closeButtons = document.querySelectorAll('.modal-dialog .modal-close');

  var currentOpenModal = null;

  async function openModal(modalBtn) {
    return new Promise(resolve => {
      var modalId = modalBtn.getAttribute('data-src'),
          modalElem = document.querySelector('.modal-dialog.' + modalId);

      if (currentOpenModal && currentOpenModal !== modalElem) {
        closeModalDirectly(currentOpenModal);
      }

      overlay.classList.add('modal-open');
      modalElem.style.display = 'flex';

      setTimeout(function() {
        modalElem.classList.add('modal-opening');
        currentOpenModal = modalElem;
        resolve();
      }, 0);
    });
  }

  async function closeModal(closeBtn) {
    return new Promise(resolve => {
      var modal = closeBtn.closest('.modal-dialog');
      modal.classList.remove('modal-opening');
      modal.classList.add('modal-closing');

      setTimeout(function() {
        modal.classList.remove('modal-closing');
        modal.style.display = 'none';
        overlay.classList.remove('modal-open');
        if (currentOpenModal === modal) {
          currentOpenModal = null;
        }
        resolve();
      }, 500);
    });
  }

  function closeModalDirectly(modalElem) {
    modalElem.classList.remove('modal-opening');
    modalElem.style.display = 'none';

    if (currentOpenModal === modalElem) {
      currentOpenModal = null;
    }

    var anyModalOpen = document.querySelector('.modal-dialog[style*="display: flex"]');
    if (!anyModalOpen) {
      overlay.classList.remove('modal-open');
    }
  }

  /* open modal */
  modalButtons.forEach(function(modalBtn) {
    modalBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await openModal(modalBtn);
    });
  });

  /* close modal */
  closeButtons.forEach(function(closeBtn) {
    closeBtn.addEventListener('click', async function(e) {
      await closeModal(closeBtn);
    });
  });

  document.querySelectorAll('.modal-dialog').forEach(function(modal) {
    modal.addEventListener('click', async function(e) {
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody && !modalBody.contains(e.target)) {
        await closeModal(modal);
      }
    });
  });

});


document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  if (accordionItems) {
    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-item-header');
      const content = item.querySelector('.accordion-item-content');

      trigger.addEventListener('click', function() {
        const parent = this.parentNode;

        if (parent.classList.contains('active')) {
          parent.classList.remove('active');
          content.style.height = '0';
        } else {
          document.querySelectorAll('.accordion-item').forEach(child => {
            child.classList.remove('active');
            child.querySelector('.accordion-item-content').style.height = '0';
          });
          parent.classList.add('active');
          content.style.height = content.scrollHeight + 'px';
        }
      });
    });
  }
});


var swiper1 = new Swiper(".banner-slider-pc", {
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  watchSlidesProgress: true,
  slidesPerView: 1,
  spaceBetween: 0,
  effect: "fade",
  speed: 500,
  autoplay: {
    delay: 3000,
  },
  loop: true,
});

var swiper1 = new Swiper(".banner-slider-mobile", {
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  watchSlidesProgress: true,
  slidesPerView: 1,
  spaceBetween: 0,
  effect: "fade",
  speed: 500,
  autoplay: {
    delay: 3000,
  },
  loop: true,
});
