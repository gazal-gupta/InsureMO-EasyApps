const IMG_DIMS={"image1.png":[849,488],"image10.png":[1657,616],"image11.png":[1657,614],"image12.png":[962,524],"image13.png":[1661,340],"image14.png":[1646,781],"image15.png":[1651,604],"image16.png":[1647,701],"image17.jpeg":[1380,768],"image18.png":[1649,602],"image19.png":[1623,1061],"image2.jpeg":[1208,652],"image20.png":[1639,936],"image21.png":[1414,745],"image22.png":[1427,745],"image23.png":[1437,745],"image24.png":[924,434],"image25.png":[1430,683],"image26.png":[1439,704],"image27.png":[1440,700],"image28.png":[1437,689],"image29.png":[1436,689],"image3.jpeg":[1382,368],"image30.png":[1422,687],"image31.png":[1438,683],"image32.png":[1431,458],"image33.png":[1432,678],"image34.png":[1647,934],"image35.png":[1651,503],"image36.png":[1349,933],"image37.png":[1313,405],"image38.png":[1090,599],"image39.png":[633,367],"image4.jpeg":[1377,794],"image40.png":[1159,431],"image41.png":[633,367],"image42.png":[1159,436],"image43.png":[633,368],"image44.png":[1109,418],"image45.png":[633,384],"image46.png":[1680,758],"image47.png":[1793,822],"image48.png":[1672,730],"image49.png":[1666,711],"image5.jpeg":[1379,317],"image50.png":[1920,608],"image51.png":[1788,714],"image52.png":[1806,904],"image53.png":[1757,712],"image54.png":[1760,581],"image55.png":[1782,809],"image56.png":[1793,611],"image57.png":[1429,693],"image58.png":[1178,747],"image6.jpeg":[1379,899],"image7.png":[1647,578],"image8.png":[1620,1097],"image9.png":[1656,935]};
/* ===== Screenshots from the source guide, placed by screen and step =====
   step: 'pre' = prerequisite, number = index in the screen's steps list (0-based) */
