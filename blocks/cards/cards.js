import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    const nonImageDivs = [...li.children].filter(
      (div) => !(div.children.length === 1 && div.querySelector('picture')),
    );
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (nonImageDivs.length > 1 && div === nonImageDivs[0]) {
        div.className = 'cards-card-tag';
        if (!div.textContent.trim()) div.remove();
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  /* wrap each li's contents in an <a> so the whole card is clickable */
  ul.querySelectorAll(':scope > li').forEach((li) => {
    const firstLink = li.querySelector('a[href]');
    if (!firstLink) return;
    const anchor = document.createElement('a');
    anchor.href = firstLink.href;
    anchor.className = 'cards-card-link';
    if (firstLink.title) anchor.title = firstLink.title;
    while (li.firstChild) anchor.append(li.firstChild);
    li.append(anchor);
  });

  block.replaceChildren(ul);
}
