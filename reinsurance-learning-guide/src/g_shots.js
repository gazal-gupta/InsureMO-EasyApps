const IMG_DIMS={"image1.png":[1507,859],"image10.png":[1378,151],"image11.png":[1626,506],"image12.png":[1626,192],"image13.png":[1626,197],"image14.png":[1787,286],"image15.png":[1378,162],"image16.png":[1626,540],"image17.png":[1792,204],"image18.png":[1779,197],"image19.png":[1626,313],"image2.png":[30,30],"image20.png":[1626,333],"image21.png":[1379,546],"image22.png":[1381,149],"image23.png":[1800,113],"image24.png":[586,59],"image25.png":[15,15],"image26.png":[1626,197],"image27.png":[1657,824],"image28.png":[1707,792],"image29.png":[1626,695],"image3.png":[24,23],"image30.png":[1631,751],"image31.png":[1818,293],"image32.png":[1379,255],"image33.png":[1648,585],"image34.png":[1813,391],"image35.png":[1377,240],"image36.png":[1380,115],"image37.png":[1634,369],"image38.png":[1381,182],"image39.png":[1626,436],"image4.png":[27,27],"image40.png":[1634,259],"image41.png":[1626,562],"image42.png":[1626,767],"image43.png":[1626,569],"image44.png":[1626,351],"image45.png":[1430,622],"image46.png":[1814,228],"image47.png":[1634,373],"image48.png":[1634,249],"image49.png":[1626,493],"image5.png":[23,30],"image50.png":[1697,420],"image51.png":[1634,57],"image52.png":[1634,373],"image53.png":[1626,283],"image54.png":[1589,134],"image55.png":[1379,258],"image56.png":[1672,324],"image57.png":[1802,427],"image58.png":[1378,253],"image59.png":[1377,344],"image6.png":[1379,362],"image60.png":[1626,490],"image61.png":[1626,528],"image62.png":[1808,537],"image63.png":[1811,602],"image64.png":[1626,433],"image7.png":[1626,369],"image8.png":[619,68],"image9.png":[17,18]};
/* ===== Screenshots from the XRI user guide, placed by screen and step =====
   step: 'pre' = prerequisite, number = index in the screen's steps list (0-based) */