const IMG_DIR='img/';
const imgSrc=n=>(typeof IMG_DATA!=='undefined'&&IMG_DATA[n])||(IMG_DIR+n);
const SHOT=(img,step,cap)=>({img,step,cap});
const SHOTS={
 prepaid:[SHOT('image3.jpeg','pre','Easy PA, before: after Send To BCP the proposal status is Waiting For Payment and no policy number exists yet.'),
  SHOT('image4.jpeg',1,'Premium Pre-Paid search and receipt info. The result shows Total Premium Due, Policy Premium and Receipt Amount; branch, payment method, dates, currency, payer and payer type are filled in.'),
  SHOT('image2.jpeg',1,'Validation. Collection Amount (A) × Exchange Rate (B) gives Receipt Amount in local currency (C). If C is not equal to Policy Premium (D), submit fails with "Receipt Amount need equal Policy Premium".'),
  SHOT('image5.jpeg',3,'Easy PA, after: the proposal is now Issued and has a Policy No. BCP triggered this issue automatically.')],
 premcoll:[SHOT('image6.jpeg',0,'Policy Premium Collection. Collected By (Single Policy / Multiple Policies), ARAP Type fixed to Policy Premium, ARAP Result with Use Commission, and the Collection Info section.')],
 singlecoll:[SHOT('image9.png',0,'Single Collection. The ARAP Type drop-down lists types such as Claim Recovery from Co-follower, Fac Premium, XOL Premium (MDP / Adjustment / Reinstatement), XOL Reinsurance Administration Fee and Proportional Reinsurance Administration Fee.')],
 suspense:[SHOT('image7.png',0,'The screen is labelled "Producer Collection" in the system. Producer search, then branch, payment method, dates, currency and amounts.')],
 application:[SHOT('image8.png',2,'Application. Receipt Info from the chosen receipt (including Remaining Receipt Balance), ARAP Search, and the ARAP Result with installment rows (Current Period 1 to 3 of 4) and one row ticked.')],
 revcoll:[SHOT('image10.png',0,'Reverse Collection. Receipt search; the result shows Receipt Amount, Collection Amount, Bank Charge and Receipt Balance.')],
 revapp:[SHOT('image11.png',0,'Reverse Application & Offset. Search by Transaction No. (OFS…); result shows type Application, date, related receipt (RCE…) and amount.')],
 refappr:[SHOT('image13.png',2,'Pending Approval. Transaction Date From and To are mandatory. Click Approve (highlighted) after reviewing with Export To Excel.'),
  SHOT('image14.png',3,'Exclusion List appears after Approve. Add DN/CNs that must not be approved, then Submit. Cancel discards the approval.')],
 singleref:[SHOT('image15.png',1,'Labelled "Single Payment" in the system. Tick a payment (PYMT…), then enter Payment Date and Insurance Company Bank Account on that row.')],
 massref:[SHOT('image16.png',1,'Labelled "Massive Payment" in the system. Export To Excel asks "Do you confirm to export to the Excel?". Insurance Company Bank Account is mandatory.')],
 rcptref:[SHOT('image17.jpeg',1,'Receipt Refund. Ticking a receipt copies its Payer into Payer Name and its Balance (211.00) into Payment Amount. Both are read-only.')],
 revref:[SHOT('image18.png',0,'Labelled "Reverse Payment" in the system. Search by payment, policy, claim or statement; the result shows Payment Status (here Approved).')],
 arapoff:[SHOT('image19.png',3,'ARAP Offset. Two rows ticked with offset amounts −10.00 and 10.00, so Total Running ARAP Offset Amount is 0.00 and Submit is allowed.')],
 tolerance:[SHOT('image20.png',2,'Tolerance Offset. Transaction Type = Tolerance; Write-off Amount 31.47 entered on the ticked row.')],
 arapmgmt:[SHOT('image21.png',0,'ARAP Management search (path: BCP Transaction / Internal / ARAP Management) with Export To Excel.'),
  SHOT('image22.png',1,'The Action column (highlighted) has Edit and Delete icons for Outstanding records only.'),
  SHOT('image23.png',1,'Edit dialog. Only fields allowed in arapFieldAllowUpdate appear: Payment Method, Payer/Payee Category, Code and Name. Click Update.')],
 stmtgen:[SHOT('image24.png',0,'Statement batch job: Job Name statementJob, micro service bcp-core, parameter dueDate. Leave dueDate empty to use the current time.')],
 stmtcoll:[SHOT('image25.png',0,'Step 1: in Application, query the receipt (RCT…) collected for the statement payer.'),
  SHOT('image26.png',1,'Step 2: search by Statement No. Both AR and AP rows of the statement are returned.'),
  SHOT('image27.png',2,'Step 3: tick the rows. Application Amount (83.97) must be above 0 and below the receipt balance.'),
  SHOT('image28.png',3,'Step 4: success message with the offset Transaction No. (OFS…). AR and AP were netted first, then the receipt covered the rest.')],
 stmtref:[SHOT('image29.png',0,'Statement Refund. Query the statement; AR and AP rows appear together.'),
  SHOT('image30.png',1,'Tick rows with the same Payer/Payee Category and Name. Payment Amount (−214.14) must be below 0.'),
  SHOT('image31.png',2,'Success message with the new Payment No. (PYMT…). Pay it with Single or Massive Refund.')],
 stmtmgmt:[SHOT('image32.png',0,'Statement Search.'),SHOT('image33.png',1,'Statement result with the ARAP List link (highlighted).'),SHOT('image57.png',2,'ARAP List dialog. Tick items and click Remove; the statement total is recalculated.')],
 singlesettle:[SHOT('image34.png',1,'Single Settlement (Sales Channel / Commission). Commission rows ticked, then Payment Information: payee, payment method, currencies, exchange rate (4.81) and payment amount.')],
 masssettle:[SHOT('image35.png',0,'Massive Settlement. One result row per producer with commission and payment amount, and a Details link.')],
 qstats:[SHOT('image36.png',0,'BCP Statistics dashboard: ARAP / Collection / Payment tabs, search condition, three KPI cards and the custom report.'),
  SHOT('image37.png',1,'Filter icon opens the transfer box: 32 unselected fields on the left, the selected ones on the right, with Push and Pull.'),
  SHOT('image38.png',1,'Index Management for ARAP: schema bcp_arap, read and write aliases, rebuild job arapIndexRebuildBatch, and Need Display / Only Exact Search per field.'),
  SHOT('image39.png',2,'Total Number of Transaction card with Day / Month and status legend.'),SHOT('image40.png',2,'Transaction count detail view over the full period.'),
  SHOT('image41.png',2,'Total ARAP Amount card as a line chart.'),SHOT('image42.png',2,'ARAP amount detail: stacked bars by month.'),
  SHOT('image43.png',2,'Total ARAP Balance card.'),SHOT('image44.png',2,'Balance detail table by day: Outstanding, Settled, Canceled.'),
  SHOT('image45.png',3,'Get My Own Statistics Report: Group Type (Product, ARAP Status), Average Field (Balance), Sum Field (Amount, Balance).')],
 qarap:[SHOT('image46.png',0,'Query ARAP search and results with Fee and Commission links, N (note) and the view icon.'),SHOT('image55.png',1,'Expanded detail (highlighted) loaded from the data dictionary: quote, policy, endorsement, product, payment method, branch, producer and more.')],
 qrcpt:[SHOT('image47.png',0,'Query Receipt. The N note link and view icon are highlighted.')],
 qpay:[SHOT('image48.png',0,'Query Payment with statuses Reversed and Requested.')],
 qoff:[SHOT('image49.png',0,'Query Application & Offset. Offset types Application, Tolerance and Arap; payer names such as StatementCollection, ToleranceOffset, PolicyCollection, PrePaidPolicy.')],
 qgl:[SHOT('image50.png',0,'GL Entry Search. Status and Due Post Date are mandatory; results show reference, transaction type, post date, status, attempt times, voucher and fee IDs.')],
 qstmt:[SHOT('image51.png',0,'Query Statement with the ARAP List link per statement.')],
 qbiz:[SHOT('image52.png',1,'Query BizTransaction fee pop-up: Settlement Details Data and Claim ARAP - Direct Business, each −5.05 (negative = payable).')],
 qconfig:[SHOT('image53.png',0,'User preference transfer box opened from the gear icon (highlighted).'),SHOT('image54.png',1,'Index Management for the Policy index: schema, aliases, data provider, rebuild job and field mappings.'),SHOT('image56.png',2,'Data Dictionary: Module BCP, Group BCP_Core, Context Common; BcpArap tenant fields ARAPSequence and AccountHolderIdNo.')]
};
const AKA={suspense:'Producer Collection',refappr:'Payment Approval',singleref:'Single Payment',massref:'Massive Payment',revref:'Reverse Payment',premcoll:'Premium Collection & Application',singlecoll:'Collection & Application',revapp:'Reverse Application&Offset'};

