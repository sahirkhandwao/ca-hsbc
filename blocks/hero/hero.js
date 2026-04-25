import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];
  const [desktopPicture, mobilePicture] = pictures;
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

  if (desktopPicture) {
    desktopPicture.classList.add('hero-picture-desktop');
    block.appendChild(desktopPicture);
  }
  if (mobilePicture) {
    mobilePicture.classList.add('hero-picture-mobile');
    block.appendChild(mobilePicture);
  }

  block.appendChild(textContainer);
}
