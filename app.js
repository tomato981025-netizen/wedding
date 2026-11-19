(function(){
'use strict';
var $=function(s){return document.querySelector(s)};
var WEDDING=new Date('2027-02-14T12:08:00+08:00').getTime();

/* ---------- 载入 ---------- */
var loading=$('#loading'),loaded=false;
function ready(){if(loaded)return;loaded=true;loading.classList.add('hide');setTimeout(function(){loading.style.display='none'},600)}
var pre=new Image();pre.onload=pre.onerror=function(){
  if(document.fonts&&document.fonts.load){document.fonts.load('1rem Pixel','我们结婚啦').then(ready,ready)}else ready();
};pre.src='assets/art/cover.jpg';
setTimeout(ready,5000);

/* ---------- 音乐 ---------- */
var bgm=$('#bgm'),mbtn=$('#music'),wanted=true;bgm.volume=.7;
function sync(){mbtn.classList.toggle('on',!bgm.paused)}
function play(){if(!wanted)return;var p=bgm.play();if(p&&p.catch)p.catch(function(){})}
bgm.addEventListener('play',sync);bgm.addEventListener('pause',sync);
mbtn.addEventListener('click',function(e){e.stopPropagation();if(bgm.paused){wanted=true;play()}else{wanted=false;bgm.pause()}});
function first(){play();document.removeEventListener('touchend',first);document.removeEventListener('click',first)}
document.addEventListener('touchend',first);document.addEventListener('click',first);
document.addEventListener('WeixinJSBridgeReady',play,false);
document.addEventListener('visibilitychange',function(){if(document.hidden)bgm.pause();else play()});

/* ---------- 封面按钮 ---------- */
$('#open').addEventListener('click',function(){
  play();
  var y=$('#letter').getBoundingClientRect().top+window.pageYOffset;
  try{window.scrollTo({top:y,behavior:'smooth'})}catch(e){window.scrollTo(0,y)}
});

/* ---------- 花瓣 ---------- */
var pet=$('#petals');
for(var i=0;i<12;i++){var p=document.createElement('i');
  p.style.left=(Math.random()*100)+'%';p.style.setProperty('--dx',(Math.random()*8-4)+'rem');
  p.style.animationDuration=(9+Math.random()*9)+'s';p.style.animationDelay=(-Math.random()*18)+'s';pet.appendChild(p)}

/* ---------- 好感度 ---------- */
var hrow=$('#hrow');
for(i=0;i<14;i++){var h=new Image();h.src='assets/ui/heart.png';h.alt='';h.style.animationDelay=(i*.12)+'s';hrow.appendChild(h)}

/* ---------- 日历 ---------- */
var grid=$('#calgrid'),lunar=['廿五','廿六','廿七','廿八','除夕','春节','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','元宵','十六','十七','十八','十九','二十','廿一','廿二','廿三'];
for(i=1;i<=28;i++){var c=document.createElement('i');
  if(i===14){c.className='day';c.innerHTML='14<img src="assets/ui/heart.png" alt=""><small>婚礼</small>'}
  else{c.innerHTML=i+'<small>'+lunar[i-1]+'</small>';if(i===5||i===6||i===20)c.className='fest'}
  grid.appendChild(c)}

/* ---------- 倒计时 ---------- */
function pad(n){return n<10?'0'+n:''+n}
function tick(){
  var d=WEDDING-Date.now(),past=d<0;if(past)d=-d;
  var s=Math.floor(d/1000),dd=Math.floor(s/86400);
  if(past&&dd<1){$('#cd-title').textContent='今天，我们结婚啦！'}
  else $('#cd-title').textContent=past?'我们已经结婚':'距离婚礼还有';
  $('#cd-d').textContent=dd;$('#cd-h').textContent=pad(Math.floor(s%86400/3600));
  $('#cd-m').textContent=pad(Math.floor(s%3600/60));$('#cd-s').textContent=pad(s%60);
}
tick();setInterval(tick,1000);

/* ---------- 四季相册 ---------- */
var SEASONS=[
 {k:'spring',n:'春',t:'春 · 繁花为拱',d:'雪山作证，鲜花为媒',c:'#4fae3a',art:'spring',real:3},
 {k:'summer',n:'夏',t:'夏 · 湖畔之约',d:'湖水很蓝，你很好看',c:'#2f8fe0',art:'lake',real:3},
 {k:'autumn',n:'秋',t:'秋 · 原野漫步',d:'风吹过花海，我牵着你',c:'#e08a1e',art:'meadow',real:1},
 {k:'winter',n:'冬',t:'冬 · 雪山誓言',d:'雪山之下，许你白头',c:'#5a9ad0',art:'snow',real:1}
];
var photos=[],wrap=$('#seasons');
SEASONS.forEach(function(s){
  var base=photos.length,html='';
  html+='<div class="season-h"><b style="background:'+s.c+'">'+s.n+'</b><div><strong>'+s.t+'</strong><span>'+s.d+'</span></div></div>';
  html+='<div class="flip"><div class="frame"><div class="stack"><img class="pixart" src="assets/art/'+s.art+'.jpg" alt="" loading="lazy"><img class="real" data-src="assets/p/'+s.k+s.real+'.jpg" alt=""></div></div><button class="btn toggle">看真人版</button></div>';
  html+='<div class="grid">';
  for(var j=1;j<=4;j++){photos.push('assets/p/'+s.k+j+'.jpg');
    html+='<figure class="frame" data-i="'+(base+j-1)+'"><img src="assets/p/'+s.k+j+'_t.jpg" alt="婚纱照" loading="lazy"></figure>'}
  html+='</div>';
  var el=document.createElement('div');el.className='season panel reveal';el.innerHTML=html;wrap.appendChild(el);
  var flip=el.querySelector('.flip'),btn=el.querySelector('.toggle'),real=el.querySelector('.real');
  flip.addEventListener('click',function(){
    if(!real.src)real.src=real.getAttribute('data-src');
    var on=flip.classList.toggle('real');btn.textContent=on?'看像素版':'看真人版';
  });
});
wrap.addEventListener('click',function(e){var f=e.target.closest?e.target.closest('figure[data-i]'):null;if(f)openLb(+f.getAttribute('data-i'))});

/* ---------- 大图 ---------- */
var lb=$('#lb'),lbImg=$('#lb-img'),cur=0;
function show(i){cur=(i+photos.length)%photos.length;lbImg.src=photos[cur];$('#lb-n').textContent=(cur+1)+' / '+photos.length}
function openLb(i){show(i);lb.hidden=false;document.body.style.overflow='hidden'}
function closeLb(){lb.hidden=true;document.body.style.overflow=''}
$('#lb-x').addEventListener('click',function(e){e.stopPropagation();closeLb()});
$('#lb-p').addEventListener('click',function(e){e.stopPropagation();show(cur-1)});
$('#lb-q').addEventListener('click',function(e){e.stopPropagation();show(cur+1)});
lbImg.addEventListener('click',function(e){e.stopPropagation()});
lb.addEventListener('click',closeLb);
var sx=0;
lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))});

