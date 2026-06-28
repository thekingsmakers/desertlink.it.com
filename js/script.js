(function () {
    'use strict';

    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    var header = document.getElementById('header');
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__link');
    var form = document.getElementById('contactForm');
    var select = document.getElementById('service');
    var btnEmail = document.getElementById('sendEmail');
    var btnWhatsApp = document.getElementById('sendWhatsApp');

    var WA_NUMBER = '254700123456';
    var EMAIL_TO = 'info@desertlinkit.com';

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

    // --- Active nav link (hash-based only) ---
    var hasHashNav = false;
    navLinks.forEach(function (link) {
        if (link.getAttribute('href').charAt(0) === '#') hasHashNav = true;
    });

    function updateActiveLink() {
        var current = '';
        var scrollY = window.scrollY;
        sections.forEach(function (section) {
            var top = section.offsetTop - 150;
            if (scrollY >= top) current = section.getAttribute('id');
        });
        navLinks.forEach(function (link) {
            link.classList.toggle('nav__link--active', link.getAttribute('href') === '#' + current);
        });
    }

    if (hasHashNav && sections.length) {
        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    // --- Select label ---
    if (select) {
        function updateSelectLabel() {
            select.classList.toggle('form__input--filled', select.value !== '');
        }
        select.addEventListener('change', updateSelectLabel);
        updateSelectLabel();
    }

    // --- Form helpers ---
    function getFormData() {
        return {
            name: (document.getElementById('name').value || '').trim(),
            company: (document.getElementById('company').value || '').trim(),
            email: (document.getElementById('email').value || '').trim(),
            phone: (document.getElementById('phone').value || '').trim(),
            service: (document.getElementById('service').value || '').trim(),
            message: (document.getElementById('message').value || '').trim()
        };
    }

    function validateForm() {
        var valid = true;
        form.querySelectorAll('[required]').forEach(function (input) {
            if (!input.value.trim()) {
                input.classList.add('form__input--error');
                valid = false;
            } else {
                input.classList.remove('form__input--error');
            }
        });
        return valid;
    }

    function clearFormErrors() {
        form.querySelectorAll('.form__input--error').forEach(function (el) {
            el.classList.remove('form__input--error');
        });
    }

    function showFormSuccess(msg) {
        var existing = form.querySelector('.form__success');
        if (existing) existing.remove();
        var div = document.createElement('div');
        div.className = 'form__success';
        div.textContent = msg || 'Thank you for reaching out. Our team will contact you within 24 hours.';
        form.appendChild(div);
        setTimeout(function () { if (div.parentNode) div.remove(); }, 6000);
    }

    if (form) {
        btnEmail.addEventListener('click', function (e) {
            e.preventDefault();
            clearFormErrors();
            if (!validateForm()) return;
            var d = getFormData();
            var subject = 'DesertLink IT Inquiry - ' + d.service;
            var body = 'Name: ' + d.name + '\nCompany: ' + (d.company || 'N/A') + '\nEmail: ' + d.email + '\nPhone: ' + d.phone + '\nService: ' + d.service + '\n\nMessage:\n' + d.message;
            window.location.href = 'mailto:' + EMAIL_TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            showFormSuccess('Your message has been prepared. Please send the email from your default email client.');
            form.reset();
            if (select) select.classList.remove('form__input--filled');
        });

        btnWhatsApp.addEventListener('click', function () {
            clearFormErrors();
            if (!validateForm()) return;
            var d = getFormData();
            var text = 'Hi DesertLink IT, I\'m interested in your ' + d.service + ' services.\n\nName: ' + d.name + '\nCompany: ' + (d.company || 'N/A') + '\nEmail: ' + d.email + '\nPhone: ' + d.phone + '\n\nMessage:\n' + d.message;
            window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank');
            showFormSuccess('WhatsApp has been opened with your message.');
            form.reset();
            if (select) select.classList.remove('form__input--filled');
        });

        form.querySelectorAll('.form__input').forEach(function (input) {
            input.addEventListener('input', function () { this.classList.remove('form__input--error'); });
        });
    }

    // =============== NEW FEATURES ===============

    // --- Scroll Animations via Intersection Observer ---
    var animElements = document.querySelectorAll('.anim-hidden, .anim-hidden-left, .anim-hidden-right, .anim-hidden-scale, .anim-stagger');

    if ('IntersectionObserver' in window && animElements.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('anim-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animElements.forEach(function (el) { observer.observe(el); });
    } else {
        animElements.forEach(function (el) { el.classList.add('anim-visible'); });
    }

    // --- Back to Top Button ---
    var backTop = document.createElement('button');
    backTop.className = 'back-top';
    backTop.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    backTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backTop);

    window.addEventListener('scroll', function () {
        backTop.classList.toggle('back-top--visible', window.scrollY > 400);
    }, { passive: true });

    backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Counter Animation ---
    var counters = document.querySelectorAll('.trust-bar__number');

    if ('IntersectionObserver' in window && counters.length) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var text = el.textContent;
                    var num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    var suffix = text.replace(/[0-9]/g, '');
                    if (!isNaN(num) && num > 0) {
                        animateCounter(el, num, suffix);
                    }
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { counterObserver.observe(c); });
    }

    function animateCounter(el, target, suffix) {
        var duration = 1500;
        var start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(step);
    }

    // --- FAQ Accordion ---
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                var isOpen = item.classList.contains('faq-item--open');
                faqItems.forEach(function (other) { other.classList.remove('faq-item--open'); });
                if (!isOpen) item.classList.add('faq-item--open');
            });
        }
    });

    // --- Service Detail Expand ---
    var expandBtns = document.querySelectorAll('.card__expand');

    expandBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var parent = this.closest('.card');
            var detail = parent ? parent.querySelector('.service-detail') : null;
            if (detail) {
                var isOpen = detail.classList.contains('service-detail--open');
                if (isOpen) {
                    detail.classList.remove('service-detail--open');
                    btn.classList.remove('card__expand--open');
                    btn.innerHTML = 'View Details <i class="fas fa-chevron-down" aria-hidden="true"></i>';
                } else {
                    detail.classList.add('service-detail--open');
                    btn.classList.add('card__expand--open');
                    btn.innerHTML = 'Hide Details <i class="fas fa-chevron-up" aria-hidden="true"></i>';
                }
            }
        });
    });

})();
