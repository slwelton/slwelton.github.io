/**
 * Site-wide syntax highlighting.
 *
 * Highlights every <pre><code> block on the page using the highlight.js
 * library (https://highlightjs.org). The library must be loaded first:
 *
 *   <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>
 *   <script src="/assets/js/highlight.js" defer></script>
 *
 * Does nothing if the library isn't present. To skip a block, add the class
 * "nohighlight" to its <code> element. Token colours are defined in tabs.scss.
 */
(function () {
  'use strict';

  // Languages used on the site that highlight.js doesn't know by name.
  var ALIASES = [
    { names: ['sqlpp', 'n1ql', 'sql++'], language: 'sql' }
  ];

  function highlightAll() {
    var hljs = window.hljs;
    if (!hljs) return;

    if (hljs.registerAliases) {
      ALIASES.forEach(function (alias) {
        hljs.registerAliases(alias.names, { languageName: alias.language });
      });
    }

    var blocks = document.querySelectorAll('pre code');
    Array.prototype.forEach.call(blocks, function (block) {
      // Skip blocks highlight.js has already processed.
      if (block.dataset.highlighted === 'yes') return;
      hljs.highlightElement(block);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightAll);
  } else {
    highlightAll();
  }
})();