/* ---------- 送祝福 ---------- */
var bn=0,sprites=['heart','heart','heart','star','junimo_g','junimo_p'];
try{bn=+localStorage.getItem('bless')||0}catch(e){}
function blessText(){if(bn>0)$('#bless-n').textContent='您已送出 '+bn+' 颗爱心，谢谢您！'}
blessText();
$('#bless').addEventListener('click',function(e){
  bn++;try{localStorage.setItem('bless',bn)}catch(_){}blessText();
  var r=e.currentTarget.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(var k=0;k<14;k++){(function(k){var im=new Image();im.className='fly';im.src='assets/ui/'+sprites[k%sprites.length]+'.png';
    var a=Math.random()*Math.PI*2,d=6+Math.random()*9;
    im.style.left=cx+'px';im.style.top=cy+'px';
    im.style.setProperty('--x',Math.cos(a)*d+'rem');im.style.setProperty('--y',(Math.sin(a)*d-6)+'rem');
    im.style.animationDelay=(k*.03)+'s';document.body.appendChild(im);
    setTimeout(function(){im.remove()},1600)})(k)}
});

/* ---------- 滚动出现 ---------- */
var rv=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){
    var el=en.target;el.classList.add('in');io.unobserve(el);
    if(el.classList.contains('paper')){[].forEach.call(el.querySelectorAll('.l'),function(l,i){l.style.transitionDelay=(.25+i*.45)+'s'})}
  }})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  [].forEach.call(rv,function(el){io.observe(el)});
}else{[].forEach.call(rv,function(el){el.classList.add('in')})}
})();
