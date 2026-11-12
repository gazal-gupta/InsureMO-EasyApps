/* ===== FIGURE NUMBERS (master copy: .claude/skills/insuremo-learning-guide/scripts/fig_numbers.js) =====
   Puts "Figure <level>.<n> · <title>" above every div.diagram in the open view.
   Level number comes from LEVELS[].n; title from the svg aria-label, else the nearest heading.
   Idempotent: runs after any DOM change, writes only when the text differs. */
(function(){
  if(window.__figNumbers)return;window.__figNumbers=1;
  const GENERIC=/^(swimlane|swimlane diagram|diagram|flowchart|chart)$/i;
  function levelNo(id){try{const l=(typeof LEVELS!=='undefined'?LEVELS:[]).find(x=>x.id===id);if(l&&l.n!=null)return String(l.n)}catch(e){}return id}
  function titleOf(d){
    const svg=d.querySelector('svg');let t=svg?(svg.getAttribute('aria-label')||''):'';
    if(!t||GENERIC.test(t.trim())){
      const box=d.closest('.sc-detail,.lc-card,.stage-card,.card,section.block,section,article');
      const h=box&&box.querySelector('h1,h2,h3,h4');t=h?h.textContent:'';
    }
    return t.replace(/\s+/g,' ').trim().replace(/^\d+(\.\d+)*\s*[·.:-]\s*/,'');
  }
  function run(){
    const v=[...document.querySelectorAll('section.view')].find(x=>!x.hidden&&x.offsetParent!==null);
    if(!v)return;
    const no=levelNo(v.id.replace(/^v-/,''));let k=0;
    v.querySelectorAll('.diagram').forEach(d=>{
      if(d.parentElement&&d.parentElement.closest('.diagram'))return;
      const svg=d.querySelector('svg');if(!svg)return;
      k++;const txt='Figure '+no+'.'+k+(titleOf(d)?' · '+titleOf(d):'');
      let cap=d.previousElementSibling;
      if(!cap||!cap.classList||!cap.classList.contains('fig-no')){cap=document.createElement('div');cap.className='fig-no';d.parentNode.insertBefore(cap,d)}
      if(cap.textContent!==txt)cap.textContent=txt;
    });
  }
  let t=null;const later=()=>{clearTimeout(t);t=setTimeout(run,60)};
  const st=document.createElement('style');
  st.textContent='.fig-no{font-family:var(--f-display,inherit);font-weight:700;font-size:13.5px;color:var(--ink,inherit);margin:6px 0 4px;letter-spacing:.01em}@media print{.fig-no{break-after:avoid}}';
  document.head.appendChild(st);
  window.addEventListener('hashchange',later);
  document.addEventListener('DOMContentLoaded',()=>{later();new MutationObserver(later).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']})});
  if(document.readyState!=='loading'){later();new MutationObserver(later).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']})}
})();
/* ===== END FIGURE NUMBERS ===== */
