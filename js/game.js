const id=Number(new URLSearchParams(location.search).get('level'));
const lvl=LEVELS.find(l=>l.id===id);
let life=3,found=0,usedHint=false,hit=new Set();

const soundCorrect = new Audio("assets/sounds/correct.mp3");
const soundWrong = new Audio("assets/sounds/wrong.mp3");

function effectCorrect(img) {
  soundCorrect.currentTime = 0;
  soundCorrect.play();
  img.classList.add("flash-correct");
  setTimeout(() => img.classList.remove("flash-correct"), 300);
}

function effectWrong(img) {
  soundWrong.currentTime = 0;
  soundWrong.play();

  img.classList.add("flash-wrong", "shake");
  setTimeout(() => {
    img.classList.remove("flash-wrong", "shake");
  }, 300);

  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
}

imgA.src=lvl.imageA;imgB.src=lvl.imageB;
function showHint(){
 if(usedHint) return;
 usedHint=true;
 const i=lvl.differences.findIndex((_,i)=>!hit.has(i));
 [cA,cB].forEach(c=>{
  const ctx=c.getContext('2d');
  const d=lvl.differences[i];
  ctx.strokeStyle='yellow';ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(d.x,d.y,d.r+10,0,Math.PI*2);ctx.stroke();
 });
}
document.querySelectorAll('img').forEach(img=>{
 img.onclick=e=>{
  const r=img.getBoundingClientRect();
  const x=e.clientX-r.left,y=e.clientY-r.top;
  let ok=false;
  lvl.differences.forEach((d,i)=>{
   if(!hit.has(i)&&Math.hypot(x-d.x,y-d.y)<d.r){
    hit.add(i);found++;ok=true;
    document.getElementById('found').textContent=found;
   }
  });
  if(ok){
    effectCorrect(img);
  } else {
    effectWrong(img);
    life--;
    document.getElementById('life').textContent=life;
  }
  if(life<=0){alert('Game Over');location.href='index.html'}
  if(found===5){
   localStorage.setItem('unlockedLevel',id+1);
   alert('Selesai');location.href='index.html'
  }
 }
});