/* Once-only entrances keep content stable on reverse and slow scrolling. */
(()=>{
 const page=document.querySelector('#blive-charge');if(!page||page.dataset.initialized)return;
 page.dataset.initialized='true';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 // Animate inner layers rather than changing section dimensions.
 page.querySelectorAll('h2').forEach(h=>{const span=document.createElement('span');span.className='heading-ink';while(h.firstChild)span.appendChild(h.firstChild);h.appendChild(span);});
 page.querySelectorAll('.line-icon path,.line-icon rect,.line-icon circle').forEach(e=>e.setAttribute('pathLength','1'));
 page.querySelectorAll('.feature,.credentials article,.revenue-grid article,.dashboard-grid article').forEach(e=>e.classList.add('motion-tile'));
 const reveals=[...page.querySelectorAll('.reveal')];
 let observer;
 const finish=()=>{reveals.forEach(e=>e.classList.add('in-view'));observer?.disconnect();};
 if('IntersectionObserver' in window&&!reduced.matches){
  page.querySelectorAll('.feature-grid,.ecosystem-grid,.process-grid,.credentials,.revenue-grid').forEach(group=>[...group.children].forEach((e,i)=>e.style.setProperty('--delay',Math.min(i*120,480)+'ms')));
  observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   if(isIntersecting){target.classList.add('in-view');observer.unobserve(target);}
  }),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
  page.classList.add('motion-ready');
  const sections=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('section-entered');sections.unobserve(target);}}),{threshold:.1});
  page.querySelectorAll('section').forEach(e=>sections.observe(e));
  reveals.forEach(e=>observer.observe(e));
 }else finish();
 reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
 page.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const target=page.querySelector(link.getAttribute('href'));if(!target)return;
  event.preventDefault();const offset=parseFloat(getComputedStyle(page).getPropertyValue('--host-header-offset'))||0;
  window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-offset,behavior:reduced.matches?'instant':'smooth'});
 }));
 if(matchMedia('(hover:hover)').matches){
  page.querySelectorAll('.motion-tile,.button').forEach(tile=>{
   tile.addEventListener('pointermove',event=>{if(reduced.matches)return;const r=tile.getBoundingClientRect();tile.style.setProperty('--pointer-x',((event.clientX-r.left)/r.width*100)+'%');tile.style.setProperty('--pointer-y',((event.clientY-r.top)/r.height*100)+'%');});
  });
 }
 const form=page.querySelector('[data-demo-form]');
 if(form){
  // This preview has no endpoint and never sends or stores enquiry details.
  form.addEventListener('submit',event=>{event.preventDefault();const status=form.querySelector('.form-status');status.hidden=false;status.textContent='Design preview only. No details were sent. The live form will be connected to Zoho.';});
  form.querySelector('button[type="submit"]').disabled=false;
 }
})();
