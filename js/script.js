(function () {
    'use strict';

    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    var header = document.getElementById('header');
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__link');
    var form = document.getElementById('contactForm');
    var select = document.getElementById('service');

    // --- Mobile menu ---
    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            var open = nav.classList.toggle('nav--open');
            hamburger.classList.toggle('hamburger--open', open);
            hamburger.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        nav.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('nav--open');
                hamburger.classList.remove('hamburger--open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Sticky header ---
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('header--scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    // --- Active nav link ---
    function updateActiveLink() {
        var current = '';
        var scrollY = window.scrollY;
        sections.forEach(function (section) {
            var top = section.offsetTop - 150;
            if (scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function (link) {
            link.classList.toggle('nav__link--active', link.getAttribute('href') === '#' + current);
        });
    }

    if (sections.length) {
        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    // --- Select label handling ---
    if (select) {
        function updateSelectLabel() {
            if (select.value && select.value !== '') {
                select.classList.add('form__input--filled');
            } else {
                select.classList.remove('form__input--filled');
            }
        }
        select.addEventListener('change', updateSelectLabel);
        updateSelectLabel();
    }

    // --- Contact form ---
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var valid = true;
            var inputs = form.querySelectorAll('[required]');
            inputs.forEach(function (input) {
                if (!input.value.trim()) {
                    input.classList.add('form__input--error');
                    valid = false;
                } else {
                    input.classList.remove('form__input--error');
                }
            });

            if (!valid) return;

            var existing = form.querySelector('.form__success');
            if (existing) existing.remove();

            var success = document.createElement('div');
            success.className = 'form__success';
            success.textContent = 'Thank you for reaching out. Our team will contact you within 24 hours.';
            form.appendChild(success);
            form.reset();

            if (select) {
                select.classList.remove('form__input--filled');
            }

            setTimeout(function () {
                if (success.parentNode) success.remove();
            }, 6000);
        });

        form.querySelectorAll('.form__input').forEach(function (input) {
            input.addEventListener('input', function () {
                this.classList.remove('form__input--error');
            });
        });
    }

})();
