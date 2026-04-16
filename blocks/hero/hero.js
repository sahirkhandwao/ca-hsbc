import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const content = block.querySelector(':scope > div > div');
  if (!content) return;

  // Extract picture and text elements
  const picture = content.querySelector('picture');
  const h1 = content.querySelector('h1');
  const paragraph = content.querySelector('p');

  // Create text container for left-aligned overlay
  const textContainer = document.createElement('div');
  textContainer.className = 'hero-text';
  
  // Move instrumentation from the div that contained the text to our new container
  const textSource = h1?.parentElement || paragraph?.parentElement;
  if (textSource && textSource !== content) {
    moveInstrumentation(textSource, textContainer);
  } else {
     // If h1/p are direct children of content (after picture is moved), 
     // we might need to find which div had the aue-prop="text"
     const textDiv = [...block.querySelectorAll('div')].find(d => d.getAttribute('data-aue-prop') === 'text');
     if (textDiv) moveInstrumentation(textDiv, textContainer);
  }

  if (h1) textContainer.appendChild(h1);
  if (paragraph) textContainer.appendChild(paragraph);

  // Rebuild block structure
  block.textContent = '';
  if (picture) block.appendChild(picture);
  block.appendChild(textContainer);
}

