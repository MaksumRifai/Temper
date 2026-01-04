const g=document.getElementById('levelGrid');
const u=Number(localStorage.getItem('unlockedLevel'))||1;
LEVELS.forEach(l=>{
 const d=document.createElement('div');
 if(l.id<=u){
  d.innerHTML=`<img src="${l.imageA}" width="100"><div>Level ${l.id}</div>`;
  d.onclick=()=>location.href=`game.html?level=${l.id}`;
 }else{
  d.innerHTML=`<img src="${l.imageA}" width="100" style="filter:grayscale(1);opacity:.4"><div>🔒</div>`;
 }
 g.appendChild(d);
});