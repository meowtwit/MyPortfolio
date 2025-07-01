// js/categories/programming.js

import { world, createWalls, resetWorld } from '../physics.js';
import { showDetail } from '../details.js';
const Vec2  = window.planck.Vec2;
const SCALE = 30;

// 描画ループ側で参照する赤ボックス群
export const redBodies = [];

/**
 * “programming” クリック時の演出
 * @param {{el:HTMLElement, body:planck.Body}[]} bodies
 * @param {HTMLElement} container
 * @param {number} cw
 * @param {number} ch
 */
export function handleProgramming(bodies, container, cw, ch) {
  console.log('▶ handleProgramming start');

  // 1) 初期アイテムを中央から吹き飛ばし（物理だけ／DOMは残す）
  const center = Vec2((cw/2)/SCALE, (ch/2)/SCALE);
  bodies.forEach(({ el, body }) => {
    if (el.textContent !== 'programming') {
      const pos = body.getPosition();
      const dir = Vec2(pos.x - center.x, pos.y - center.y);
      dir.normalize();
      body.applyLinearImpulse(dir.mul(200), pos);
    }
  });

  // 2) 300ms後に「完全切り替え」
  setTimeout(() => {
    console.log('▶ handleProgramming phase2');

    // 2-1) ワールドをまるごとリセット（重力30, 壁再生成）
    resetWorld(Vec2(0, 30));

    // 2-2) DOMクリア
    container.innerHTML = '';

    // 2-3) bodies 配列をクリア
    bodies.length = 0;

    // 2-4) redBodies 配列をクリア
    redBodies.length = 0;

    // 2-5) 赤ボックス群を改めて生成
    const count   = 5;
    const sizePx  = 400;
    const halfM   = (sizePx / 2) / SCALE;
    const margin  = 50;
    const spacing = (cw - 2 * margin) / (count - 1);

    for (let i = 0; i < count; i++) {
      // — DOM要素
      const el = document.createElement('div');
      Object.assign(el.style, {
        width:         `${sizePx}px`,
        height:        `${sizePx}px`,
        fontSize:      '2.5rem',
        position:      'absolute',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'center',
        userSelect:    'none'
      });
      el.classList.add(
        'item','bg-red-600','text-white',
        'font-bold','shadow-lg','text-6xl'
      );
      el.textContent = `${i+1}`;
      container.appendChild(el);

      // — Physics Body
      const xPx = margin + spacing * i;
      const yPx = 50;
      const body = world.createDynamicBody({
        position: Vec2(xPx / SCALE, yPx / SCALE)
      });
      body.createFixture(planck.Box(halfM, halfM), {
        density:     1,
        friction:    0.3,
        restitution: 0.2
      });

      // — 初速アップ
      const angle = Math.random() * 2 * Math.PI;
      body.setLinearVelocity(Vec2(
        Math.cos(angle) * 5,
        Math.sin(angle) * 5
      ));

      // — ホバーでミニインパルス
      el.addEventListener('mouseenter', () => {
        const j = Vec2(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        body.applyLinearImpulse(j, body.getPosition());
      });

      el.addEventListener('click', () => {
        showDetail(`Programming ${i+1}`, 'Detail coming soon');
      });

      redBodies.push({ el, body, sizePx });
    }
  }, 300);
}
