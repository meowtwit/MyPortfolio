// js/categories/programming.js

import { world } from '../physics.js';
const planck = window.planck;
const Vec2   = planck.Vec2;
const SCALE  = 30;

export const redBodies = [];

/**
 * “programming” クリック時の演出
 * @param bodies    浮遊アイテム配列
 * @param container DOM コンテナ
 * @param cw        ビューポート幅(px)
 * @param ch        ビューポート高(px)
 * @param clickX    クリック位置 x (px)
 * @param clickY    クリック位置 y (px)
 */
export function handleProgramming(bodies, container, cw, ch, clickX, clickY) {
  console.log('▶ handleProgramming start');

  // 1) 浮遊アイテムをセンサー化して壁判定を無効化
  bodies.forEach(({ body }) => {
    for (let f = body.getFixtureList(); f; f = f.getNext()) {
      f.setSensor(true);
    }
  });

  // 2) 中心から吹き飛ばし
  const center = Vec2((cw/2)/SCALE, (ch/2)/SCALE);
  bodies.forEach(({ body }) => {
    const pos = body.getPosition();
    const dir = Vec2(pos.x - center.x, pos.y - center.y);
    dir.normalize();
    body.applyLinearImpulse(dir.mul(200), pos);
  });

  // 3) 300ms後に吹き飛びフェーズを終えて赤ボックス生成へ
  setTimeout(() => {
    console.log('▶ handleProgramming phase2');

    // 3-1) 古い浮遊ボディをすべて削除
    bodies.forEach(({ body }) => world.destroyBody(body));
    bodies.length = 0;

    // 3-2) 下向き重力をセット
    world.setGravity(Vec2(0, 30));

    // 3-3) DOMクリア＆赤ボックス配列リセット
    container.innerHTML = '';
    redBodies.length = 0;

    // 3-4) 赤ボックスを「クリック位置」から分裂して生成
    const count     = 5;
    const sizePx    = 400;
    const halfM     = (sizePx/2) / SCALE;
    const originX   = clickX / SCALE;
    const originY   = clickY / SCALE;
    const baseSpeed = 8;      // 分裂時の初速
    const offsetR   = 1;      // 発生位置オフセットm

    for (let i = 0; i < count; i++) {
      // — DOM要素生成 —
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

      // — 発生角度を均等分割 + ランダムずらし —
      const baseAngle = (Math.PI * 2 / count) * i;
      const angle     = baseAngle + (Math.random()*0.2 - 0.1);

      // — 発生位置を少しオフセット —
      const spawnPos = Vec2(
        originX + Math.cos(angle) * offsetR,
        originY + Math.sin(angle) * offsetR
      );

      // — Physicsボディ生成 —
      const body = world.createDynamicBody({ position: spawnPos });
      body.createFixture(planck.Box(halfM, halfM), {
        density:1, friction:0.3, restitution:0.2
      });

      // — 初速を分裂方向に —
      body.setLinearVelocity(Vec2(
        Math.cos(angle) * baseSpeed,
        Math.sin(angle) * baseSpeed
      ));

      // — ホバーでミニインパルス —
      el.addEventListener('mouseenter', () => {
        const imp = Vec2(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        body.applyLinearImpulse(imp, body.getPosition());
      });

      redBodies.push({ el, body, size: sizePx });
    }
  }, 0);
}
