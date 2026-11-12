/* ===== Protec reinsurance user guide (client implementation, 2026) =====
   Source: "insureMO Reinsurance User Guide - Outwards Treaty, Recovery & Settlement" (V1.0, 2026).
   24 of its 32 screenshots are the same as this guide's source screenshots; the 3 below are new
   (one more was an empty Notes box and one duplicated the existing SOA printing screenshot). */
(function(){
  const add=(id,shot)=>{(SHOTS[id]=SHOTS[id]||[]).push(shot)};
  add('otcreate',SHOT('protec-ri-06.png',3,'Protec manual: Section Summary with one section, 100004-Accident Insurance, quota share, currency USD.'));
  add('otsub',SHOT('protec-ri-16.png',1,'Protec manual: motor quota share subsection. Risk category Motor, contract type quota share, retention base Gross Premium; limits by coverage category (Goods Carrying, Passenger Carrying, Private Car, Two Wheeler Liability) at QS 4.0000%. Insurance knowledge: this matches the Indian obligatory cession to GIC Re (4% in recent years).'));
  add('tsview',SHOT('protec-ri-28.png',0,'Protec manual: VAT Invoice Info for the domestic reinsurer B0001GIC Re. Branch Gujarat, Motor-Goods Carrying Vehicle, GST 7,464.96 charged as IGST; CGST and SGST 0.00.'));
  const sv=SCREENS.find(s=>s.id==='tsview');
  sv.rules.push(
    'Protec manual: the quarterly bill is generated automatically with status Waiting for Handle when the treaty has tax; with no provisional tax it is reviewed automatically.',
    'Protec manual: VAT Invoice Info (domestic reinsurers) sums by branch, coverage category and payer, with GST, IGST, CGST and SGST.',
    'Protec manual: when editing a Waiting for Handle SOA you can change non-zero IGST, CGST and SGST; components that start at zero stay read-only; Total GST = IGST + CGST + SGST and is read-only.',
    'Protec manual: defaults come from provisional GST, and a changed component must be less than the ceding premium.',
    'Protec manual: Save keeps the SOA in Waiting for Handle; Submit moves it to To be Reviewed.');
  GAPS.push(
    ['Medium','Protec RI manual covers proportional outward treaties only','Treaty Priority Type offers only All Risk Agreement and Commercial Proportional Treaty. There is no content on facultative, excess of loss, inward treaties or cession adjustment.','Confirm which XRI functions Protec uses before scoping training and tests; the rest of this guide covers the full product.'],
    ['Medium','Protec RI manual: motor 4% quota share not explained','The screenshots show a motor quota share at 4.0000% on gross premium and a VAT invoice to B0001GIC Re with IGST 7,464.96. The manual does not say this is the obligatory cession.','Confirm the obligatory cession rate for the year, and whether it is set up as a treaty in XRI.']);
  COVERAGE.push(
    ['Protec RI manual: introduction, target users, preparation, menus','Level 1 and screens Preparation, Menu bar','Full (same as the platform guide)'],
    ['Protec RI manual: Outwards Treaty Management and Reinsurance Party Management','Screens otsearch to rpcreate; new Protec screenshots on Create treaty (Treaty and Subsection levels)','Full'],
    ['Protec RI manual: Treaty Recovery','Screens trsearch, trmanage, trreview','Full (same as the platform guide)'],
    ['Protec RI manual: Outward Treaty Statement, including GST editing','Screen View treaty SOA by type: GST rules and VAT invoice screenshot','Full'],
    ['Protec RI manual: Settlement Statement and Summary; Reinsurance Query','Screens sssearch to rqview','Full (same as the platform guide)']);
})();
