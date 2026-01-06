const id=Number(new URLSearchParams(location.search).get('level'));
const lvl=LEVELS.find(l=>l.id===id);
let life=3,found=0,usedHint=false,hit=new Set();
let locked = false; // prevent actions while finishing (playing end sound / redirect)

const soundCorrect = new Audio("assets/sounds/correct.mp3");
const soundWrong = new Audio("assets/sounds/wrong.mp3");
// updated sound paths to match existing assets directory
const soundFailed = new Audio("assets/sounds/failed.mp3");
const soundDone = new Audio("assets/sounds/done.mp3");

function playAndThen(sound, onEnd) {
  // Play the sound and call onEnd when playback finishes.
  // If playback is blocked or fails, call onEnd immediately.
  let fallbackTimer = null;
  function finish() {
    if (fallbackTimer) clearTimeout(fallbackTimer);
    onEnd();
  }

  // Ensure we only call onEnd once even if multiple events fire
  const onceEnd = () => finish();

  // Try to play
  try {
    sound.currentTime = 0;
  } catch (e) {
    // ignore
  }

  const playPromise = sound.play();
  // Add ended listener
  sound.addEventListener('ended', onceEnd, { once: true });

  // Fallback: if duration is available, use it; otherwise use 5s.
  const durMs = (Number.isFinite(sound.duration) && sound.duration > 0)
    ? Math.round(sound.duration * 1000) + 200
    : 5000;
  fallbackTimer = setTimeout(() => {
    // If ended didn't fire, fallback
    try { sound.removeEventListener('ended', onceEnd); } catch (e) {}
    finish();
  }, durMs);

  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      // Playback failed (autoplay policy, etc.) — run onEnd immediately
      try { sound.removeEventListener('ended', onceEnd); } catch (e) {}
      finish();
    });
  }
}

function effectCorrect(img) {
  soundCorrect.currentTime = 0;
  soundCorrect.play().catch(()=>{}); // ignore play errors
  img.classList.add("flash-correct");
  setTimeout(() => img.classList.remove("flash-correct"), 300);
}

function effectWrong(img) {
  soundWrong.currentTime = 0;
  soundWrong.play().catch(()=>{}); // ignore play errors

  img.classList.add("flash-wrong", "shake");
  setTimeout(() => {
    img.classList.remove("flash-wrong", "shake");
  }, 300);

  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
}
  //draw a green circle for correct hits on a canvas context
function drawCorrectCircle(ctx, d) {
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(d.x, d.y, d.r + 5, 0, Math.PI * 2);
  ctx.stroke();
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
  if (locked) return; // ignore clicks while finishing
  const r=img.getBoundingClientRect();
  const x=e.clientX-r.left,y=e.clientY-r.top;
  let ok=false;
  lvl.differences.forEach((d,i)=>{
   if(!hit.has(i)&&Math.hypot(x-d.x,y-d.y)<d.r){
    hit.add(i);found++;ok=true;
    document.getElementById('found').textContent=found;

    // draw the green circle on both canvases to indicate discovered difference
    [cA, cB].forEach(c => {
      const ctx = c.getContext('2d');
      drawCorrectCircle(ctx, d);
    });
   }
  });
  if(ok){
    effectCorrect(img);
  } else {
    effectWrong(img);
    life--;
    document.getElementById('life').textContent=life;
  }
  if(life<=0){
    // play failed sound on Game Over, wait until it finishes, then alert and redirect
    locked = true;
    playAndThen(soundFailed, () => {
      alert('Game Over');
      location.href='index.html';
    });
  }
  if(found===5){
   // unlock level immediately, then play done sound and wait before redirecting
   localStorage.setItem('unlockedLevel',id+1);
   locked = true;
   playAndThen(soundDone, () => {
     alert('Selesai');
     location.href='index.html';
   });
  }
 }
});
