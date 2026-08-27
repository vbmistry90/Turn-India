$(function () {
  $(".menu-toggle").on("click", function () { $(".navbar nav").toggleClass("open"); });
  $(".navbar nav a").on("click", function () { $(".navbar nav").removeClass("open"); });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { $(entry.target).addClass("visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: .12 });
  $(".reveal").each(function () { observer.observe(this); });

  let counted = false;
  const statsObserver1 = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      $("[data-target]").each(function () {
        const el = $(this), target = parseInt(el.data("target")), suffix = el.data("suffix"), start = 0, duration = 1300, startTime = null;
        function tick(t) { if (!startTime) startTime = t; let p = Math.min((t - startTime) / duration, 1); let v = Math.floor(p * target); el.text(v + suffix); if (p < 1) requestAnimationFrame(tick); else el.text(target + suffix); }
        requestAnimationFrame(tick);
      });
    }
  }, { threshold: .5 });
  if ($(".stats")[0]) statsObserver1.observe($(".stats")[0]);

  $(".chips button").on("click", function () {
    $(".chips button").removeClass("selected"); $(this).addClass("selected");
    $("#inquiryType").val($(this).data("type"));
  });

  function toast(message) {
    const t = $("#toast"); t.text(message).addClass("show");
    setTimeout(() => t.removeClass("show"), 3500);
  }

  $("#message").on("submit", function (e) {
    e.preventDefault();
    if (!$("#inquiryType").val()) { toast("Please select an inquiry type."); return; }
    toast("Thank you! Your message has been received.");
    this.reset(); $(".chips button").removeClass("selected"); $("#inquiryType").val("");
  });

  $(".newsletter").on("submit", function (e) { e.preventDefault(); toast("Thank you for joining the movement!"); this.reset(); });
  $("#playDemo").on("click", function () { toast("Project video will be available soon."); });

  /* ---------------------------------------------------
   Mobile menu toggle
--------------------------------------------------- */
  var $hamburger = $('#hamburger');
  var $navLinks = $('#navLinks');

  $hamburger.on('click', function () {
    var isOpen = $hamburger.toggleClass('open').hasClass('open');
    $navLinks.toggleClass('open', isOpen);
    $hamburger.attr('aria-expanded', isOpen);
  });

  // close mobile menu after tapping a link
  $navLinks.on('click', 'a', function () {
    $hamburger.removeClass('open').attr('aria-expanded', false);
    $navLinks.removeClass('open');
  });

  /* ---------------------------------------------------
     Scroll-reveal for elements marked .reveal
     (IntersectionObserver — smoother & cheaper than a
     jQuery scroll-position loop for this)
  --------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------------------------------------------
     Animated stat counters — trigger once hero stats
     scroll into view
  --------------------------------------------------- */
  var $stats = $('#heroStats dt');
  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    $stats.each(function () {
      var $el = $(this);
      var target = parseInt($el.data('count'), 10) || 0;
      $({ n: 0 }).animate({ n: target }, {
        duration: 1400,
        easing: 'swing',
        step: function (now) {
          $el.text(Math.floor(now));
        },
        complete: function () {
          $el.text(target);
        }
      });
    });
  }

  if ($stats.length) {
    if ('IntersectionObserver' in window) {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });
      statsObserver.observe(document.getElementById('heroStats'));
    } else {
      animateStats();
    }
  }

  /* ---------------------------------------------------
     Copy UPI ID to clipboard
  --------------------------------------------------- */
  $('#upiCopy').on('click', function () {
    var $btn = $(this);
    var id = $btn.data('id');
    var $action = $btn.find('.upi-id-action');
    var originalText = $action.text();

    function showCopied() {
      $btn.addClass('copied');
      $action.text('Copied!');
      setTimeout(function () {
        $btn.removeClass('copied');
        $action.text(originalText);
      }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id).then(showCopied).catch(showCopied);
    } else {
      // fallback for older browsers
      var $temp = $('<input>').val(id).appendTo('body').select();
      document.execCommand('copy');
      $temp.remove();
      showCopied();
    }
  });
  $(window).on("scroll", function () {
    $(".navbar:not(.solid)").toggleClass("scrolled", $(this).scrollTop() > 30);
  });
});
