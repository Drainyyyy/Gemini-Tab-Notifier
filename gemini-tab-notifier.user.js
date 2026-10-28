// ==UserScript==
// @name         Gemini Tab Notifier
// @namespace    https://github.com/Drainyyyy/gemini-tab-notifier
// @version      1.0.1
// @description  Changes the tab icon to a red Gemini spark when generation is complete (CSP-safe).
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
    console.log("[GTN] Gemini Tab Notifier is active.");

    let originalIcon = "https://raw.githubusercontent.com/Drainyyyy/gemini-tab-notifier/main/res/img/logo.svg"; 

    // Professional SVG of the Gemini Spark using Google's UI Red (#ea4335)
    const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z" fill="#ea4335" />
    </svg>`;

    const alertIcon = "data:image/svg+xml;base64," + btoa(svgLogo);
    const existingIcon = document.querySelector("link[rel~='icon']");
    
    if (existingIcon) {
        originalIcon = existingIcon.href;
    }

    function setFavicon(url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = url;
    }

    window.addEventListener('focus', () => {
        setFavicon(originalIcon);
    });

    let isGenerating = false;

    const observer = new MutationObserver(() => {
        const stopElement = document.querySelector('button[aria-label*="top"], button[aria-label*="toppen"], .ds-progress-bar, sw-animated-send-icon');

        if (stopElement) {
            if (!isGenerating) {
                isGenerating = true;
            }
        } else {
            if (isGenerating) {
                isGenerating = false;
                if (!document.hasFocus()) {
                    setFavicon(alertIcon);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();