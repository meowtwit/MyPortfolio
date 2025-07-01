// ピンク滲みエフェクト
export function initPaint() {
  const c = document.getElementById('paintCanvas');
  const ctx = c.getContext('2d');
  let w,h, mx=innerWidth/2, my=innerHeight/2;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  });
  function init() {
    w = c.width = innerWidth;
    h = c.height = innerHeight;
  }
  function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.002)';
    ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createRadialGradient(mx,my,0,mx,my,500);
    grad.addColorStop(0,'rgba(255,156,243,0.06)');
    grad.addColorStop(1,'rgba(255,156,243,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(mx-500,my-500,1000,1000);
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', init);
  init(); loop();
}
