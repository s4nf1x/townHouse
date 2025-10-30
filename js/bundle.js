/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 145:
/***/ (() => {

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
document.addEventListener('DOMContentLoaded', function () {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
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
document.addEventListener('DOMContentLoaded', function () {
  const sliderContainer = document.querySelector('.images-slider-container');
  const slider = document.querySelector('.images-slider');
  const images = slider.querySelectorAll('img');
  const imageCount = images.length;
  const imageWidth = 300;
  const scrollSpeedSeconds = 20;
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

    // Если автопрокрутка на паузе - не обновляем анимацию
    if (isAutoScrollPaused) {
      lastTimestamp = timestamp; // Важно: обновляем временную метку даже на паузе
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
  slider.addEventListener('mousedown', function (e) {
    isDragging = true;
    isAutoScrollPaused = true;
    startX = e.clientX;
    startPosition = currentPosition;
    cancelAnimationFrame(animationId);
    slider.style.cursor = 'grabbing';
    slider.style.transition = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', function (e) {
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
  document.addEventListener('mouseup', function () {
    if (isDragging) {
      isDragging = false;
      slider.style.cursor = 'grab';
      slider.style.transition = '';
      if (Math.abs(currentPosition) >= totalWidth) {
        currentPosition = currentPosition % totalWidth;
      }

      // ВАЖНО: не сбрасываем lastTimestamp здесь
      // Вместо этого запрашиваем новый кадр и обновим lastTimestamp в autoScroll
      isAutoScrollPaused = false;
      animationId = requestAnimationFrame(autoScroll);
    }
  });
  sliderContainer.addEventListener('mouseleave', function () {
    if (!isDragging) {
      animationId = requestAnimationFrame(autoScroll);
    }
  });

  // Добавляем обработчики для touch событий
  slider.addEventListener('touchstart', function (e) {
    isDragging = true;
    isAutoScrollPaused = true;
    startX = e.touches[0].clientX;
    startPosition = currentPosition;
    cancelAnimationFrame(animationId);
    slider.style.transition = 'none';
    e.preventDefault();
  });
  document.addEventListener('touchmove', function (e) {
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
  document.addEventListener('touchend', function () {
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

  // Запускаем автопрокрутку
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
document.addEventListener('click', e => {
  if (isMenuOpen && !headerNav.contains(e.target) && !mobileMenuButton.contains(e.target)) {
    closeMobileMenu();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && isMenuOpen) {
    closeMobileMenu();
  }
});

// Скрипт модальных окон

document.addEventListener('DOMContentLoaded', function () {
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
      setTimeout(function () {
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
      setTimeout(function () {
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
  modalButtons.forEach(function (modalBtn) {
    modalBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      await openModal(modalBtn);
    });
  });

  /* close modal */
  closeButtons.forEach(function (closeBtn) {
    closeBtn.addEventListener('click', async function (e) {
      await closeModal(closeBtn);
    });
  });
  document.querySelectorAll('.modal-dialog').forEach(function (modal) {
    modal.addEventListener('click', async function (e) {
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody && !modalBody.contains(e.target)) {
        await closeModal(modal);
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems) {
    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-item-header');
      const content = item.querySelector('.accordion-item-content');
      trigger.addEventListener('click', function () {
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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(145);
/* harmony import */ var _script__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_script__WEBPACK_IMPORTED_MODULE_0__);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzhDLE1BQU0sR0FBRyxHQUFHO1FBQzVCLENBQUMsTUFBTTtVQUNML0YsUUFBUSxDQUFDVSxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDQyxPQUFPLENBQUNxRixLQUFLLElBQUk7WUFDNURBLEtBQUssQ0FBQzNGLFNBQVMsQ0FBQ0UsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNoQ3lGLEtBQUssQ0FBQy9GLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDZ0QsS0FBSyxDQUFDOEMsTUFBTSxHQUFHLEdBQUc7VUFDbkUsQ0FBQyxDQUFDO1VBQ0ZGLE1BQU0sQ0FBQ3hGLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztVQUM5QnNGLE9BQU8sQ0FBQzNDLEtBQUssQ0FBQzhDLE1BQU0sR0FBR0gsT0FBTyxDQUFDSyxZQUFZLEdBQUcsSUFBSTtRQUNwRDtNQUNGLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztFQUNKO0FBQ0YsQ0FBQyxDQUFDOzs7Ozs7VUNqV0Y7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stcHJvamVjdC8uL3NvdXJjZS9qcy9zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1wcm9qZWN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2stcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly93ZWJwYWNrLXByb2plY3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYnBhY2stcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYnBhY2stcHJvamVjdC8uL3NvdXJjZS9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkZXInKTtcclxuXHJcbmlmIChoZWFkZXIpIHtcclxuICBjb25zdCB0b2dnbGVTY3JvbGxlZENsYXNzID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID4gMCkge1xyXG4gICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnc2Nyb2xsZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGxlZCcpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0b2dnbGVTY3JvbGxlZENsYXNzKTtcclxuICB0b2dnbGVTY3JvbGxlZENsYXNzKCk7XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICBjb25zdCBhbmNob3JMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl49XCIjXCJdJyk7XHJcblxyXG4gIGFuY2hvckxpbmtzLmZvckVhY2gobGluayA9PiB7XHJcbiAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zdCBocmVmID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuXHJcbiAgICAgIGlmIChocmVmID09PSAnIycpIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGhyZWYpO1xyXG5cclxuICAgICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IDIwMDsgLy8g0J7RgtGB0YLRg9C/INCyINC/0LjQutGB0LXQu9GP0YVcclxuICAgICAgICBjb25zdCBlbGVtZW50UG9zaXRpb24gPSB0YXJnZXRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICBjb25zdCBvZmZzZXRQb3NpdGlvbiA9IGVsZW1lbnRQb3NpdGlvbiArIHdpbmRvdy5wYWdlWU9mZnNldCAtIG9mZnNldDtcclxuXHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKHtcclxuICAgICAgICAgIHRvcDogb2Zmc2V0UG9zaXRpb24sXHJcbiAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICBjb25zdCBzbGlkZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VzLXNsaWRlci1jb250YWluZXInKTtcclxuICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW1hZ2VzLXNsaWRlcicpO1xyXG4gIGNvbnN0IGltYWdlcyA9IHNsaWRlci5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKTtcclxuICBjb25zdCBpbWFnZUNvdW50ID0gaW1hZ2VzLmxlbmd0aDtcclxuICBjb25zdCBpbWFnZVdpZHRoID0gMzAwO1xyXG5cclxuICBjb25zdCBzY3JvbGxTcGVlZFNlY29uZHMgPSAyMDtcclxuXHJcbiAgY29uc3QgdG90YWxXaWR0aCA9IGltYWdlQ291bnQgKiBpbWFnZVdpZHRoO1xyXG4gIGNvbnN0IHBpeGVsc1BlclNlY29uZCA9IHRvdGFsV2lkdGggLyBzY3JvbGxTcGVlZFNlY29uZHM7XHJcblxyXG4gIGxldCBjdXJyZW50UG9zaXRpb24gPSAwO1xyXG4gIGxldCBhbmltYXRpb25JZDtcclxuICBsZXQgbGFzdFRpbWVzdGFtcCA9IDA7XHJcbiAgbGV0IGlzQXV0b1Njcm9sbFBhdXNlZCA9IGZhbHNlO1xyXG5cclxuICBpbWFnZXMuZm9yRWFjaChpbWcgPT4ge1xyXG4gICAgY29uc3QgY2xvbmUgPSBpbWcuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgc2xpZGVyLmFwcGVuZENoaWxkKGNsb25lKTtcclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gYXV0b1Njcm9sbCh0aW1lc3RhbXApIHtcclxuICAgIGlmICghbGFzdFRpbWVzdGFtcCkge1xyXG4gICAgICBsYXN0VGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICBhbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhdXRvU2Nyb2xsKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCV0YHQu9C4INCw0LLRgtC+0L/RgNC+0LrRgNGD0YLQutCwINC90LAg0L/QsNGD0LfQtSAtINC90LUg0L7QsdC90L7QstC70Y/QtdC8INCw0L3QuNC80LDRhtC40Y5cclxuICAgIGlmIChpc0F1dG9TY3JvbGxQYXVzZWQpIHtcclxuICAgICAgbGFzdFRpbWVzdGFtcCA9IHRpbWVzdGFtcDsgLy8g0JLQsNC20L3Qvjog0L7QsdC90L7QstC70Y/QtdC8INCy0YDQtdC80LXQvdC90YPRjiDQvNC10YLQutGDINC00LDQttC1INC90LAg0L/QsNGD0LfQtVxyXG4gICAgICBhbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhdXRvU2Nyb2xsKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRlbHRhVGltZSA9IHRpbWVzdGFtcCAtIGxhc3RUaW1lc3RhbXA7XHJcbiAgICBsYXN0VGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG5cclxuICAgIGN1cnJlbnRQb3NpdGlvbiAtPSBwaXhlbHNQZXJTZWNvbmQgKiAoZGVsdGFUaW1lIC8gMTAwMCk7XHJcblxyXG4gICAgaWYgKE1hdGguYWJzKGN1cnJlbnRQb3NpdGlvbikgPj0gdG90YWxXaWR0aCkge1xyXG4gICAgICBjdXJyZW50UG9zaXRpb24gKz0gdG90YWxXaWR0aDtcclxuXHJcbiAgICAgIHNsaWRlci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnO1xyXG4gICAgICBzbGlkZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtjdXJyZW50UG9zaXRpb259cHgpYDtcclxuXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgc2xpZGVyLnN0eWxlLnRyYW5zaXRpb24gPSAnJztcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzbGlkZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtjdXJyZW50UG9zaXRpb259cHgpYDtcclxuICAgIH1cclxuXHJcbiAgICBhbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhdXRvU2Nyb2xsKTtcclxuICB9XHJcblxyXG4gIGxldCBpc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgbGV0IHN0YXJ0WDtcclxuICBsZXQgc3RhcnRQb3NpdGlvbjtcclxuXHJcbiAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgaXNBdXRvU2Nyb2xsUGF1c2VkID0gdHJ1ZTtcclxuICAgIHN0YXJ0WCA9IGUuY2xpZW50WDtcclxuICAgIHN0YXJ0UG9zaXRpb24gPSBjdXJyZW50UG9zaXRpb247XHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25JZCk7XHJcbiAgICBzbGlkZXIuc3R5bGUuY3Vyc29yID0gJ2dyYWJiaW5nJztcclxuICAgIHNsaWRlci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnO1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH0pO1xyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAoIWlzRHJhZ2dpbmcpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBkZWx0YVggPSBlLmNsaWVudFggLSBzdGFydFg7XHJcbiAgICBjdXJyZW50UG9zaXRpb24gPSBzdGFydFBvc2l0aW9uICsgZGVsdGFYO1xyXG5cclxuICAgIGNvbnN0IGV4dGVuZGVkV2lkdGggPSB0b3RhbFdpZHRoICogMjtcclxuXHJcbiAgICBpZiAoY3VycmVudFBvc2l0aW9uID4gMCkge1xyXG4gICAgICBjdXJyZW50UG9zaXRpb24gPSAtZXh0ZW5kZWRXaWR0aCArIGN1cnJlbnRQb3NpdGlvbjtcclxuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoY3VycmVudFBvc2l0aW9uKSA+PSBleHRlbmRlZFdpZHRoKSB7XHJcbiAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IGN1cnJlbnRQb3NpdGlvbiAlIGV4dGVuZGVkV2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7Y3VycmVudFBvc2l0aW9ufXB4KWA7XHJcbiAgfSk7XHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbigpIHtcclxuICAgIGlmIChpc0RyYWdnaW5nKSB7XHJcbiAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgc2xpZGVyLnN0eWxlLmN1cnNvciA9ICdncmFiJztcclxuICAgICAgc2xpZGVyLnN0eWxlLnRyYW5zaXRpb24gPSAnJztcclxuXHJcbiAgICAgIGlmIChNYXRoLmFicyhjdXJyZW50UG9zaXRpb24pID49IHRvdGFsV2lkdGgpIHtcclxuICAgICAgICBjdXJyZW50UG9zaXRpb24gPSBjdXJyZW50UG9zaXRpb24gJSB0b3RhbFdpZHRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyDQktCQ0JbQndCeOiDQvdC1INGB0LHRgNCw0YHRi9Cy0LDQtdC8IGxhc3RUaW1lc3RhbXAg0LfQtNC10YHRjFxyXG4gICAgICAvLyDQktC80LXRgdGC0L4g0Y3RgtC+0LPQviDQt9Cw0L/RgNCw0YjQuNCy0LDQtdC8INC90L7QstGL0Lkg0LrQsNC00YAg0Lgg0L7QsdC90L7QstC40LwgbGFzdFRpbWVzdGFtcCDQsiBhdXRvU2Nyb2xsXHJcbiAgICAgIGlzQXV0b1Njcm9sbFBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICBhbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhdXRvU2Nyb2xsKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgc2xpZGVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgIGlmICghaXNEcmFnZ2luZykge1xyXG4gICAgICBhbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhdXRvU2Nyb2xsKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC60Lgg0LTQu9GPIHRvdWNoINGB0L7QsdGL0YLQuNC5XHJcbiAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcclxuICAgIGlzQXV0b1Njcm9sbFBhdXNlZCA9IHRydWU7XHJcbiAgICBzdGFydFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgIHN0YXJ0UG9zaXRpb24gPSBjdXJyZW50UG9zaXRpb247XHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25JZCk7XHJcbiAgICBzbGlkZXIuc3R5bGUudHJhbnNpdGlvbiA9ICdub25lJztcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKCFpc0RyYWdnaW5nKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZGVsdGFYID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBzdGFydFg7XHJcbiAgICBjdXJyZW50UG9zaXRpb24gPSBzdGFydFBvc2l0aW9uICsgZGVsdGFYO1xyXG5cclxuICAgIGNvbnN0IGV4dGVuZGVkV2lkdGggPSB0b3RhbFdpZHRoICogMjtcclxuXHJcbiAgICBpZiAoY3VycmVudFBvc2l0aW9uID4gMCkge1xyXG4gICAgICBjdXJyZW50UG9zaXRpb24gPSAtZXh0ZW5kZWRXaWR0aCArIGN1cnJlbnRQb3NpdGlvbjtcclxuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoY3VycmVudFBvc2l0aW9uKSA+PSBleHRlbmRlZFdpZHRoKSB7XHJcbiAgICAgIGN1cnJlbnRQb3NpdGlvbiA9IGN1cnJlbnRQb3NpdGlvbiAlIGV4dGVuZGVkV2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgc2xpZGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7Y3VycmVudFBvc2l0aW9ufXB4KWA7XHJcbiAgfSk7XHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoaXNEcmFnZ2luZykge1xyXG4gICAgICBpc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgIHNsaWRlci5zdHlsZS50cmFuc2l0aW9uID0gJyc7XHJcblxyXG4gICAgICBpZiAoTWF0aC5hYnMoY3VycmVudFBvc2l0aW9uKSA+PSB0b3RhbFdpZHRoKSB7XHJcbiAgICAgICAgY3VycmVudFBvc2l0aW9uID0gY3VycmVudFBvc2l0aW9uICUgdG90YWxXaWR0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaXNBdXRvU2Nyb2xsUGF1c2VkID0gZmFsc2U7XHJcbiAgICAgIGFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGF1dG9TY3JvbGwpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyDQl9Cw0L/Rg9GB0LrQsNC10Lwg0LDQstGC0L7Qv9GA0L7QutGA0YPRgtC60YNcclxuICBhbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhdXRvU2Nyb2xsKTtcclxufSk7XHJcblxyXG5cclxuY29uc3QgbW9iaWxlTWVudUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2JpbGUtbWVudS1idXR0b24nKTtcclxuY29uc3QgY2xvc2VNZW51QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsb3NlLW1lbnUtbW9iaWxlJyk7XHJcbmNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXItbmF2Jyk7XHJcbmxldCBpc01lbnVPcGVuID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVNb2JpbGVNZW51KCkge1xyXG4gIGlzTWVudU9wZW4gPSAhaXNNZW51T3BlbjtcclxuXHJcbiAgaWYgKGlzTWVudU9wZW4pIHtcclxuICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGhlYWRlck5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZU1vYmlsZU1lbnUoKSB7XHJcbiAgaXNNZW51T3BlbiA9IGZhbHNlO1xyXG4gIGhlYWRlck5hdi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbn1cclxuXHJcbm1vYmlsZU1lbnVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVNb2JpbGVNZW51KTtcclxuY2xvc2VNZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2JpbGVNZW51KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICBpZiAoaXNNZW51T3BlbiAmJlxyXG4gICAgIWhlYWRlck5hdi5jb250YWlucyhlLnRhcmdldCkgJiZcclxuICAgICFtb2JpbGVNZW51QnV0dG9uLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgY2xvc2VNb2JpbGVNZW51KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG4gIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgaXNNZW51T3Blbikge1xyXG4gICAgY2xvc2VNb2JpbGVNZW51KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG4vLyDQodC60YDQuNC/0YIg0LzQvtC00LDQu9GM0L3Ri9GFINC+0LrQvtC9XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIG1vZGFsQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcGVuLW1vZGFsLWRpYWxvZycpLFxyXG4gICAgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSxcclxuICAgIGNsb3NlQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1kaWFsb2cgLm1vZGFsLWNsb3NlJyk7XHJcblxyXG4gIHZhciBjdXJyZW50T3Blbk1vZGFsID0gbnVsbDtcclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gb3Blbk1vZGFsKG1vZGFsQnRuKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIHZhciBtb2RhbElkID0gbW9kYWxCdG4uZ2V0QXR0cmlidXRlKCdkYXRhLXNyYycpLFxyXG4gICAgICAgIG1vZGFsRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kaWFsb2cuJyArIG1vZGFsSWQpO1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnRPcGVuTW9kYWwgJiYgY3VycmVudE9wZW5Nb2RhbCAhPT0gbW9kYWxFbGVtKSB7XHJcbiAgICAgICAgY2xvc2VNb2RhbERpcmVjdGx5KGN1cnJlbnRPcGVuTW9kYWwpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvdmVybGF5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgbW9kYWxFbGVtLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG1vZGFsRWxlbS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuaW5nJyk7XHJcbiAgICAgICAgY3VycmVudE9wZW5Nb2RhbCA9IG1vZGFsRWxlbTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBjbG9zZU1vZGFsKGNsb3NlQnRuKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgIHZhciBtb2RhbCA9IGNsb3NlQnRuLmNsb3Nlc3QoJy5tb2RhbC1kaWFsb2cnKTtcclxuICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbmluZycpO1xyXG4gICAgICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1jbG9zaW5nJyk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLWNsb3NpbmcnKTtcclxuICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgICAgIGlmIChjdXJyZW50T3Blbk1vZGFsID09PSBtb2RhbCkge1xyXG4gICAgICAgICAgY3VycmVudE9wZW5Nb2RhbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgNTAwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xvc2VNb2RhbERpcmVjdGx5KG1vZGFsRWxlbSkge1xyXG4gICAgbW9kYWxFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW5pbmcnKTtcclxuICAgIG1vZGFsRWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cclxuICAgIGlmIChjdXJyZW50T3Blbk1vZGFsID09PSBtb2RhbEVsZW0pIHtcclxuICAgICAgY3VycmVudE9wZW5Nb2RhbCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFueU1vZGFsT3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kaWFsb2dbc3R5bGUqPVwiZGlzcGxheTogZmxleFwiXScpO1xyXG4gICAgaWYgKCFhbnlNb2RhbE9wZW4pIHtcclxuICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiBvcGVuIG1vZGFsICovXHJcbiAgbW9kYWxCdXR0b25zLmZvckVhY2goZnVuY3Rpb24obW9kYWxCdG4pIHtcclxuICAgIG1vZGFsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGF3YWl0IG9wZW5Nb2RhbChtb2RhbEJ0bik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLyogY2xvc2UgbW9kYWwgKi9cclxuICBjbG9zZUJ1dHRvbnMuZm9yRWFjaChmdW5jdGlvbihjbG9zZUJ0bikge1xyXG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGF3YWl0IGNsb3NlTW9kYWwoY2xvc2VCdG4pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1kaWFsb2cnKS5mb3JFYWNoKGZ1bmN0aW9uKG1vZGFsKSB7XHJcbiAgICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc3QgbW9kYWxCb2R5ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWJvZHknKTtcclxuICAgICAgaWYgKG1vZGFsQm9keSAmJiAhbW9kYWxCb2R5LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xyXG4gICAgICAgIGF3YWl0IGNsb3NlTW9kYWwobW9kYWwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbn0pO1xyXG5cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuICBjb25zdCBhY2NvcmRpb25JdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24taXRlbScpO1xyXG5cclxuICBpZiAoYWNjb3JkaW9uSXRlbXMpIHtcclxuICAgIGFjY29yZGlvbkl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb24taXRlbS1oZWFkZXInKTtcclxuICAgICAgY29uc3QgY29udGVudCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnKTtcclxuXHJcbiAgICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XHJcblxyXG4gICAgICAgIGlmIChwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgcGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgY29udGVudC5zdHlsZS5oZWlnaHQgPSAnMCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24taXRlbScpLmZvckVhY2goY2hpbGQgPT4ge1xyXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgY2hpbGQucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnKS5zdHlsZS5oZWlnaHQgPSAnMCc7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHBhcmVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICAgIGNvbnRlbnQuc3R5bGUuaGVpZ2h0ID0gY29udGVudC5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiXG5pbXBvcnQgJy4vc2NyaXB0JztcbiJdLCJuYW1lcyI6WyJoZWFkZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ0b2dnbGVTY3JvbGxlZENsYXNzIiwid2luZG93Iiwic2Nyb2xsWSIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJhbmNob3JMaW5rcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwibGluayIsImUiLCJocmVmIiwiZ2V0QXR0cmlidXRlIiwidGFyZ2V0RWxlbWVudCIsInByZXZlbnREZWZhdWx0Iiwib2Zmc2V0IiwiZWxlbWVudFBvc2l0aW9uIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwib2Zmc2V0UG9zaXRpb24iLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvIiwiYmVoYXZpb3IiLCJzbGlkZXJDb250YWluZXIiLCJzbGlkZXIiLCJpbWFnZXMiLCJpbWFnZUNvdW50IiwibGVuZ3RoIiwiaW1hZ2VXaWR0aCIsInNjcm9sbFNwZWVkU2Vjb25kcyIsInRvdGFsV2lkdGgiLCJwaXhlbHNQZXJTZWNvbmQiLCJjdXJyZW50UG9zaXRpb24iLCJhbmltYXRpb25JZCIsImxhc3RUaW1lc3RhbXAiLCJpc0F1dG9TY3JvbGxQYXVzZWQiLCJpbWciLCJjbG9uZSIsImNsb25lTm9kZSIsImFwcGVuZENoaWxkIiwiYXV0b1Njcm9sbCIsInRpbWVzdGFtcCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImRlbHRhVGltZSIsIk1hdGgiLCJhYnMiLCJzdHlsZSIsInRyYW5zaXRpb24iLCJ0cmFuc2Zvcm0iLCJpc0RyYWdnaW5nIiwic3RhcnRYIiwic3RhcnRQb3NpdGlvbiIsImNsaWVudFgiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImN1cnNvciIsImRlbHRhWCIsImV4dGVuZGVkV2lkdGgiLCJ0b3VjaGVzIiwibW9iaWxlTWVudUJ1dHRvbiIsImNsb3NlTWVudUJ1dHRvbiIsImhlYWRlck5hdiIsImlzTWVudU9wZW4iLCJ0b2dnbGVNb2JpbGVNZW51IiwiY2xvc2VNb2JpbGVNZW51IiwiY29udGFpbnMiLCJ0YXJnZXQiLCJrZXkiLCJtb2RhbEJ1dHRvbnMiLCJvdmVybGF5IiwiY2xvc2VCdXR0b25zIiwiY3VycmVudE9wZW5Nb2RhbCIsIm9wZW5Nb2RhbCIsIm1vZGFsQnRuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJtb2RhbElkIiwibW9kYWxFbGVtIiwiY2xvc2VNb2RhbERpcmVjdGx5IiwiZGlzcGxheSIsInNldFRpbWVvdXQiLCJjbG9zZU1vZGFsIiwiY2xvc2VCdG4iLCJtb2RhbCIsImNsb3Nlc3QiLCJhbnlNb2RhbE9wZW4iLCJtb2RhbEJvZHkiLCJhY2NvcmRpb25JdGVtcyIsIml0ZW0iLCJ0cmlnZ2VyIiwiY29udGVudCIsInBhcmVudCIsInBhcmVudE5vZGUiLCJoZWlnaHQiLCJjaGlsZCIsInNjcm9sbEhlaWdodCJdLCJzb3VyY2VSb290IjoiIn0=