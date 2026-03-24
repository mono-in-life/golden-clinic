const scrollTop = document.querySelector(".scroll-top");

if (scrollTop) {
  function toggleScrollTopButton() {
    if (window.scrollY > 600) {
      scrollTop.style.opacity = "1";
      scrollTop.style.pointerEvents = "auto";
    } else {
      scrollTop.style.opacity = "0";
      scrollTop.style.pointerEvents = "none";
    }
  }

  toggleScrollTopButton();
  window.addEventListener("scroll", toggleScrollTopButton);

  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", function () {

  /* tabs */
  const tabSections = document.querySelectorAll('.tabs-section');

  tabSections.forEach((section) => {
    initTabs(section);
  });

  function initTabs(section) {
    const tabs = section.querySelectorAll('.tab');
    const tabContents = section.querySelectorAll('.tab-content');
    const tabsMobile = section.querySelector(".tabs-mobile");
    const buttonMore = section.querySelector('.button--more');
    const articlesContainer = section.querySelector('.articles__list');
    const articles = section.querySelectorAll('.article');
    const fotoContainer = section.querySelector('.gallery-page__list');
    const fotos = section.querySelectorAll('.gallery__slide');
    const reviewsContainer = section.querySelector('.reviews__list');
    const reviews = section.querySelectorAll('.review');
    const pricesContainer = section.querySelector('.prices__content');
    const prices = section.querySelectorAll('.prices__category');
    let itemsShown = 0;
    let sortedItems = [];

    // Открываем мобильные табы
    if (tabsMobile) {
      tabsMobile.addEventListener('click', () => {
        tabsMobile.classList.toggle("opened");
      });
    }

    // Обработчик на клик по табу
    if (tabs.length > 0) {
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', (event) => {

          const category = tabs[i].dataset.category;

          if (!tabs[i].classList.contains('active')) {
            tabs.forEach(tab => {
              tab.classList.remove('active');
            });
            tabs[i].classList.add('active');

            // Обнуляем переменные при переключении таба
            itemsShown = 0;
            sortedItems = [];

            // Если контейнеров нет, сортируем; если есть, просто переключаем табы
            if (tabContents.length === 0) {
              if (fotoContainer) sortingContent(category, fotos, 6);
              if (reviewsContainer) sortingContent(category, reviews, 6);
              if (pricesContainer) sortingContent(category, prices, prices.length);
            } else {
              openContent(category, tabContents);
            }
          }

          // Подставляем значение выбранного таба на мобилке
          if (window.matchMedia('(max-width: 768px)').matches) {
            tabsMobile.querySelector('span').textContent = tabs[i].dataset.name;
          }
        });
      }
    }

    // Переключаем контент табов
    function openContent(category, contents) {
      contents.forEach(content => {
        content.classList.remove('active');

        if (category == content.dataset.category) {
          content.classList.add('active');
        }
      })
    }

    // Сортируем элементы
    function sortingContent(data, items, step) {
      itemsShown = 0;
      sortedItems = [];
      items.forEach(item => item.classList.remove('active'));

      if (data == 'all') {
        sortedItems = Array.from(items);
      } else {
        sortedItems = Array.from(items).filter(item =>
          item.dataset.category === data
        );
      }

      for (let i = 0; i < Math.min(step, sortedItems.length); i++) {
        sortedItems[i].classList.add('active');
        itemsShown++
      }

      if (buttonMore) {
        if (itemsShown < step && !buttonMore.classList.contains('hidden')) {
          buttonMore.classList.add('hidden');
        } else if (itemsShown >= step && buttonMore.classList.contains('hidden')) {
          buttonMore.classList.remove('hidden');
        }
      }
    }

    // Обработчик клика по кнопке, определяем открывать или закрывать
    if (buttonMore) {
      buttonMore.addEventListener('click', () => {
        if (buttonMore.textContent === 'Смотреть ещё') {
          if (articlesContainer) openItems(articles, 6);
          if (reviewsContainer) openItems(reviews, 6);
          if (fotoContainer) openItems(fotos, 6);
        } else {
          if (articlesContainer) closeItems(articles, 6);
          if (reviewsContainer) closeItems(reviews, 6);
          if (fotoContainer) closeItems(fotos, 6);
        }
      });
    }

    // Открываем элементы
    function openItems(items, step) {
      if (sortedItems.length > 0) items = sortedItems;
      const allItems = items.length;

      if (buttonMore) {
        if (allItems <= step) {
          buttonMore.classList.add('hidden');
        } else {
          buttonMore.classList.remove('hidden');
          buttonMore.textContent = 'Смотреть ещё';
        }
      }

      for (let i = itemsShown; i < Math.min(itemsShown + step, allItems); i++) {
        items[i].classList.add('active');
      }

      itemsShown = Math.min(itemsShown + step, allItems);

      if (buttonMore && itemsShown == allItems) {
        buttonMore.textContent = 'Свернуть';
      }
    }

    // Скрываем элементы
    function closeItems(items, step) {
      if (sortedItems.length > 0) items = sortedItems;
      itemsShown = 0;
      items.forEach(item => item.classList.remove('active'));

      // Показываем минимум, обновляем кнопку, прокручиваем страницу вверх
      openItems(items, step);
      buttonMore.textContent = 'Смотреть ещё';
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Показываем первые элементы при загрузке страницы
    if (articlesContainer) openItems(articles, 6);
    if (reviewsContainer) openItems(reviews, 6);
    if (fotoContainer) openItems(fotos, 6);
    if (pricesContainer) openItems(prices, prices.length);
  }

  /* end tabs */

  Fancybox.bind("[data-fancybox]", {
    loop: true,
  });

  // Меню

  const body = document.body;
  const burger = document.querySelector(".header__burger");
  const headerMenu = document.querySelector(".header");

  const toggleMainMenu = (event) => {
    event.preventDefault();
    const link = event.currentTarget;
    const item = link.closest('.main-navigation__item');
    item.classList.toggle("opened");
  };

  const toggleSubMenu = (event) => {
    event.preventDefault();
    const sublink = event.currentTarget;
    sublink.classList.toggle("opened");
  };

  const onSubmenuListener = function () {
    const links = document.querySelectorAll(".main-navigation__link");
    links.forEach((link) => {
      link.addEventListener("click", toggleMainMenu);
    });

    const sublinks = document.querySelectorAll(".submenu__link");
    sublinks.forEach((sublink) => {
      sublink.addEventListener("click", toggleSubMenu);
    });
  };

  const offSubmenuListener = function () {
    const links = document.querySelectorAll(".main-navigation__link");
    links.forEach((link) => {
      link.removeEventListener("click", toggleMainMenu);
    });

    const sublinks = document.querySelectorAll(".submenu__link");
    sublinks.forEach((sublink) => {
      sublink.removeEventListener("click", toggleSubMenu);
    });
  };

  const onButtonClick = function () {
    if (burger.classList.contains("opened")) {
      headerMenu.classList.remove("opened");
      burger.classList.remove("opened");
      body.classList.remove("no-scroll");
      offSubmenuListener();
    } else {
      headerMenu.classList.add("opened");
      burger.classList.add("opened");
      body.classList.add("no-scroll");
      onSubmenuListener();
    }
  };

  burger.addEventListener("click", onButtonClick);

  // Popups
  function popupClose(popupActive) {
    popupActive.classList.remove("open");
    document.body.classList.remove("no-scroll");
    document.querySelector("html").removeAttribute("style");
    document.querySelector("header").removeAttribute("style");
  }
  const popupOpenBtns = document.querySelectorAll(".popup-btn");
  const popups = document.querySelectorAll(".popup");
  const closePopupBtns = document.querySelectorAll(".popup__close");
  const buttonBack = document.querySelector(".button-back");
  const popupBtnsOk = document.querySelectorAll(".button__ok");
  closePopupBtns.forEach(function (el) {
    el.addEventListener("click", function (e) {
      popupClose(e.target.closest(".popup"));
    });
  });
  buttonBack.addEventListener("click", function (e) {
    popupClose(e.target.closest(".popup"));
  });
  popupBtnsOk.forEach(function (el) {
    el.addEventListener("click", function (e) {
      popupClose(e.target.closest(".popup"));
    });
  });
  popupOpenBtns.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const path = e.currentTarget.dataset.path;
      const currentPopup = document.querySelector(`[data-target="${path}"]`);
      if (currentPopup) {
        popups.forEach(function (popup) {
          popupClose(popup);
          popup.addEventListener("click", function (e) {
            if (!e.target.closest(".popup__content")) {
              popupClose(e.target.closest(".popup"));
            }
          });
        });
        currentPopup.classList.add("open");
        document.querySelector("body").classList.add("no-scroll");
      }
    });
  });
  /* end popups */

  // sliders

  const breakpoint = window.matchMedia('(min-width: 1024px)');

  let features;
  let emergency;
  let education;

  const breakpointChecker = function () {
    if (breakpoint.matches === true) {
      if (features !== undefined) features.destroy(true, true);
      if (emergency !== undefined) emergency.destroy(true, true);
      if (education !== undefined) education.destroy(true, true);
      return
    } else if (breakpoint.matches === false) {
      enableFeatures();
      enableEmergency();
      enableEducation();
    }
  }

  const enableFeatures = function () {
    features = new Swiper('.features__slider', {
      watchOverflow: true,
      on: {
        resize: function () {
          features.update()
        }
      },
      breakpoints: {
        0: {
          slidesPerView: 1.1,
          spaceBetween: 10,
          pagination: {
            el: ".features__pagination",
            clickable: true,
          }
        },
        768: {
          slidesPerView: 2.1,
          spaceBetween: 10,
          pagination: {
            el: ".features__pagination",
            clickable: true,
          }
        }
      }
    })
  }

  const enableEducation = function () {
    education = new Swiper('.doctor-page__slider', {
      watchOverflow: true,
      on: {
        resize: function () {
          education.update()
        }
      },
      breakpoints: {
        0: {
          slidesPerView: 1.1,
          spaceBetween: 10,
          pagination: {
            el: ".doctor-page__pagination",
            clickable: true,
          }
        },
        768: {
          slidesPerView: 2.1,
          spaceBetween: 10,
          pagination: {
            el: ".doctor-page__pagination",
            clickable: true,
          }
        }
      }
    })
  }

  const enableEmergency = function () {
    emergency = new Swiper('.emergency__slider', {
      watchOverflow: true,
      on: {
        resize: function () {
          emergency.update()
        }
      },
      breakpoints: {
        0: {
          slidesPerView: 1.1,
          spaceBetween: 10,
          pagination: {
            el: ".emergency__pagination",
            clickable: true,
          }
        },
        600: {
          slidesPerView: 2.1,
          spaceBetween: 10,
          pagination: {
            el: ".emergency__pagination",
            clickable: true,
          }
        }
      }
    })
  }

  breakpointChecker()
  breakpoint.addEventListener('change', breakpointChecker);

  const reviewsSliderCheck = document.querySelector(".reviews__slider");
  if (reviewsSliderCheck) {
    const swiperReviews = new Swiper(".reviews__slider", {
      navigation: {
        nextEl: ".reviews-slider__navigation .swiper-button-next",
        prevEl: ".reviews-slider__navigation .swiper-button-prev",
      },
      pagination: {
        el: ".reviews__pagination",
        clickable: true,
      },
      slidesPerView: 1.1,
      spaceBetween: 10,
      loop: false,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1023: {
          slidesPerView: 2,
          pagination: false
        },
      },
    });
  }


  // Слайдер докторов (перенести при натяжке в компонент, чтобы заполнить массив)
  const doctorNames = ["Константинопольский Константин Константинович", "Иванова Анастасия Сергеевна", "Иванова Анастасия Сергеевна", "Иванова Анастасия Сергеевна", "Иванова Анастасия Сергеевна"]

  const doctorsSliderCheck = document.querySelector(".doctors__slider");
  if (doctorsSliderCheck) {
    const swiperDoctors = new Swiper(".doctors__slider", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: '.doctors__pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + doctorNames[index] + '</span>';
        }
      },
      slidesPerView: 1,
    });

    const slides = document.querySelectorAll('.doctor');

    swiperDoctors.on('slideChange', function (swiper) {
      const realIndex = swiper.realIndex;
      updateBigSlide(realIndex);
    });

    function updateBigSlide(index) {
      const slide = slides[index];
      const img = slide.querySelector('picture');
      const bigImg = document.querySelector('.doctors__big-img');

      if (img && bigImg) {
        bigImg.innerHTML = '';
        const imgClone = img.cloneNode(true);
        bigImg.appendChild(imgClone);
      }
    }

    updateBigSlide(0);
  }

  const documentsSliderCheck = document.querySelector(".documents__slider");
  if (documentsSliderCheck) {
    const swiperDocuments = new Swiper(".documents__slider", {
      navigation: {
        nextEl: ".documents-slider__navigation .swiper-button-next",
        prevEl: ".documents-slider__navigation .swiper-button-prev",
      },
      pagination: {
        el: ".documents__pagination",
        clickable: true,
      },
      slidesPerView: 1.1,
      spaceBetween: 10,
      breakpoints: {
        768: {
          slidesPerView: 2,
          pagination: false
      },
        1023: {
          slidesPerView: 3,
          pagination: false
        },
      },
    });
  }

  const gallerySliderCheck = document.querySelector(".gallery__slider");
  if (gallerySliderCheck) {
    const swiperGallery = new Swiper(".gallery__slider", {
      navigation: {
        nextEl: ".gallery-slider__navigation .swiper-button-next",
        prevEl: ".gallery-slider__navigation .swiper-button-prev",
      },
      pagination: {
        el: ".gallery__pagination",
        clickable: true,
      },
      slidesPerView: 1.1,
      spaceBetween: 20,
      breakpoints: {
        768: {
          slidesPerView: 2,
          pagination: false
        },
      },
    });
  }

  // end sliders

  // Поиск по сайту

  const searchForms = document.querySelectorAll(".search");
  const popupCities = document.querySelector('.popup__bottom');

  searchForms.forEach(searchForm => {
    const input = searchForm.querySelector(".search__input");
    const results = searchForm.querySelector(".search__wrapper");

    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        results.classList.add("active");
        if (popupCities) {
          popupCities.classList.add('hidden');
        }
      } else {
        results.classList.remove("active");
        if (popupCities) {
          popupCities.classList.remove('hidden');
        }
      }
    });
  })

    /* yandex map */
  const map = document.querySelectorAll('#map');
  let mapInitialized = false;

  if (map.length > 0) {
    function onEntryMap(e) {
      e.forEach(e => {
        if (e.isIntersecting && !mapInitialized) {
          loadMap();
        }
      })
    }
    let options = {
      threshold: [0.5],
    },
      observer = new IntersectionObserver(onEntryMap, options)
    for (let e of map) observer.observe(e)
  }

  function loadMap() {
    if (!document.querySelector('[src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }

  function initMap() {
    if (mapInitialized) return;
    mapInitialized = true;

    ymaps.ready(function () {
      try {
        const myMap = new ymaps.Map('map', {
          center: [55.033548, 82.902050],
          zoom: 14,
          controls: ['zoomControl']
        });

        const myPlacemark = new ymaps.Placemark(
          [55.033548, 82.902050], {
          hintContent: 'г. Новосибирск, ул. Ленина, д. 25',
          balloonContent: 'г. Новосибирск, ул. Ленина, д. 25'
        }, {
          iconLayout: 'default#image',
          iconImageHref: '/assets/img/icons/map.svg',
          iconImageSize: [40, 40],
          iconImageOffset: [-10.5, -26]
        }
        );

        myMap.geoObjects.add(myPlacemark);
        myMap.behaviors.disable(['scrollZoom']);
      } catch (e) {
        console.error('Ошибка инициализации карты:', e);
      }
    });
  }


  // Поиск по ценам

  const pricesSearch = document.querySelector('.search--prices');

  if (pricesSearch) {
    const searchInput = pricesSearch.querySelector('.search__input');
    const searchWrapper = pricesSearch.querySelector('.search__wrapper');
    const searchList = pricesSearch.querySelector('.search__list');
    const errorWrapper = pricesSearch.querySelector('.search__wrapper--error');

    // Отменяем отправку формы
    pricesSearch.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    function scrollToElement(element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }

    // Поиск при вводе
    searchInput.addEventListener('input', function () {
      const searchValue = this.value.toLowerCase().trim();

      document.querySelectorAll('.prices__item .title-small').forEach(price => {
        price.classList.remove('selected');
      });

      if (!searchValue) {
        searchWrapper.classList.remove('active');
        errorWrapper.classList.remove('active');
        return;
      }

      const allPrices = document.querySelectorAll('.prices__item .title-small');
      const results = [];

      allPrices.forEach(price => {
        // Сохраняем цену
        if (price.textContent.toLowerCase().includes(searchValue)) {
          price.classList.add('selected');
          results.push(price);
        }
      });

      searchList.innerHTML = '';

      if (results.length) {
        searchWrapper.classList.add('active');
        errorWrapper.classList.remove('active');

        results.forEach(result => {
          const listItem = document.createElement('li');
          listItem.textContent = result.textContent;

          listItem.addEventListener('click', () => {
            scrollToElement(result);
          });

          searchList.appendChild(listItem);
        });
      } else {
        searchWrapper.classList.remove('active');
        errorWrapper.classList.add('active');
      }
    });
  }

  // Содержание
  const textNavigation = document.querySelector('.text-content__nav');
  if (textNavigation) {
    const headers = document.querySelectorAll('.text-content__wrapper h2, .text-content__wrapper h3');

    if (headers.length > 0) {
      const textNavigationList = textNavigation.querySelector('ul');
      textNavigationList.innerHTML = '';

      for (let i = 0; i < headers.length; i += 1) {
        const header = headers[i];
        const titleBlock = header.textContent;
        const textNavigationItem = document.createElement('li');
        const textNavigationLink = document.createElement('a');

        // Присваиваем ID
        const id = 'top-' + (i + 1);
        header.setAttribute('id', id);

        textNavigationLink.setAttribute('href', `#${id}`);
        textNavigationLink.textContent = titleBlock;
        textNavigationItem.append(textNavigationLink);
        textNavigationList.append(textNavigationItem);
      }

      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const href = this.getAttribute('href').substring(1);
          const scrollTarget = document.getElementById(href);

          if (scrollTarget) {
            const topOffset = 280;
            const elementPosition = scrollTarget.getBoundingClientRect().top;
            const offsetPosition = elementPosition - topOffset;

            window.scrollBy({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  }

  //  Анимация

  const animationItems = document.querySelectorAll(".animation-item");
  if (animationItems.length > 0) {
    function onEntry(e) {
      e.forEach((e) => {
        e.isIntersecting && e.target.classList.add("animation-active");
      });
    }
    let options = {
      threshold: [0.5],
    },
      observer = new IntersectionObserver(onEntry, options);
    for (let e of animationItems) observer.observe(e);
  }

  // Куки

  if (Number(localStorage.getItem("cookie-checker")) != 1) {
    const infoAlert = document.createElement("div");
    const okBtn = document.createElement("button");
    okBtn.innerText = "Принять";
    infoAlert.classList.add("cookie-block");
    infoAlert.innerHTML =
      '<p>Этот сайт использует файлы cookies для более комфортной работы пользователя. К сайту подключен сервис Яндекс.Метрика. Продолжая просмотр страниц сайта, вы соглашаетесь на обработку персональных данных в соответствии с <a href="/politika-obrabotki-i-zashchity-personalnyh-dannyh/">Политикой обработки и защиты персональных данных</a>, <a href="/polzovatelskoe-soglashenie/">Пользовательским соглашением</a>, <a href="/soglasie-na-obrabotku-personalnyh-dannyh-yandexmetrika/">Согласием на обработку персональных данных с помощью Яндекс.Метрика</a>.</p>';
    infoAlert.appendChild(okBtn);

    okBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.setItem("cookie-checker", "1");
      infoAlert.classList.add("accepted");
      setTimeout(function () {
        document.querySelector(".cookie-block").remove();
      }, 1000);
    });

    document.body.appendChild(infoAlert);
  }

})
