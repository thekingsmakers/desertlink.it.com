(function () {
    'use strict';

    // CONFIG - user must set these
    var WEBHOOK_URL = 'https://desertlinkit.app.n8n.cloud/webhook/analytics';
    var SITE_NAME = 'DesertLink IT';

    // UUID generator
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // Get client IP
    function getIP() {
        return fetch('https://api64.ipify.org?format=json')
            .then(function (r) { return r.json(); })
            .then(function (d) { return d.ip; })
            .catch(function () { return ''; });
    }

    // Build the visit record (geo resolved server-side by n8n)
    function buildVisit(ip) {
        return {
            id: uuid(),
            ip: ip,
            page: window.location.pathname,
            referrer: document.referrer || '',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent || ''
        };
    }

    // Send visit to webhook
    function sendVisit(visit) {
        if (!WEBHOOK_URL) return Promise.resolve();
        return fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ site: SITE_NAME, event: 'pageview', visit: visit })
        }).catch(function () {
            // Queue for later
            var queue = JSON.parse(localStorage.getItem('dt_analytics_queue') || '[]');
            queue.push(visit);
            localStorage.setItem('dt_analytics_queue', JSON.stringify(queue));
        });
    }

    // Flush queued visits
    function flushQueue() {
        if (!WEBHOOK_URL) return;
        var queue = JSON.parse(localStorage.getItem('dt_analytics_queue') || '[]');
        if (!queue.length) return;
        localStorage.removeItem('dt_analytics_queue');
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ site: SITE_NAME, event: 'pageview_batch', visits: queue })
        }).catch(function () {
            // Re-queue if still fails
            localStorage.setItem('dt_analytics_queue', JSON.stringify(queue));
        });
    }

    // Init
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        getIP().then(function (ip) {
            var visit = buildVisit(ip);
            sendVisit(visit);
            flushQueue();
        }).catch(function () {});
    }

})();
