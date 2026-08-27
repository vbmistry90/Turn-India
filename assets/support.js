$(function () {
  var $toTop = $('#toTop');
  function handleScroll() {
    $toTop.toggleClass('show', $(window).scrollTop() > 500);
  }
  $(window).on('scroll', handleScroll);
  handleScroll();

  $toTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

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

  $navLinks.on('click', 'a', function () {
    $hamburger.removeClass('open').attr('aria-expanded', false);
    $navLinks.removeClass('open');
  });

  /* ---------------------------------------------------
     Scroll-reveal for elements marked .reveal
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
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------------------------------------------
     Copy UPI ID to clipboard
  --------------------------------------------------- */
  $('#upiCopy').on('click', function () {
    var $btn = $(this);
    var id = $btn.data('id');

    function showCopied() {
      $btn.addClass('copied');
      setTimeout(function () { $btn.removeClass('copied'); }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id).then(showCopied).catch(showCopied);
    } else {
      var $temp = $('<input>').val(id).appendTo('body').select();
      document.execCommand('copy');
      $temp.remove();
      showCopied();
    }
  });

  /* ---------------------------------------------------
     Newsletter form — front-end only feedback
  --------------------------------------------------- */
  $('#newsletterForm').on('submit', function (e) {
    e.preventDefault();
    var email = $('#newsletterEmail').val().trim();
    var $note = $('#formNote');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      $note.text('Enter a valid email address.');
      return;
    }

    $note.text("You're on the list — thank you.");
    $('#newsletterEmail').val('');
  });

  /* ---------------------------------------------------
     Smooth scroll for in-page anchor links
  --------------------------------------------------- */
  $('a[href^="#"]').on('click', function (e) {
    var targetId = $(this).attr('href');
    if (targetId.length < 2) return;
    var $target = $(targetId);
    if ($target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $target.offset().top - 20 }, 700);
    }
  });

});
