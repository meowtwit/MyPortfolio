// js/items.js

import { world } from './physics.js';
import {
  handleProgramming,
  redBodies as progRedBodies
} from './categories/programming.js';
import { handleDesign } from './categories/design.js';

const Vec2      = window.planck.Vec2;
const SCALE     = 30;
const cw        = window.innerWidth;
const ch        = window.innerHeight;
const container = document.getElementById('container');

let bodies = [];

/**
 * 初期アイテムを無重力＋壁内で浮遊させる
 */
export function initItems() {
  bodies = [];
  progRedBodies.length = 0;
  container.innerHTML = '';

  const categories = ['programming','design','projects','dance'];
  categories.forEach((label, i) => {
    const el    = document.createElement('div');
    const size  = 400;

    // ■ スタイル設定
    Object.assign(el.style, {
      width:         `${size}px`,
      height:        `${size}px`,
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

    // ■ Planck ボディ生成
    const body = world.createDynamicBody({
      position: Vec2(
        (Math.random()*(cw-size) + size/2)/SCALE,
        (Math.random()*(ch-size) + size/2)/SCALE
      )
    });
    body.createFixture(
      window.planck.Box((size/2)/SCALE, (size/2)/SCALE),
      { density:1, friction:0, restitution:1 }
    );
    bodies.push({ el, body, size });

    // ■ 初速設定
    const ang   = Math.random() * 2 * Math.PI;
    const speed = (0.06 + Math.random()*0.04) * 50;
    body.setLinearVelocity(Vec2(
      Math.cos(ang)*speed,
      Math.sin(ang)*speed
    ));

    // ■ ホバーで小インパルス
    el.addEventListener('mouseenter', () => {
      body.applyLinearImpulse(
        Vec2((Math.random()-0.5), (Math.random()-0.5)),
        body.getPosition()
      );
    });

    // ■ クリックでプログラミング or デザイン演出
    el.addEventListener('click', e => {
      console.log('clicked:', label);
      if (label === 'programming') {
        // クリック位置（px）を handleProgramming に渡す
        handleProgramming(bodies, container, cw, ch, e.clientX, e.clientY);
      } else if (label === 'design') {
        handleDesign();
      }
      // projects, dance はまだ実装なし...
    });
  });
}

/**
 * 毎フレーム呼び出し：浮遊アイテム or 赤ボックス を更新
 */
export function updateItems() {
  if (progRedBodies.length > 0) {
    // programming 演出中：赤ボックスのみ描画
    progRedBodies.forEach(o => {
      const p = o.body.getPosition();
      o.el.style.transform =
        `translate(${p.x*SCALE - o.size/2}px, ${p.y*SCALE - o.size/2}px)` +
        ` rotate(${o.body.getAngle()}rad)`;
    });
  } else {
    // 通常フェーズ：浮遊アイテムを描画
    bodies.forEach(o => {
      const p = o.body.getPosition();
      o.el.style.transform =
        `translate(${p.x*SCALE - o.size/2}px, ${p.y*SCALE - o.size/2}px)` +
        ` rotate(${o.body.getAngle()}rad)`;
    });
  }
}
