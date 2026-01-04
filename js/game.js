const p=new URLSearchParams(location.search);
const id=Number(p.get('level'));
const level=LEVELS.find(l=>l.id===id);
let life=3,found=0,hitSet=new Set();
imgA.src=level.imageA;imgB.src=level.imageB;
document.querySelectorAll('.game-area img').forEach(img=>{
 img.onclick=e=>{
  const r=img.getBoundingClientRect();
  const x=e.clientX-r.left,y=e.clientY-r.top;
  let hit=false;
  level.differences.forEach((d,i)=>{
   if(!hitSet.has(i)&&Math.hypot(x-d.x,y-d.y)<d.r){
    hitSet.add(i);found++;hit=true;
    document.getElementById('found').textContent=found;
   }
  });
  if(!hit){life--;document.getElementById('life').textContent=life;}
  if(life<=0){alert('Game Over');location.href='index.html';}
  if(found===5){
   alert('Level Selesai');
   localStorage.setItem('unlockedLevel',id+1);
   location.href='index.html';
  }
 };
});