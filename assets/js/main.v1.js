/* ИП Поплавский: меню, схема групп, заявка */
var WA_BASE = 'https://wa.me/375292078868';
var GROUPS = window.__GROUPS__ || [];

document.addEventListener('DOMContentLoaded', function () {
  initDrawer();
  initSchema();
  initForm();
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

function initDrawer() {
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  if (!burger || !drawer) return;
  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    var b = document.getElementById('drawer-close');
    if (b) b.focus({ preventScroll: true });
  }
  function close() {
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  burger.addEventListener('click', function () { drawer.hidden ? open() : close(); });
  var cb = document.getElementById('drawer-close');
  if (cb) cb.addEventListener('click', close);
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) { close(); return; }
    if (!e.target.closest('.drawer__inner')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (drawer.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var items = drawer.querySelectorAll('a, button');
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1040 && !drawer.hidden) close();
  });
}

function initSchema() {
  var svg = document.querySelector('.sch');
  if (!svg) return;
  var groups = window.__GROUP_DATA__ || [];
  var num = document.querySelector('[data-sch-num]');
  var t = document.querySelector('[data-sch-t]');
  var sub = document.querySelector('[data-sch-sub]');
  var note = document.querySelector('[data-sch-note]');
  var unit = document.querySelector('[data-sch-unit]');

  function pick(id) {
    var g = groups.filter(function (x) { return x.id === id; })[0];
    if (!g) return;
    var i = groups.indexOf(g);
    svg.querySelectorAll('.sch__n').forEach(function (n) {
      n.classList.toggle('is-on', n.getAttribute('data-g') === id);
    });
    num.textContent = ('0' + (i + 1)).slice(-2);
    t.textContent = g.name;
    sub.textContent = g.sub;
    note.textContent = g.note;
    unit.textContent = g.unit;
  }

  svg.querySelectorAll('.sch__n').forEach(function (n) {
    n.addEventListener('click', function () { pick(n.getAttribute('data-g')); });
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n.getAttribute('data-g')); }
    });
  });
  pick(svg.querySelector('.sch__n.is-on').getAttribute('data-g'));
}

function initForm() {
  var form = document.getElementById('lead');
  if (!form) return;
  var ok = document.getElementById('form-ok');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('f-name');
    var contact = document.getElementById('f-contact');
    var bad = false;
    [name, contact].forEach(function (el) {
      if (!el.value.trim()) { el.style.borderColor = '#C0392B'; bad = true; }
      else el.style.borderColor = '';
    });
    if (bad) {
      ok.className = 'form__ok is-on';
      ok.textContent = 'Заполните имя и телефон: без них не смогу ответить.';
      return;
    }
    var rows = [
      'Заявка с сайта: электромонтаж (Поплавский)',
      'Имя: ' + name.value.trim(),
      'Контакт: ' + contact.value.trim(),
      'Что нужно: ' + document.getElementById('f-what').value,
      'Детали: ' + (document.getElementById('f-note').value.trim() || 'без деталей')
    ];
    var text = rows.join('\n');
    ok.className = 'form__ok is-on';
    ok.textContent = 'Заявка собрана. Сейчас откроется WhatsApp с готовым текстом: останется нажать «отправить».';
    window.open(WA_BASE + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    form.reset();
  });
}
