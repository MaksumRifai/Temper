const grid=document.getElementById('levelGrid');
const unlocked=Number(localStorage.getItem('unlockedLevel'))||1;
LEVELS.forEach(l=>{
 const c=document.createElement('div');
 c.className='level-card';
 if(l.id<=unlocked){
  c.innerHTML=`<img src="${l.imageA}"><span>Level ${l.id}</span>`;
  c.onclick=()=>location.href=`game.html?level=${l.id}`;
 }else{
  c.classList.add('locked');
  c.innerHTML=`<img src="${l.imageA}"><span>🔒 Level ${l.id}</span>`;
 }
 grid.appendChild(c);
});