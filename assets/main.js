(function(){
  var nav=document.querySelector('.nav'), toggle=document.querySelector('.nav__toggle');
  function onScroll(){nav.classList.toggle('is-scrolled',window.scrollY>40)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  toggle.addEventListener('click',function(){var o=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',o)});
  document.querySelectorAll('.nav__links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')})});

  // hero video: hide the element if the file is missing so the poster background shows
  var v=document.querySelector('.hero__video');
  if(v){var s=v.querySelector('source');
    function fail(){v.style.display='none'}
    if(s) s.addEventListener('error',fail); v.addEventListener('error',fail);
  }

  // reveal on scroll
  var els=document.querySelectorAll('.section__head,.why__photo,.why__text,.pcard,.gitem,.bcard,.clist li');
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){el.classList.add('reveal');io.observe(el)});
  }

  // gentle snow in hero
  var c=document.querySelector('.hero__snow');
  if(!c||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var ctx=c.getContext('2d'),w,h,flakes=[],dpr=Math.min(window.devicePixelRatio||1,2);
  function size(){w=c.clientWidth;h=c.clientHeight;c.width=w*dpr;c.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  size();window.addEventListener('resize',size);
  var n=Math.round(Math.min(70,w/18));
  for(var i=0;i<n;i++)flakes.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.8+.6,s:Math.random()*.5+.25,d:Math.random()*Math.PI*2,o:Math.random()*.5+.3});
  var visible=true;
  new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(c);
  (function tick(){
    if(visible){ctx.clearRect(0,0,w,h);
      flakes.forEach(function(f){f.y+=f.s;f.d+=.01;f.x+=Math.sin(f.d)*.3;
        if(f.y>h+5){f.y=-5;f.x=Math.random()*w}
        ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,6.283);ctx.fillStyle='rgba(255,255,255,'+f.o+')';ctx.fill()});}
    requestAnimationFrame(tick);
  })();
})();
