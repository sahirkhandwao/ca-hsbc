import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.querySelectorAll('li')];
  const sourceLinks = block.querySelectorAll('a');

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb-nav';
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  const source = items.length
    ? items.map((li) => ({ text: li.textContent.trim(), href: li.querySelector('a')?.getAttribute('href') }))
    : [...sourceLinks].map((a) => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));

  source.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    const isLast = index === source.length - 1;

    if (item.href && !isLast) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      li.append(a);
    } else {
      li.classList.add('breadcrumb-current');
      li.setAttribute('aria-current', 'page');
      li.textContent = item.text;
    }
    ol.append(li);
  });

  const firstRow = block.firstElementChild;
  if (firstRow) moveInstrumentation(firstRow, nav);

  nav.append(ol);
  block.textContent = '';
  block.append(nav);
}
