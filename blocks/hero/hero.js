import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const picture = block.querySelector('picture');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture'));

  const textContainer = document.createElement('div');
  textContainer.className = 'hero-text';

  const textSource = block.querySelector('[data-aue-prop="text"]')
    || heading?.parentElement
    || paragraphs[0]?.parentElement;
  if (textSource) moveInstrumentation(textSource, textContainer);

  if (heading) textContainer.appendChild(heading);
  paragraphs.forEach((p) => textContainer.appendChild(p));

  block.textContent = '';
  if (picture) block.appendChild(picture);
  block.appendChild(textContainer);
}
