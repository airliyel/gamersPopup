
const articles=[...document.querySelectorAll('.game-article')];
const targetButtons=[...document.querySelectorAll('[data-target]')];
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('#site-nav');
function openGame(id,pushHash=true){
 const target=document.getElementById(id); if(!target)return;
 articles.forEach(a=>a.classList.toggle('active',a.id===id));
 targetButtons.forEach(b=>b.classList.toggle('active',b.dataset.target===id));
 if(pushHash)history.replaceState(null,'',`#${id}`);
 nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false');
 target.scrollIntoView({behavior:'smooth',block:'start'});
}
targetButtons.forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.target)));
document.querySelectorAll('[data-scroll-games]').forEach(b=>b.addEventListener('click',()=>document.querySelector('#games').scrollIntoView({behavior:'smooth'})));
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
const hash=location.hash.replace('#',''); if(document.getElementById(hash)?.classList.contains('game-article'))openGame(hash,false);
