import { initBackground }      from './background.js';
import { initPaint }           from './paint.js';
import { initPhysics, stepPhysics } from './physics.js';
import { initItems, updateItems }   from './items.js';
import { initDetails }         from './details.js';

initBackground();
initPaint();
initPhysics();
initItems();
initDetails();

let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;
  stepPhysics(dt);
  updateItems();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
