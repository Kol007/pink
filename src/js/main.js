'use strict';

function ready() {
  svg4everybody();

  var header          = document.querySelector('.page-header');
  var menuOpenButton  = document.querySelector('.page-menu__burger-wrapper');
  var menuItems       = document.querySelectorAll('.page-menu__link');

  menuOpenButton.addEventListener('click', function( event ) {
    toggleMobileMenu();
  });

  [].forEach.call( menuItems, function(el) {
    console.log(el);
    el.addEventListener('click', function( event ) {
      toggleMobileMenu();
    });
  } );

  toggleMobileMenu();

  var sliderReviews = Peppermint(document.getElementById('reviews__slider') , {
    dots: true,
    slideshow: false,
    speed: 500,
    slideshowInterval: 5000,
    stopSlideshowAfterInteraction: true,

    dotsContainer: document.getElementById('reviews__slider-dots'),
  });

  var rightArr = document.querySelector('.reviews__slider-arrows--right');
  var leftArr = document.querySelector('.reviews__slider-arrows--left');

  rightArr.addEventListener('click', sliderReviews.next, false);
  leftArr.addEventListener('click', sliderReviews.prev, false);


  // Navbar scrollSpy
  gumshoe.init({
    activeClass: 'page-menu__item--active'
  });

  var priceSlide1 = document.querySelector('.price__slide-1'),
      priceSlide2 = document.querySelector('.price__slide-2'),
      priceSlide3 = document.querySelector('.price__slide-3');

  var slidesPrice = [
    priceSlide1,
    priceSlide2,
    priceSlide3
  ];

  var sliderPrice = Peppermint(document.querySelector('.price__mobile-slider') , {
    dots: true,
    speed: 500,
    stopSlideshowAfterInteraction: true,
    startSlide: 1,

    onSlideChange: tranformPriceSlider

    // dotsContainer: document.getElementById('reviews__slider-dots'),
  });

  // function for slider that display neighbors
  function tranformPriceSlider(activeSlide) {
    slidesPrice.forEach(function (slide, number) {
      if (activeSlide === number) {
        slide.style.width = '32%';
      } else {
        slide.style.width = '34%';
      }
    });
  }


  ymaps.ready(init);

  var yandexMap;
  var yandexMapElement = document.querySelector('.map__yandex');

  function init() {
    yandexMap = new ymaps.Map(yandexMapElement, {
      center:   [59.936419, 30.321047],
      zoom:     14,
      controls: []
    });
    yandexMap.behaviors.disable('scrollZoom');

    yandexMap.controls.add('zoomControl', {
      float: 'none',
      position: {
        top:    100,
        left:   20
      }
    });

    var circleLayout = ymaps.templateLayoutFactory.createClass('<div><div class="map__yandex-placemark"></div></div>');

    var circlePlacemark = new ymaps.Placemark(
      yandexMap.getCenter(), {
        hintContent: 'Наш офис'
      }, {
        iconLayout: circleLayout,
        iconShape: {
          type: 'Circle',
          coordinates: [18, 18],
          radius: 26
        }
      }
    );
    yandexMap.geoObjects.add(circlePlacemark);
  }


  function toggleMobileMenu() {
    console.log(header);
    header.classList.toggle('page-header--menu-opened');
  }
}

document.addEventListener("DOMContentLoaded", ready);

