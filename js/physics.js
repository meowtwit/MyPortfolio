// js/physics.js

const planck = window.planck;
export let world;
export let groundBody;  // ← 追加
const Vec2   = planck.Vec2;
const SCALE  = 30;

let wallBodies = [];

/** 初期化（無重力 + 壁 + groundBody） */
export function initPhysics() {
  world = new planck.World(Vec2(0, 0));
  createWalls();
  // MouseJoint 用の ground body（静的、何も持たない）
  groundBody = world.createBody();
}

/** ワールド再生成（リセット） */
export function resetWorld(gravity) {
  world = new planck.World(gravity);
  createWalls();
  groundBody = world.createBody();
}

/** 毎フレーム：物理ステップ */
export function stepPhysics(dt) {
  world.step(dt);
}

/** 四辺の壁を生成／再生成 */
export function createWalls() {
  wallBodies.forEach(b => world.destroyBody(b));
  wallBodies = [];
  const cw = innerWidth, ch = innerHeight;
  [[-10,    ch/2, 10,  ch],
   [ cw+10, ch/2, 10,  ch],
   [ cw/2,  -10,   cw, 10],
   [ cw/2,  ch+10, cw, 10]]
    .forEach(([x,y,w,h]) => {
      const wall = world.createBody();
      wall.createFixture(
        planck.Box(w/SCALE, h/SCALE),
        { friction:0, restitution:1 }
      );
      wall.setPosition(Vec2(x/SCALE, y/SCALE));
      wallBodies.push(wall);
    });
}
