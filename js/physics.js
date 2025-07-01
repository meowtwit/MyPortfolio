// js/physics.js
const planck = window.planck;
export let world;
const Vec2   = planck.Vec2;
const SCALE  = 30;

let wallBodies = [];

/**
 * 最初は無重力でワールドを生成し、四辺の壁を作る
 */
export function initPhysics() {
  world = new planck.World(Vec2(0, 0));
  createWalls();
}

/**
 * 毎フレームの物理ステップ
 */
export function stepPhysics(dt) {
  world.step(dt);
}

/**
 * 四辺に摩擦0・反発1の壁を生成／再生成
 */
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
      wall.createFixture(planck.Box(w/SCALE, h/SCALE), { friction:0, restitution:1 });
      wall.setPosition(Vec2(x/SCALE, y/SCALE));
      wallBodies.push(wall);
    });
}

/**
 * ワールドを新規生成し、重力＋四辺の壁をセット
 * @param {planck.Vec2} gravity
 */
export function resetWorld(gravity) {
  world = new planck.World(gravity);
  createWalls();
}
