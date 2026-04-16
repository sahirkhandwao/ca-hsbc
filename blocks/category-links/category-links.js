import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'category-links-container';

  const rows = [...block.children];
  rows.forEach((row, index) => {
    const div = row.querySelector('div');
    if (div) {
      if (index === 0) {
        div.className = 'category-links-title';
      } else {
        div.className = 'category-links-content';
      }
      moveInstrumentation(row, div);
      container.append(div);
    }
  });

  block.textContent = '';
  block.append(container);
}
