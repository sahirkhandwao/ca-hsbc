import { moveInstrumentation } from '../../scripts/scripts.js';

function enableDragScroll(scroller) {
  let isDown = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;

  scroller.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScroll = scroller.scrollLeft;
    scroller.classList.add('is-dragging');
    scroller.setPointerCapture(e.pointerId);
  });

  scroller.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 3) moved = true;
    scroller.scrollLeft = startScroll - dx;
  });

  const endDrag = (e) => {
    if (!isDown) return;
    isDown = false;
    scroller.classList.remove('is-dragging');
    if (scroller.hasPointerCapture?.(e.pointerId)) {
      scroller.releasePointerCapture(e.pointerId);
    }
  };
  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
  scroller.addEventListener('pointerleave', endDrag);

  scroller.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  scroller.addEventListener('dragstart', (e) => e.preventDefault());
}

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

  const scroller = container.querySelector('.category-links-content');
  if (scroller) enableDragScroll(scroller);
}
