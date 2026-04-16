import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'popular-searches-container';

  const rows = [...block.children];
  rows.forEach((row, index) => {
    const div = row.querySelector('div');
    if (div) {
      if (index === 0) {
        div.className = 'popular-searches-title';
      } else {
        div.className = 'popular-searches-links';
      }
      moveInstrumentation(row, div);
      container.append(div);
    }
  });

  block.textContent = '';
  block.append(container);
}
