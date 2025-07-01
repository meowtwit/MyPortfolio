import { world, resetWorld } from '../physics.js';
import { showDetail } from '../details.js';

const Vec2 = window.planck.Vec2;
const SCALE = 30;
export const catBodies = [];

export function handleProjects(container, cw, ch) {
  resetWorld(Vec2(0, 0));
  container.innerHTML = '';
  catBodies.length = 0;

  const cats = ['😺','🐱','😸','🐈'];
  const sizePx = 200;
  cats.forEach((emoji, i) => {
    const el = document.createElement('div');
    el.classList.add('cat-item','absolute','text-8xl');
    el.textContent = emoji;
    container.appendChild(el);

    const body = world.createDynamicBody({
      position: Vec2(
        (Math.random()*(cw - sizePx) + sizePx/2)/SCALE,
        (Math.random()*(ch - sizePx) + sizePx/2)/SCALE
      )
    });
    body.createFixture(window.planck.Box(sizePx/2/SCALE, sizePx/2/SCALE), {
      density:1, friction:0, restitution:1
    });
    body.setLinearVelocity(Vec2(Math.random()*8-4, Math.random()*8-4));

    el.addEventListener('click', () => {
      showDetail(`Project ${i+1}`, 'Cat themed project');
    });

    catBodies.push({ el, body, sizePx });
  });
}
