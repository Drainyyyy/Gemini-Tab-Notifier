<div align="center">
  <img src="res/img/logo.svg" alt="Project Logo" width="200">
  <h1>Gemini Tab Notifier</h1>
  <p>
    A Content Security Policy (CSP)-safe Tampermonkey userscript that dynamically changes your browser tab icon when Google Gemini finishes generating a response. Perfect for  users who multitask across multiple tabs and windows.
  </p>

  <p>
    <a href="https://github.com/Drainyyyy/gemini-tab-notifier/releases">
      <img src="https://img.shields.io/github/v/release/Drainyyyy/gemini-tab-notifier?label=version" alt="Version">
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/github/license/Drainyyyy/gemini-tab-notifier" alt="License">
    </a>
    <a href="https://greasyfork.org/en/scripts/602608">
      <img src="https://img.shields.io/greasyfork/dt/602608" alt="GreasyFork Installs">
    </a>
  </p>
</div>

## Features
* **Zero Distraction:** Only triggers the visual alert if you are currently working in a different tab.
* **CSP-Safe:** Bypasses Google's strict image-loading restrictions by rendering a dynamic, base64-encoded SVG directly in the browser memory.
* **Auto-Reset:** Instantly reverts to the standard blue Gemini logo the moment you click back into the tab.
* **Performance Optimized:** Uses a lightweight `MutationObserver` targeting exact DOM elements without polling delays.

## Installation

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) for your browser (Chrome, Brave, Firefox, Edge).
2. Install the script directly via GreasyFork:
   
**[Install from GreasyFork](https://greasyfork.org/en/scripts/602608)**

*(Alternatively, you can click on the `gemini-tab-notifier.user.js` file in this repository and select **Raw** to install it directly via GitHub.)*

## How It Works
The script monitors the Gemini chat interface for the presence of the "Stop generating" UI elements. Once the element disappears, the script injects a red SVG spark into the `<head>` of the document as the new favicon. 

## License
Distributed under the MIT License. See `LICENSE` for more information.