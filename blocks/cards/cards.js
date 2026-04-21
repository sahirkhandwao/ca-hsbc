import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const blogCardMeta = `
  <div class="cards-card-meta">
    <span class="cards-card-meta-item">
      <span class="icon icon-calendar"></span>
      <span>1 Apr '26</span>
    </span>
    <span class="cards-card-meta-item">
      <span class="icon icon-eye"></span>
      <span>37 Views</span>
    </span>
    <span class="cards-card-meta-item">
      <span class="icon icon-clock"></span>
      <span>7 minute read</span>
    </span>
  </div>
`;

export default function decorate(block) {
  const isBlogCard = block.classList.contains('blog-card');
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
    if (isBlogCard) {
      const body = li.querySelector('.cards-card-body');
      if (body) {
        const h3 = body.querySelector('h3');
        if (h3) h3.insertAdjacentHTML('afterend', blogCardMeta);
        else body.insertAdjacentHTML('afterbegin', blogCardMeta);
      }
    }
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
  if (isBlogCard) {
    const loadMoreWrap = document.createElement('div');
    loadMoreWrap.className = 'cards-loadmore-wrap';
    loadMoreWrap.innerHTML = '<button type="button" class="cards-loadmore-btn primary-btn-outline">Load More</button>';
    block.append(loadMoreWrap);
    decorateIcons(block);
  }
}