function fig(sh){
  const d=IMG_DIMS[sh.img]||[1200,700];
  return `<figure class="shot"><button type="button" class="shot-btn" data-src="${imgSrc(sh.img)}" data-cap="${esc(sh.cap)}" aria-label="Open full-size screenshot"><img src="${imgSrc(sh.img)}" width="${d[0]}" height="${d[1]}" loading="lazy" alt="${esc(sh.cap)}"></button><figcaption>${esc(sh.cap)} <span class="muted">· ${d[0]}×${d[1]} · click to enlarge</span></figcaption></figure>`;
}
function stepsWithShots(s){
  const sh=SHOTS[s.id]||[];
  const pre=sh.filter(x=>x.step==='pre');
  return `${pre.length?`<div class="stepfigs">${pre.map(fig).join('')}</div>`:''}
  <h4>Steps${sh.length?` <span class="tag">${sh.length} screenshot${sh.length>1?'s':''}</span>`:''}</h4>
  <ol class="shotsteps">${s.steps.map((x,i)=>{const f=sh.filter(y=>y.step===i);return `<li><div class="st-txt"><span class="st-n">${i+1}</span><span>${esc(x)}</span></div>${f.length?`<div class="stepfigs">${f.map(fig).join('')}</div>`:''}</li>`}).join('')}</ol>`;
}
function openLightbox(src,cap){
  let lb=$('#lightbox');
  if(!lb){lb=document.createElement('div');lb.id='lightbox';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
    lb.innerHTML=`<div class="lb-bar"><span class="lb-cap"></span><div class="lb-act"><button type="button" class="theme-btn" data-z>Actual size</button><button type="button" class="theme-btn" data-x>Close</button></div></div><div class="lb-body"><img alt=""></div>`;
    document.body.appendChild(lb);
    $('[data-x]',lb).addEventListener('click',()=>{lb.hidden=true});
    $('[data-z]',lb).addEventListener('click',e=>{lb.classList.toggle('actual');e.target.textContent=lb.classList.contains('actual')?'Fit to screen':'Actual size'});
    lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-body'))lb.hidden=true});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden)lb.hidden=true});}
  lb.classList.remove('actual');$('[data-z]',lb).textContent='Actual size';
  $('img',lb).src=src;$('img',lb).alt=cap;$('.lb-cap',lb).textContent=cap;lb.hidden=false;$('[data-x]',lb).focus();
}
document.addEventListener('click',e=>{const b=e.target.closest('.shot-btn');if(b)openLightbox(b.dataset.src,b.dataset.cap)});
