// --- 1) マウス位置を追跡 ---
let mouseX = innerWidth/2, mouseY = innerHeight/2;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// --- 2) 宇宙っぽい星だけキャンバス (cosmos) ---
(() => {
  const c = document.getElementById('cosmos');
  const ctx = c.getContext('2d');
  let w,h,stars;
  function init() {
    w=c.width=innerWidth;
    h=c.height=innerHeight;
    stars = Array.from({length:120}, ()=>({
      x:Math.random()*w,
      y:Math.random()*h,
      r:Math.random()*1.5,
      alpha:Math.random()*0.6+0.2
    }));
  }
  function draw() {
    ctx.clearRect(0,0,w,h);
    stars.forEach(s=>{
      ctx.globalAlpha = s.alpha*(0.7+0.3*Math.random());
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,2*Math.PI);
      ctx.fillStyle='#fff';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', init);
  init(); draw();
})();

// --- 3) 青紫流体背景 (starfield) — 一度だけベースを描いて消さない ---
(() => {
  const c = document.getElementById('starfield');
  const ctx = c.getContext('2d');
  let w,h, baseGrad;
  function init() {
    w=c.width=innerWidth;
    h=c.height=innerHeight;
    // ベースグラデ：濃紺→紫→薄紫
    baseGrad = ctx.createLinearGradient(0,0,w,h);
    baseGrad.addColorStop(0,'#001f3f');
    baseGrad.addColorStop(0.5,'#3f007f');
    baseGrad.addColorStop(1,'#6a0dad');
    // 初回にベースを描画
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0,0,w,h);
  }
  function draw(time) {
    const t = time * 0.00002;
    // ブロブ①：ブルー
    const x1 = (Math.sin(t)*0.5+0.5)*w;
    const y1 = (Math.cos(t)*0.5+0.5)*h;
    const blob1 = ctx.createRadialGradient(
      x1,y1,0, x1,y1,Math.max(w,h)*0.7
    );
    blob1.addColorStop(0,'rgba(0,100,200,0.5)');
    blob1.addColorStop(1,'rgba(0,100,200,0)');
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = blob1;
    ctx.fillRect(0,0,w,h);
    // ブロブ②：マゼンタ
    const x2 = (Math.cos(t*1.2)*0.5+0.5)*w;
    const y2 = (Math.sin(t*1.2)*0.5+0.5)*h;
    const blob2 = ctx.createRadialGradient(
      x2,y2,0, x2,y2,Math.max(w,h)*0.7
    );
    blob2.addColorStop(0,'rgba(200,50,150,0.4)');
    blob2.addColorStop(1,'rgba(200,50,150,0)');
    ctx.fillStyle = blob2;
    ctx.fillRect(0,0,w,h);
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', init);
  init(); requestAnimationFrame(draw);
})();

// --- 4) ゆ～っくり滲むピンク塗料 (paintCanvas) ---
(() => {
  const c = document.getElementById('paintCanvas');
  const ctx = c.getContext('2d');
  let w,h;
  function init() {
    w=c.width=innerWidth;
    h=c.height=innerHeight;
  }
  function loop() {
    // とてつもなくゆっくりフェード
    ctx.fillStyle = 'rgba(0,0,0,0.002)';
    ctx.fillRect(0,0,w,h);
    // source-over でピンクをにじませる
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createRadialGradient(
      mouseX,mouseY,0,
      mouseX,mouseY,500
    );
    grad.addColorStop(0,'rgba(255,156,243,0.06)');
    grad.addColorStop(1,'rgba(255,156,243,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(mouseX-500,mouseY-500,1000,1000);
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', init);
  init(); loop();
})();

// --- 5) Planck.js 無重力漂流＋インタラクション (初速×50倍) ---
(() => {
  const pl = planck, Vec2 = pl.Vec2;
  const world = new pl.World(Vec2(0,0));
  const SCALE = 30;
  const cw = innerWidth, ch = innerHeight;
  const container = document.getElementById('container');
  const bodies = [];
  // 四辺に壁
  [[-10,ch/2,10,ch],[cw+10,ch/2,10,ch],[cw/2,-10,cw,10],[cw/2,ch+10,cw,10]]
    .forEach(([x,y,w,h])=>{
      const wall = world.createBody();
      wall.createFixture(pl.Box(w/SCALE,h/SCALE), {
        friction:0, restitution:1
      });
      wall.setPosition(Vec2(x/SCALE,y/SCALE));
    });
  // アイテム５つ
  for(let i=1;i<=5;i++){
    const el = document.createElement('div');
    el.className = [
      'item',
      'absolute w-20 h-20 rounded-xl flex items-center justify-center',
      'text-white',
      'shadow-[0_0_15px_rgba(0,255,255,0.3)]',
      'bg-gradient-to-br from-cyan-500 to-blue-800',
      'transition-transform duration-200',
      'hover:scale-110 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)]'
    ].join(' ');
    el.textContent = i;
    container.appendChild(el);
    const body = world.createDynamicBody({
      position: Vec2(
        (Math.random()*(cw-80)+40)/SCALE,
        (Math.random()*(ch-80)+40)/SCALE
      )
    });
    body.createFixture(pl.Box(40/SCALE,40/SCALE), {
      density:1, friction:0, restitution:1
    });
    // 初速  ×50倍
    const angle = Math.random()*Math.PI*2;
    const speed = (0.06+Math.random()*0.04)*50;
    body.setLinearVelocity(Vec2(
      Math.cos(angle)*speed,
      Math.sin(angle)*speed
    ));
    bodies.push({el,body});
  }
  // 描画ループ
  let last = performance.now();
  (function update(now){
    const dt=(now-last)/1000; last=now;
    world.step(dt);
    bodies.forEach(o=>{
      const p=o.body.getPosition(), a=o.body.getAngle();
      o.el.style.transform =
        `translate(${p.x*SCALE-40}px,${p.y*SCALE-40}px) rotate(${a}rad)`;
    });
    requestAnimationFrame(update);
  })();
  // ホバー＆クリック
  bodies.forEach(o=>{
    o.el.addEventListener('mouseenter',()=>{
      o.body.applyLinearImpulse(
        Vec2((Math.random()-0.5)*1,(Math.random()-0.5)*1),
        o.body.getPosition()
      );
    });
    o.el.addEventListener('click',()=>{
      document.querySelectorAll('.toast').forEach(t=>t.remove());
      const t = document.createElement('div');
      t.className = [
        'toast',
        'fixed bottom-6 left-1/2 transform -translate-x-1/2',
        'bg-gray-900 text-white px-4 py-2 rounded-md',
        'transition-opacity duration-300'
      ].join(' ');
      t.textContent = `Clicked ${o.el.textContent}!`;
      document.body.appendChild(t);
      requestAnimationFrame(()=>t.style.opacity='1');
      setTimeout(()=>{
        t.style.opacity='0';
        t.addEventListener('transitionend',()=>t.remove());
      },1500);
    });
  });
  window.addEventListener('resize',()=>location.reload());
})();