const IMG_DIR='img/';
const imgSrc=n=>(typeof IMG_DATA!=='undefined'&&IMG_DATA[n])||(IMG_DIR+n);
const SHOT=(img,step,cap)=>({img,step,cap});
const SHOTS={
 prep:[SHOT('image2.png',0,'Connected: network icon (wired).'),SHOT('image3.png',0,'Connected: signal bars.'),SHOT('image4.png',0,'Not connected: red cross on the network icon.'),SHOT('image5.png',0,'Not connected: warning sign on the signal bars.')],
 nav:[SHOT('image6.png',0,'Two-level menu: Reinsurance > Reinsurance Definition > Outwards Treaty Management, with Risk Allocation, Reinsurance Recovery, Reinsurance Statement, Settlement and Reinsurance Query below. The quick bar is top right.'),SHOT('image9.png',4,'Edit icon (pencil): open a saved record to continue.'),SHOT('image25.png',4,'Add icon (plus): add a row, section or subsection.')],
 otsearch:[SHOT('image7.png',1,'Treaty search conditions: Treaty Number, Name, Status, Priority Type, Type, Recipient, Risk Category, start and expiry dates, Accounting Year.'),SHOT('image8.png',2,'Operation buttons: Create, Review, Adjustment, Renewal, Copy, Settle.')],
 otcreate:[SHOT('image10.png',0,'Create Treaty pop-up: Treaty Priority Type, Risk Category and Treaty Type are required. Continue opens the Treaty Level.'),
  SHOT('image11.png',1,'Basic information. Treaty Number TO0128 is generated; Treaty Status shows "Newly built". Coinsurance Claim Recovery is shown because Treaty Biz Category = Co-insurance.'),
  SHOT('image12.png',2,'IFRS17 Condition: Major Evaluation Result, Profit Level, Split Period Type, Prem Rate Guaranteed Date (required) and Portfolio Name.'),
  SHOT('image13.png',3,'Section Summary: one quota share section for 100004-Accident Insurance in USD, with edit and delete icons.'),
  SHOT('image14.png',4,'Currency for Tax: currency, exchange rate model, agreed frequency (End of account month), agreed rate and date; Installment Settlement.'),
  SHOT('image15.png',5,'Financial Condition: Accounting Year Basis, SOA Frequency (quarterly, required), SOA Notification Period 60 days, Settlement Period 90 days.'),
  SHOT('image16.png',6,'Warranty Info: Warranty Method Reserve; premium reserve and OS loss reserve with %, interest rate and release frequency.'),
  SHOT('image17.png',7,'Loss Participation Interval: basis, loss ratio from and to, participation share, first calculation and interval in months.'),
  SHOT('image18.png',8,'Event Limit: event, currency, limit and applicable layer.'),
  SHOT('image19.png',9,'Commission Info: reinsurance commission (type, rate, earthquake commission) and profit commission (rate, management fees rate, loss rollover period).'),
  SHOT('image20.png',10,'Participant Info: Broker Share, Direct Recipient Ratio; rows for reinsurance party, ceded share, payer, lead reinsurer, warranty, commission; Add additional recipient.'),
  SHOT('image21.png',11,'Treaty Rules: reinsurance conditions (applicable layer, coinsurance type Co Leader), reinsurance exclusion, manual checking of exclusion (upload), loss recovery exclusions.'),
  SHOT('image22.png',12,'Notes.'),SHOT('image23.png',13,'Treaty Status Record: status, updated date, effective time, modified by, reviewer, descriptions.'),
  SHOT('image24.png',14,'Buttons: Image Management, Save, Submit, Back.')],
 otsection:[SHOT('image26.png',0,'Section Summary: click the pencil to enter the Section Level.'),SHOT('image27.png',1,'Section Level: Section Basic Info, Subsection Total (limit 5,000,000,000.00), Claim Conditions (Risk Attaching; loss notification, cash call, claim cooperation and control amounts) and Table of limit (treaty capacity ratio 100%).')],
 otsub:[SHOT('image28.png',0,'Proportional subsection (Life example): Execution Order, Small Cession 10,000, recalculation flags, Risk Accumulation Group; Limit table with SAR/SI basis, Ceded Limit 1,000,000 and QS 10% per risk type.'),
  SHOT('image29.png',2,'Non-proportional subsection: contract type "excess of loss per risk basis / per event basis", Participant Info and Limit (attachment point, limit of indemnity, annual aggregate limit).'),
  SHOT('image30.png',5,'Non-proportional premium (limit, ROL, estimated premium, MDP %, MDP, adjustment rate), Installment Plan (Yearly) and Reinstatement (1 reinstatement, based on amount, 100%).')],
 otadjust:[SHOT('image31.png',0,'Modification History List: two reviewed modifications effective 2024-01-01. Edit and Delete are disabled for older or reviewed records.'),SHOT('image32.png',1,'Create or Modify: Applies to, Modification Effective Date (required), Mutually Agreed Date, Descriptions; Save and continue.')],
 otsettle:[SHOT('image33.png',1,'Treaty Settlement for QS Treaty TO0117 (2021): Planned Settlement Date and Settlement Target are required; Entry Level HeadQuarter.')],
 ffsearch:[SHOT('image34.png',0,'Facility search: code, title, type, recipient, broker, risk category, tax, currency, review status and date, reviewer, facility status, accounting year, operator.')],
 ffcreate:[SHOT('image35.png',0,'Create Facultative Facility pop-up: agreement priority (Facultative Facility-First priority) and facility type, both required.'),SHOT('image36.png',2,'Subsection Total on the agreement layer: click plus to add a subsection. The source places this image under "subsection layer", but it shows the agreement-layer table.')],
 casearch:[SHOT('image37.png',0,'Cession Adjustment search: batch number, policy or endorsement number, risk category, direct or retrocession, insured, operator, feedback, status, review status, dates, adjustment reason.')],
 caadjust:[SHOT('image38.png',0,'Choose the Reinsurance Adjustment Effective Date: business PT202400717, New Cession, 2015/03/15. Confirm opens the slices.')],
 ncfsearch:[SHOT('image39.png',0,'Search block (titled "Task Status" in the system): risk category, proposal, policy, risk unit, proportional or not, direct or retro, insured, allocation and review status, policy status and date, account location.'),SHOT('image40.png',2,'Task List: Allocation Status Binding, Review Status Reviewed, Policy Status issued; buttons Copy, Accept reinsurance task, Continue, Review.')],
 ncfmanage:[SHOT('image41.png',0,'Task progress (Quotation → Review → Complete), Policy Basic Information (own percentage 100%, SI 5,000,000, premium 50,000, VAT 6%) and Risk Position (Has Fac Task = Yes).'),
  SHOT('image42.png',3,'Reinsurance Arrangement Adjustment (Facultative Proportional 0%, Pre-XOL Net Retention 100%, total 100%) and the Facultative Proportional Arrangement grid with Binding, Upload and Download Template.'),
  SHOT('image43.png',5,'Facultative Non Proportional Arrangement (attachment point and loss limit at 100%, premium, own share) and Non-Proportional Participants.'),
  SHOT('image44.png',7,'Reinsurance Arrangement Feedback: Placement confirmed = Yes, a communication record; buttons Image Management, Close, Save, Submission Review, Back.')],
 ncfcopy:[SHOT('image45.png',0,'Copy window: search the source by Policy Number or Risk Unit Number; Facultative Reinsurance Program and Task List (To be claimed); Confirm.')],
 efsearch:[SHOT('image46.png',2,'Endorsement Base Info: policy and endorsement number, type (Basic Information Endorsement), effective date, status, change in premium 11,250.56, change in limit.')],
 trsearch:[SHOT('image47.png',0,'Treaty recovery search: case number and status, policy, accident cause and date, proportional or not, recovery statuses, review date, Claim CAT Code.'),SHOT('image48.png',1,'Result: case CL202600652, enterprise property, accident 2015/01/18, non-proportional status waiting for review, unsettled 900,000. Buttons Recovery Management, Review, Recovery Adjustment Cancellation.')],
 trmanage:[SHOT('image49.png',0,'Basic Claim Information (aggregated loss 900,000 USD) and Claim Payment Info with two reinsurance claim numbers: Loss Paid 900,000 and an Appraisal row.'),
  SHOT('image50.png',3,'Claim Recovery Info for XoL treaty TO0103: net retention 900,000; layer 500,000.00 xs 500,000.00; recovery paid 400,000; applicable reinstatement fees 8,000; pending recovery 400,000.'),
  SHOT('image51.png',6,'Buttons: Submit, Image Management, Back.')],
 frsearch:[SHOT('image52.png',0,'Facultative recovery search: case, closed flag, policy, insured, risk category, cause, date, proportional or not, facility number and title, review status and date.')],
 frmanage:[SHOT('image53.png',0,'Basic Claim Information: total loss paid 100,000 CNY (14,080.34 USD), commercial auto; Reinsurance Details link.'),SHOT('image54.png',1,'Claim Payment Info: one reinsurance claim number, Loss Paid 100,000 CNY, recovery status reviewed. Click the number to refresh recovery info.')],
 tssearch:[SHOT('image55.png',0,'Treaty Statement search: invoice number, SOA type, treaty number and name, accounting year, generated date, SOA date and period, case number, status, Manual SOA, Estimate.'),SHOT('image56.png',1,'Results for TO0126: three proportional quarterly bills; balance and balance excluding provisional VAT; Manual SOA Yes on one; status Effective. Buttons Semi Auto SOA, Create Manual SOA, Review.')],
 tsview:[SHOT('image57.png',0,'Quarterly bill basic information: invoice, SOA type, treaty TO0001, SOA date 2024-03Q, dates, payment due date, booking date, status Effective, Estimate.'),SHOT('image58.png',0,'SOA Contents: CNY tab, exchange rate, branch 14622922, source of business Direct, entry level, balance 790,000.00, Details.'),SHOT('image59.png',0,'SOA Printing: dimensions Payer or Final recipient; select participants; memo. Buttons include Cash Call Release Statement of Account and Print SoA.')],
 tsmanual:[SHOT('image60.png',0,'Manual SOA Basic Info: SOA Type, Is estimated?, Treaty Number, Accounting Year, SOA Date + period, tax type and rate, pending settlement date; status New in progress.'),SHOT('image61.png',1,'SOA Contents: CNY and USD tabs, exchange rate; participants at 40% and 60%; Download Branch Info, Download Template, Upload SOA Balance Details.')],
 sssearch:[SHOT('image62.png',0,'Settlement Statement search: settlement number, currency, payer, cede in/out, onshore/offshore, tax, processor, reviewer, dates, statuses, treaty, cedant, recipient, broker, invoice, SOA date, sheet type.')],
 sscreate:[SHOT('image63.png',0,'Pending settlement search: Settlement Status defaults to Unsettled; reinsurance method, SOA type, currencies, payer, cedant, recipient, insured, risk name, expense type.'),SHOT('image64.png',2,'Pending Settlement SOA list: XOL treaty recovery SOAs (negative balances) and XOL contract installment bills; buttons Trial, View Detail, Create Settlement, Back.')]
};
const AKA={ncfsearch:'Search block title "Task Status"',trsearch:'Treaty Recovery Case Search',tssearch:'Treaty Statement'};


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
