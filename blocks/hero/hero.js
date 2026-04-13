export default function decorate(block) {
  const content = block.querySelector('div > div');
  if (!content) return;

  // Extract picture and text elements
  const picture = content.querySelector('picture');
  const h1 = content.querySelector('h1');
  const paragraph = content.querySelector('p');

  // Create text container for left-aligned overlay
  const textContainer = document.createElement('div');
  textContainer.className = 'hero-text';
  if (h1) textContainer.appendChild(h1);
  if (paragraph) textContainer.appendChild(paragraph);

  // Rebuild block structure
  block.textContent = '';
  if (picture) block.appendChild(picture);
  block.appendChild(textContainer);
}
