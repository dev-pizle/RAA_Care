(function () {
  'use strict';

  var navToggle = document.getElementById('navToggle');
  var navClose = document.getElementById('navClose');
  var navMobile = document.getElementById('navMobile');
  var overlay = document.getElementById('overlay');

  function openMenu() {
    navMobile.classList.add('open');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMobile.classList.remove('open');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', openMenu);
  }
  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close mobile menu when a link is clicked (for in-page nav)
  var mobileLinks = navMobile ? navMobile.querySelectorAll('a') : [];
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  function submitNetlifyForm(form, status, successMessage, onSuccess) {
    var submitButton = form.querySelector('button[type="submit"]');
    var originalButtonText = submitButton ? submitButton.textContent : '';
    var formData = new FormData(form);
    var encodedData = new URLSearchParams();

    formData.forEach(function (value, key) {
      encodedData.append(key, value);
    });

    status.style.display = 'block';
    status.textContent = 'Sending...';
    status.style.color = 'var(--color-neutral-700)';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    fetch(form.action || '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodedData.toString()
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        status.textContent = successMessage;
        status.style.color = 'var(--color-primary)';
        form.reset();

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(function () {
        status.textContent = 'Sorry, your message could not be sent. Please try again or contact us by phone or email.';
        status.style.color = '#b42318';
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
  }

  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitNetlifyForm(
        contactForm,
        formStatus,
        'Thank you for your message. We will get back to you as soon as we can.'
      );
    });
  }

  var requestStaffForm = document.getElementById('requestStaffForm');
  var requestFormStatus = document.getElementById('requestFormStatus');
  var staffType = document.getElementById('staff-type');
  var otherStaffGroup = document.getElementById('other-staff-group');
  var otherStaffType = document.getElementById('other-staff-type');
  var shiftStartDate = document.getElementById('shift-start-date');
  var shiftFinishDate = document.getElementById('shift-finish-date');

  function toggleOtherStaffType() {
    if (!staffType || !otherStaffGroup || !otherStaffType) return;

    var showOther = staffType.value === 'other';
    otherStaffGroup.hidden = !showOther;
    otherStaffType.required = showOther;

    if (!showOther) {
      otherStaffType.value = '';
    }
  }

  if (staffType) {
    staffType.addEventListener('change', toggleOtherStaffType);
    toggleOtherStaffType();
  }

  if (shiftStartDate && shiftFinishDate) {
    var today = new Date().toISOString().split('T')[0];
    shiftStartDate.min = today;
    shiftFinishDate.min = today;

    shiftStartDate.addEventListener('change', function () {
      shiftFinishDate.min = shiftStartDate.value || today;

      if (shiftFinishDate.value && shiftFinishDate.value < shiftFinishDate.min) {
        shiftFinishDate.value = '';
      }
    });
  }

  if (requestStaffForm && requestFormStatus) {
    requestStaffForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitNetlifyForm(
        requestStaffForm,
        requestFormStatus,
        'Thank you. We have received your staffing request and will contact you as soon as possible.',
        function () {
          toggleOtherStaffType();

          if (shiftStartDate && shiftFinishDate) {
            shiftFinishDate.min = shiftStartDate.min;
          }
        }
      );
    });
  }
})();
