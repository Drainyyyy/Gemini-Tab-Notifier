// ==UserScript==
// @name         Gemini Tab Notifier
// @namespace    https://github.com/Drainyyyy/gemini-tab-notifier
// @version      1.0.4
// @description  Reliable tab icon notifications (yellow/red) and timer for Google Gemini (CSP-safe).
// @author       JR
// @match        https://gemini.google.com/*
// @icon         https://raw.githubusercontent.com/Drainyyyy/gemini-tab-notifier/main/res/img/logo.svg
// @updateURL    https://raw.githubusercontent.com/Drainyyyy/gemini-tab-notifier/main/gemini-tab-notifier.user.js
// @downloadURL  https://raw.githubusercontent.com/Drainyyyy/gemini-tab-notifier/main/gemini-tab-notifier.user.js
// @supportURL   https://github.com/Drainyyyy/gemini-tab-notifier/issues
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    console.log("[GTN] Gemini Tab Notifier is active. https://github.com/Drainyyyy/gemini-tab-notifier");

    let originalIcon = "https://raw.githubusercontent.com/Drainyyyy/gemini-tab-notifier/main/res/img/logo.svg"; 

    // SVG: Gemini Spark
    const svgGemini = (color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z" fill="${color}" />
    </svg>`;

    const iconRed = "data:image/svg+xml;base64," + btoa(svgGemini("#ea4335"));    // Done
    const iconYellow = "data:image/svg+xml;base64," + btoa(svgGemini("#FBBC04")); // Generating

    // Backup original icons
    let backupIcons = [];
    document.querySelectorAll("link[rel*='icon']").forEach(link => {
        backupIcons.push({ href: link.href, sizes: link.getAttribute('sizes') });
    });
    if (backupIcons.length > 0) {
        originalIcon = backupIcons[0].href;
    }

    let isGenerating = false;
    let isDoneState = false;
    let timerStart = 0;

    // Overwrites ALL icon tags to ensure the browser updates the tab
    function setFavicon(url, isOriginal = false) {
        let links = document.querySelectorAll("link[rel*='icon']");
        
        if (links.length === 0) {
            let link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
            links = [link];
        }

        if (isOriginal && backupIcons.length > 0) {
            links.forEach((link, index) => {
                if (backupIcons[index]) {
                    link.href = backupIcons[index].href;
                    if (backupIcons[index].sizes) link.setAttribute('sizes', backupIcons[index].sizes);
                }
            });
        } else {
            links.forEach(link => {
                link.href = url;
                link.removeAttribute('sizes');
            });
        }
    }

    function showTimer(ms) {
        let sec = (ms / 1000).toFixed(1);
        let timerEl = document.getElementById('gtn-timer');
        
        if (!timerEl) {
            timerEl = document.createElement('div');
            timerEl.id = 'gtn-timer';
            timerEl.style.cssText = `
                position: fixed; 
                bottom: 24px; 
                right: 24px; 
                background: #202124; 
                color: #e8eaed; 
                padding: 8px 12px; 
                border-radius: 8px; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                font-size: 13px; 
                font-weight: 500;
                border: 1px solid #3c4043;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                z-index: 99999; 
                pointer-events: none;
            `;
            document.body.appendChild(timerEl);
        }
        timerEl.textContent = `Last generation: ${sec}s`;
    }

    function resetState() {
        if (isDoneState) {
            isDoneState = false;
            setFavicon(originalIcon, true);
        }
    }

    // Reset when user interacts with the page
    window.addEventListener('focus', resetState);
    document.addEventListener('click', resetState);
    document.addEventListener('keydown', resetState);

    // Simple 200ms Polling Loop just for Gemini
    setInterval(() => {
        // Look for the "Stop generating" button or the progress bar
        const isBusy = !!document.querySelector('button[aria-label*="top"], button[aria-label*="toppen"], .ds-progress-bar, sw-animated-send-icon');

        if (isBusy) {
            if (!isGenerating) {
                // Generation started
                isGenerating = true;
                isDoneState = false;
                timerStart = performance.now();
                setFavicon(iconYellow);
            }
        } else {
            if (isGenerating) {
                // Generation finished
                isGenerating = false;
                
                let duration = performance.now() - timerStart;
                showTimer(duration);
                
                if (!document.hasFocus()) {
                    isDoneState = true;
                    setFavicon(iconRed);
                } else {
                    // If user is already looking at the tab, reset instantly
                    resetState();
                }
            }
        }
    }, 200);

})();