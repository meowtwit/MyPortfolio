// js/categories/design.js
import { showDetail } from '../details.js';

/**
 * “design” クリック時のスライム演出 (GSAP)
 */
export function handleDesign() {
  const container = document.getElementById('container');
  const blob = document.createElement('div');
  blob.className = 'slime-blob';
  container.appendChild(blob);

  const size = 120;
  blob.style.width  = `${size}px`;
  blob.style.height = `${size}px`;
  blob.style.left   = `${(window.innerWidth - size)/2}px`;
  blob.style.top    = `-120px`;

  const targetY = window.innerHeight * 0.7;
  gsap.timeline()
    .to(blob, { duration:1, y: targetY+size, ease:'bounce.out' })
    .to(blob, { duration:0.6, scaleY:0.4, scaleX:1.6, ease:'elastic.out(1,0.4)' }, '>-0.2')
    .to(blob, { duration:2, opacity:0, onComplete:()=>blob.remove() }, '+=1');

  blob.addEventListener('click', () => {
    showDetail('Design', 'Slime animation example');
  });
}
