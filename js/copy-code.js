/**
 * copy-code.js
 * Adds a "Copy" button to every <pre><code> block on the page.
 *
 * - Works before or after highlight.js runs: it copies code.textContent,
 *   which ignores the <span> elements highlight.js injects.
 * - Wraps each <pre> in a <div class="code-block"> so the button stays pinned
 *   in the corner even when the code scrolls horizontally.
 * - Requires the async Clipboard API (HTTPS or localhost).
 */
(function () {
  'use strict';

  var RESET_DELAY_MS = 2000;

  var ICON_COPY =
    '<svg class="copy-code-btn__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'd="M9 9h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z M5 15H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1"/>' +
    '</svg>';

  var ICON_CHECK =
    '<svg class="copy-code-btn__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/>' +
    '</svg>';

  var ICON_ERROR =
    '<svg class="copy-code-btn__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12"/>' +
    '</svg>';

  function setButtonState(button, state) {
    var icon, label;

    if (state === 'copied') {
      icon = ICON_CHECK;
      label = 'Copied!';
    } else if (state === 'error') {
      icon = ICON_ERROR;
      label = 'Failed';
    } else {
      icon = ICON_COPY;
      label = 'Copy';
    }

    button.innerHTML = icon + '<span class="copy-code-btn__label">' + label + '</span>';
    button.setAttribute('data-state', state);
  }

  function createButton(codeEl) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code-btn';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    setButtonState(button, 'idle');

    var resetTimer = null;

    button.addEventListener('click', function () {
      // textContent returns the raw code with highlight.js markup stripped out.
      var text = codeEl.textContent;

      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        setButtonState(button, 'error');
        scheduleReset();
        return;
      }

      navigator.clipboard.writeText(text).then(
        function () {
          setButtonState(button, 'copied');
          scheduleReset();
        },
        function () {
          setButtonState(button, 'error');
          scheduleReset();
        }
      );
    });

    function scheduleReset() {
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        setButtonState(button, 'idle');
      }, RESET_DELAY_MS);
    }

    return button;
  }

  function enhance(preEl) {
    var codeEl = preEl.querySelector(':scope > code');
    if (!codeEl) return;

    // Skip blocks that were already processed.
    if (preEl.parentNode && preEl.parentNode.classList.contains('code-block')) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    preEl.parentNode.insertBefore(wrapper, preEl);
    wrapper.appendChild(preEl);
    wrapper.appendChild(createButton(codeEl));
  }

  function init() {
    var blocks = document.querySelectorAll('pre');
    for (var i = 0; i < blocks.length; i++) {
      enhance(blocks[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();