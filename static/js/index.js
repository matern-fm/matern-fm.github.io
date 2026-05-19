$(document).ready(function() {
    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
      breakpoints: [
        { changePoint: 768, slidesToShow: 2, slidesToScroll: 1 },
        { changePoint: 1024, slidesToShow: 2, slidesToScroll: 1 }
      ],
    }

    var carousels = [];
    $('.carousel').each(function() {
      carousels = carousels.concat(bulmaCarousel.attach(this, options));
    });

    function refreshCarouselLayout() {
      carousels.forEach(function(carousel) {
        if (!carousel || !carousel._breakpoint) {
          return;
        }
        if (carousel.element.classList.contains('is-hidden')) {
          return;
        }

        carousel._breakpoint._currentBreakpoint = carousel._breakpoint._getActiveBreakpoint();
        carousel._setDimensions();
        carousel._transitioner.apply(true, carousel._setHeight.bind(carousel));
        carousel._setClasses();
        carousel._navigation.refresh();
        carousel._pagination.refresh();
      });
    }

    var carouselResizeTimer;
    $(window).on('resize orientationchange', function() {
      window.clearTimeout(carouselResizeTimer);
      carouselResizeTimer = window.setTimeout(refreshCarouselLayout, 100);
    });

    function setActiveVideoGroup(category) {
      $('.video-carousel').each(function() {
        var isActive = this.dataset.videoCategory === category;
        $(this).toggleClass('is-hidden', !isActive);
        $(this).find('video').each(function() {
          if (isActive) {
            var playPromise = this.play();
            if (playPromise && playPromise.catch) {
              playPromise.catch(function() {});
            }
          } else {
            this.pause();
          }
        });
      });

      $('.video-toggle [data-video-filter]').each(function() {
        var isActive = this.dataset.videoFilter === category;
        $(this)
          .toggleClass('is-link is-selected', isActive)
          .attr('aria-pressed', isActive);
      });

      window.requestAnimationFrame(refreshCarouselLayout);
    }

    $('.video-toggle [data-video-filter]').on('click', function() {
      setActiveVideoGroup(this.dataset.videoFilter);
    });

    setActiveVideoGroup('elastic');
})
