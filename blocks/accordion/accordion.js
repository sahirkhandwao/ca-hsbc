import { moveInstrumentation } from '../../scripts/scripts.js';

/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    if (label) moveInstrumentation(label, summary);

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';
    if (row.children[1]) moveInstrumentation(row.children[1], body);

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    moveInstrumentation(row, details);
    details.append(summary, body);
    row.replaceWith(details);
  });
}

