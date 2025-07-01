// js/items.js

import { world } from './physics.js';
import { handleProgramming, redBodies as progRedBodies } from './categories/programming.js';
import { handleDesign } from './categories/design.js';

const Vec2      = window.planck.Vec2;
const SCALE     = 30;
const cw        = window.innerWidth;
const ch        = window.innerHeight;
const container = document.getElementById('container');

let bodies = [];

/**
 * 初期アイテムを浮遊表示
 */
export function initItems() {
  bodies = [];
  progRedBodies.length = 0;
  container.innerHTML = '';

  // カテゴリ名を programming に修正
  const categories = ['programming','design','projects','dance'];

  for (let i = 0; i < categories.length; i++) {
    const label = categories[i];
    const el = document.createElement('div');
    const sizePx = 400;

    // 基本スタイル
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
      'item','text-6xl','text-white',
      'shadow-[0_0_15px_rgba(0,255,255,0.3)]',
      'transition-transform','duration-200',
      'hover:scale-110','hover:shadow-[0_0_25px_rgba(0,255,255,0.6)]',
      'bg-gradient-to-br','from-cyan-500','to-blue-800','rounded-xl'
    );

    el.textContent = label;
    container.appendChild(el);

    // 物理Body
    const body = world.createDynamicBody({
      position: Vec2(
        (Math.random()*(cw - sizePx) + sizePx/2)/SCALE,
        (Math.random()*(ch - sizePx) + sizePx/2)/SCALE
      )
    });
    body.createFixture(
      window.planck.Box((sizePx/2)/SCALE, (sizePx/2)/SCALE),
      { density:1, friction:0, restitution:1 }
    );
    bodies.push({ el, body, sizePx });

    // 初速
    const ang = Math.random() * Math.PI * 2;
    const speed = (0.06 + Math.random()*0.04) * 50;
    body.setLinearVelocity(Vec2(Math.cos(ang)*speed, Math.sin(ang)*speed));

    // ホバー時インパルス
    el.addEventListener('mouseenter', () => {
      body.applyLinearImpulse(
        Vec2((Math.random()-0.5), (Math.random()-0.5)),
        body.getPosition()
      );
    });

    // クリック時
    el.addEventListener('click', () => {
      console.log('clicked:', label);
      if (label === 'programming') {
        handleProgramming(bodies, container, cw, ch);
      } else if (label === 'design') {
        handleDesign();
      }
      // projects, dance はまだ実装なし
    });
  }
}

/**
 * 毎フレーム呼び出し：浮遊 or 赤ボックスを描画
 */
export function updateItems() {
  if (progRedBodies.length > 0) {
    progRedBodies.forEach(o => {
      const p = o.body.getPosition();
      o.el.style.transform =
        `translate(${p.x*SCALE - o.sizePx/2}px, ${p.y*SCALE - o.sizePx/2}px)`+
        ` rotate(${o.body.getAngle()}rad)`;
    });
  } else {
    bodies.forEach(o => {
      const p = o.body.getPosition();
      o.el.style.transform =
        `translate(${p.x*SCALE - o.sizePx/2}px, ${p.y*SCALE - o.sizePx/2}px)`+
        ` rotate(${o.body.getAngle()}rad)`;
    });
  }
}
