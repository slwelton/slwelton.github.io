/**
 * Reusable synced tabs.
 *
 * Expected markup (any number of groups: tabs-1, tabs-2, ...):
 *
 *   <div id="tabs-N" class="tabs ...">
 *     <div class="content">
 *       <div class="ulist tablist"><ul>
 *         <li id="tabs-N-some-key" class="tab"><p>Label</p></li>
 *       </ul></div>
 *       <div id="tabs-N-some-key--panel" class="tabpanel"
 *            aria-labelledby="tabs-N-some-key"> ... </div>
 *     </div>
 *   </div>
 *
 * Tabs are matched to panels via aria-labelledby (falling back to the
 * "<li id>--panel" id convention). Tabs are synced across groups using a
 * "sync key": the <li> id with the group prefix ("tabs-N-") removed.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'synced-tabs-selection'; // set to null to disable persistence
  var groups = [];

  // ---------- helpers ----------

  function safeStorage(method, key, value) {
    if (!STORAGE_KEY) return null;
    try {
      return method === 'get'
        ? window.localStorage.getItem(key)
        : window.localStorage.setItem(key, value);
    } catch (e) {
      return null; // storage blocked or unavailable
    }
  }

  // Only elements that belong directly to this group (ignores nested groups).
  function ownedBy(container, selector) {
    return Array.prototype.filter.call(
      container.querySelectorAll(selector),
      function (el) { return el.closest('.tabs') === container; }
    );
  }

  function syncKeyFor(container, li) {
    var id = li.id || '';
    var prefix = container.id ? container.id + '-' : '';
    if (prefix && id.indexOf(prefix) === 0) return id.slice(prefix.length);
    // Fallback: normalized label text
    return (li.textContent || '').trim().toLowerCase().replace(/\s+/g, '-');
  }

  // ---------- build a group ----------

  function buildGroup(container) {
    var list = ownedBy(container, '.tablist')[0];
    if (!list) return null;

    var ul = list.querySelector('ul');
    var items = ownedBy(container, '.tablist li.tab');
    if (!ul || !items.length) return null;

    var panels = ownedBy(container, '.tabpanel');
    var tabs = [];

    items.forEach(function (li, index) {
      var panel = null;
      for (var i = 0; i < panels.length; i++) {
        if (panels[i].getAttribute('aria-labelledby') === li.id) { panel = panels[i]; break; }
      }
      if (!panel && li.id) panel = document.getElementById(li.id + '--panel');
      if (!panel) return; // tab with no matching panel: leave it alone

      li.setAttribute('role', 'tab');
      li.setAttribute('tabindex', '-1');
      li.setAttribute('aria-selected', 'false');
      li.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.hidden = true;

      tabs.push({ li: li, panel: panel, key: syncKeyFor(container, li), index: index });
    });

    if (!tabs.length) return null;

    ul.setAttribute('role', 'tablist');

    var group = { container: container, tabs: tabs, current: null };

    tabs.forEach(function (tab) {
      tab.li.addEventListener('click', function () {
        selectEverywhere(tab.key, tab.li);
      });
      tab.li.addEventListener('keydown', function (e) {
        onKeydown(e, group, tab);
      });
    });

    return group;
  }

  // ---------- selection ----------

  function findTab(group, key) {
    for (var i = 0; i < group.tabs.length; i++) {
      if (group.tabs[i].key === key) return group.tabs[i];
    }
    return null;
  }

  function activate(group, tab) {
    group.tabs.forEach(function (t) {
      var on = t === tab;
      t.li.classList.toggle('is-active', on);
      t.li.setAttribute('aria-selected', on ? 'true' : 'false');
      t.li.setAttribute('tabindex', on ? '0' : '-1');
      t.panel.hidden = !on;
      t.panel.classList.toggle('is-active', on);
    });
    group.current = tab;
  }

  // Select `key` in every group that has it. `anchor` (the clicked <li>) is
  // kept at the same viewport position so the page doesn't jump when other
  // groups change height.
  function selectEverywhere(key, anchor) {
    var before = anchor ? anchor.getBoundingClientRect().top : null;

    groups.forEach(function (group) {
      var tab = findTab(group, key);
      if (tab) activate(group, tab);
    });

    safeStorage('set', STORAGE_KEY, key);

    if (anchor) {
      var delta = anchor.getBoundingClientRect().top - before;
      if (delta) window.scrollBy(0, delta);
    }
  }

  function onKeydown(e, group, tab) {
    var tabs = group.tabs;
    var i = tabs.indexOf(tab);
    var next = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectEverywhere(tab.key, tab.li);
      return;
    } else return;

    e.preventDefault();
    next.li.focus();
    selectEverywhere(next.key, next.li);
  }

  // ---------- init ----------

  function init() {
    var containers = document.querySelectorAll('div.tabs');
    Array.prototype.forEach.call(containers, function (container) {
      var group = buildGroup(container);
      if (group) groups.push(group);
    });

    var saved = safeStorage('get', STORAGE_KEY);

    groups.forEach(function (group) {
      var tab = (saved && findTab(group, saved)) || group.tabs[0];
      activate(group, tab);
      container_ready(group.container);
    });
  }

  function container_ready(container) {
    container.classList.remove('is-loading');
    container.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();