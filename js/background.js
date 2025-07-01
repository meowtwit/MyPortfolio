// 星＆青紫流体背景
export function initBackground() {
  // cosmos（星）
  {
    const c = document.getElementById('cosmos');
    const ctx = c.getContext('2d');
    let w,h,stars=[];
    function init() {
      w = c.width = innerWidth;
      h = c.height = innerHeight;
      stars = Array.from({length:120}, ()=>({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*1.5,
        alpha: Math.random()*0.6 + 0.2
      }));
    }
    function draw() {
      ctx.clearRect(0,0,w,h);
      stars.forEach(s => {
        ctx.globalAlpha = s.alpha*(0.7 + 0.3*Math.random());
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2*Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', init);
    init(); draw();
  }

  // starfield（流体グラデ＋ブロブ）
  {
    const c = document.getElementById('starfield');
    const ctx = c.getContext('2d');
    let w,h,baseGrad;
    function init() {
      w = c.width = innerWidth;
      h = c.height = innerHeight;
      baseGrad = ctx.createLinearGradient(0,0,w,h);
      baseGrad.addColorStop(0,   '#001f3f');
      baseGrad.addColorStop(0.5, '#3f007f');
      baseGrad.addColorStop(1,   '#6a0dad');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0,0,w,h);
    }
    function draw(time) {
      const t = time * 0.00002;
      // ブロブ①：ブルー
      const x1 = (Math.sin(t)*0.5+0.5)*w;
      const y1 = (Math.cos(t)*0.5+0.5)*h;
      let blob = ctx.createRadialGradient(
        x1,y1,0, x1,y1,Math.max(w,h)*0.7
      );
      blob.addColorStop(0,'rgba(0,100,200,0.5)');
      blob.addColorStop(1,'rgba(0,100,200,0)');
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = blob;
      ctx.fillRect(0,0,w,h);

      // ブロブ②：マゼンタ
      const x2 = (Math.cos(t*1.2)*0.5+0.5)*w;
      const y2 = (Math.sin(t*1.2)*0.5+0.5)*h;
      blob = ctx.createRadialGradient(
        x2,y2,0, x2,y2,Math.max(w,h)*0.7
      );
      blob.addColorStop(0,'rgba(200,50,150,0.4)');
      blob.addColorStop(1,'rgba(200,50,150,0)');
      ctx.fillStyle = blob;
      ctx.fillRect(0,0,w,h);

      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', init);
    init(); requestAnimationFrame(draw);
  }
}
