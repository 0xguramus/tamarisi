(function(){
  var root=document.documentElement, RM=root.classList.contains('rm');
  var nav=document.querySelector('.nav'), toggle=document.querySelector('.nav__toggle');
  toggle.addEventListener('click',function(){var o=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',o)});
  document.querySelectorAll('.nav__links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')})});

  // hero video: hide if missing; pause when off-screen
  var v=document.querySelector('.hero__video');
  if(v){var src=v.querySelector('source');
    var fail=function(){v.style.display='none'};
    if(src)src.addEventListener('error',fail);v.addEventListener('error',fail);
    if('IntersectionObserver' in window)new IntersectionObserver(function(e){
      if(e[0].isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause();
    }).observe(v);
  }

  // products poster: fall back to full-width grid if image missing
  var poster=document.querySelector('.products__poster img');
  if(poster){var noPoster=function(){var l=document.querySelector('.products__layout');l.classList.add('no-poster');poster.closest('figure').remove()};
    var ps=poster.parentNode.querySelector('source');
    poster.addEventListener('error',noPoster);
    if(poster.complete&&poster.naturalWidth===0&&poster.currentSrc)noPoster();
  }

  // split statement into words
  var wordsEls=[];
  document.querySelectorAll('[data-words]').forEach(function(el){
    var parts=el.textContent.trim().split(/\s+/);el.textContent='';
    parts.forEach(function(w,i){var s=document.createElement('span');s.className='w';s.textContent=w;el.appendChild(s);if(i<parts.length-1)el.appendChild(document.createTextNode(' '))});
    wordsEls.push({pin:el.closest('[data-pin]'),words:[].slice.call(el.children),last:[]});
  });

  // stagger indices
  document.querySelectorAll('[data-stagger]').forEach(function(g){
    [].forEach.call(g.children,function(c,i){c.style.setProperty('--i',i%4)});
  });

  // reveal on enter
  var revealEls=[].slice.call(document.querySelectorAll('[data-reveal],[data-stagger]>*'));
  if(RM||!('IntersectionObserver' in window)){revealEls.forEach(function(e){e.classList.add('is-in')})}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0.05});
    revealEls.forEach(function(e){io.observe(e)});}

  function onNav(){nav.classList.toggle('is-scrolled',window.scrollY>40)}
  window.addEventListener('scroll',onNav,{passive:true});onNav();

  if(!RM){
    var pins=[].slice.call(document.querySelectorAll('[data-pin]'));
    var par=[].slice.call(document.querySelectorAll('[data-parallax]'));
    var zooms=[].slice.call(document.querySelectorAll('img[data-zoom]'));
    var scaleIns=[].slice.call(document.querySelectorAll('[data-scale-in]'));
    var clamp=function(x){return x<0?0:x>1?1:x};
    var ticking=false;
    var frame=function(){
      ticking=false;var vh=window.innerHeight;
      pins.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;
        var p=clamp(-r.top/Math.max(1,r.height-vh));el.style.setProperty('--p',p.toFixed(4));el._p=p});
      wordsEls.forEach(function(o){var p=o.pin&&o.pin._p!=null?o.pin._p:1,n=o.words.length,q=clamp((p-.08)*1.45);
        o.words.forEach(function(w,i){var op=(.14+.86*clamp(q*n-i)).toFixed(2);if(o.last[i]!==op){w.style.opacity=op;o.last[i]=op}})});
      par.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
        var k=parseFloat(el.getAttribute('data-parallax'))||0;var c=(r.top+r.height/2-vh/2);
        el.style.transform='translate3d(0,'+(c*k).toFixed(1)+'px,0)'});
      zooms.forEach(function(img){var box=img.closest('figure')||img;var r=box.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
        var t=clamp((vh-r.top)/(vh*.9));img.style.setProperty('--z',(1.16-.16*t).toFixed(4))});
      scaleIns.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
        var t=clamp((vh-r.top)/(vh*.75));el.style.setProperty('--s',(.86+.14*t).toFixed(4));el.style.setProperty('--o',(.35+.65*t).toFixed(3))});
    };
    var req=function(){if(!ticking){ticking=true;requestAnimationFrame(frame)}};
    window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);
    window.addEventListener('load',req);frame();
  }

  // gentle snow in hero
  var c=document.querySelector('.hero__snow');
  if(!c||RM)return;
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
