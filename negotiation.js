const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const icon = (n, s) => `<i data-lucide="${n}" class="icon"${s?` style="width:${s}px;height:${s}px"`:''}></i>`;
const refreshIcons = () => { if(window.lucide) window.lucide.createIcons(); };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num = v => Number(String(v ?? '').replace(/[^0-9.]/g,'')) || 0;
const money = n => '$' + Math.round(Number(n)||0).toLocaleString('en-US');
const commas = v => { const n = num(v); return n ? Math.round(n).toLocaleString('en-US') : ''; };
const dateObj = iso => new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
const fmtDay = iso => dateObj(iso).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
const fmtShort = iso => dateObj(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const fmtDT = iso => { const d = dateObj(iso); return d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) + ' at ' + d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}) + ' CT'; };
const fmtTime = iso => dateObj(iso).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
const daysBetween = (a, b) => Math.round((dateObj(b) - dateObj(a)) / 864e5);
function left(fromIso, toIso){
  let s = Math.max(0, Math.round((dateObj(toIso) - dateObj(fromIso)) / 1000));
  const d = Math.floor(s/86400), h = Math.floor((s%86400)/3600), m = Math.floor((s%3600)/60);
  if(!s) return 'Expired';
  if(d) return `${d} ${d===1?'day':'days'} ${h} ${h===1?'hour':'hours'}`;
  if(h) return `${h} ${h===1?'hour':'hours'} ${m} ${m===1?'minute':'minutes'}`;
  return `${m} ${m===1?'minute':'minutes'}`;
}
function toast(t){ let el = $('#toast'); if(!el){ el = document.createElement('div'); el.id='toast'; el.className='toast'; document.body.appendChild(el); } el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(()=>el.classList.remove('show'), 2000); }

const HOME = { address:'1428 Lakeshore Dr', city:'Murfreesboro, TN 37130', mls:'2691140', beds:3, baths:'2.5', sqft:'2,140', built:1998, list:459000, listingUrl:'#listing-1428-lakeshore' };
const SELLERS = { names:'Rick & Linda Marino', short:'Rick and Linda', people:[{n:'Rick Marino',r:'Seller · account holder',i:'RM'},{n:'Linda Marino',r:'Seller · co-owner',i:'LM'}] };
const BUYERS = { names:'Dana & Marcus Whitfield', short:'Dana and Marcus', people:[{n:'Dana Whitfield',r:'Buyer · account holder',i:'DW'},{n:'Marcus Whitfield',r:'Buyer · co-buyer',i:'MW'}] };
const OTHER_OFFERS = [ {n:'Priya Raman', p:441000, s:'Waiting on them', m:'You countered Tuesday · waiting on her until 5:00 PM Thursday', tag:'badge-muted'}, {n:'Chen Family Trust', p:430000, s:'Expired', m:'Nobody responded before the deadline', tag:'badge-danger'} ];

const R1 = {
  price:425000, method:'CASH', loanType:'', down:null, pof:'Received', finCont:false,
  em:8500, emDays:5, emHolder:'Stewart Title', closing:'2026-10-15', possession:'CLOSING', possessionDate:'',
  inspCont:true, inspMode:'RIGHT', inspDays:10, resDays:2, finalInsp:1, appraisal:true,
  title:'BUYER', titleText:'', concession:null, comp:null, warranty:null,
  sa:'SELLER', expenseMods:'', closingAgency:'Stewart Title', greenbelt:null,
  included:'Refrigerator, washer and dryer', excluded:'Dining room chandelier', leased:'Assumed',
  requests:[ {id:'q1', type:'INCLUSIONS', text:'Refrigerator, washer and dryer', status:'PENDING'}, {id:'q2', type:'EXCLUSIONS', text:'Dining room chandelier', status:'PENDING'}, {id:'q3', type:'REPAIRS', text:'Service the HVAC system before closing', status:'PENDING'} ]
};
const R2 = { ...R1, price:452000, closing:'2026-10-22', em:10000, title:'OTHER', titleText:"Seller to pay for buyer's title policy up to $1,100",
  requests:[ {id:'q1', type:'INCLUSIONS', text:'Refrigerator, washer and dryer', status:'ACCEPTED'}, {id:'q2', type:'EXCLUSIONS', text:'Dining room chandelier', status:'ACCEPTED'}, {id:'q3', type:'REPAIRS', text:'Service the HVAC system before closing', status:'DECLINED', note:'Serviced in March 2026; the receipt is in the disclosures.'} ] };
const R3 = { ...R2, price:441000, appraisal:false, warranty:{paidBy:'SELLER', amount:650, provider:'HomeGuard Home Warranty'} };

const ROUNDS = [
  { n:1, kind:'Original offer', form:'RF 401', doc:'Purchase and Sale Agreement', by:'BUYER', who:BUYERS.names, sent:'2026-09-23T14:14:00', expires:'2026-09-24T17:00:00', expSource:'COMPUTED', t:R1, message:"We love the porch and the lake view. We're paying cash and can be flexible on timing." },
  { n:2, kind:'Counter offer #1', form:'RF 651', doc:'Counter Offer #1', by:'SELLER', who:SELLERS.names, sent:'2026-09-24T16:40:00', expires:'2026-09-29T17:00:00', expSource:'EMITTER', t:R2, message:"We're firm near list, but happy to help with the title policy." },
  { n:3, kind:'Counter offer #2', form:'RF 651', doc:'Counter Offer #2', by:'BUYER', who:BUYERS.names, sent:'2026-09-29T11:05:00', expires:'2026-10-02T17:00:00', expSource:'EMITTER', t:R3, message:'Meeting you in the middle. Cash, and we waive the appraisal.' }
];

const INSP = t => !t.inspCont ? 'Waived' : t.inspMode === 'PASSFAIL' ? `Pass or fail · ${t.inspDays} days` : `${t.inspDays} days · ${t.resDays} to resolve`;
const TITLE = t => ({ BUYER:'Buyer pays', SELLER:'Seller pays', SPLIT:'Split evenly', OTHER:t.titleText })[t.title];
const CONC = t => t.concession ? (t.concession.basis === 'PCT' ? `${t.concession.amount}% of the price` : money(t.concession.amount)) : 'None requested';
const WARR = t => !t.warranty ? 'None' : t.warranty.paidBy === 'SELLER' ? `Seller pays up to ${money(t.warranty.amount)}` : t.warranty.paidBy === 'BUYER' ? 'Buyer pays' : 'Waived';
const POSS = t => t.possession === 'TOA' ? `Temporary occupancy · ${fmtShort(t.possessionDate)}` : 'At closing';
const CONTS = t => [t.inspCont?'Inspection':null, t.appraisal?'Appraisal':null, t.finCont?'Financing':null].filter(Boolean);
const FIN = t => t.method === 'CASH' ? 'Cash' : `${t.loanType} · ${money(t.down)} down`;

const TERMS = [
  { key:'price', label:'Purchase price', lines:'40-41', f:t=>money(t.price), clause:t=>`Purchase Price changed to ${money(t.price)}.` },
  { key:'method', label:'Financing', lines:'55-58', f:FIN, clause:t=>`Purchase method changed to ${FIN(t)}.` },
  { key:'em', label:'Earnest money', lines:'162-166', f:t=>money(t.em), clause:(t,o)=>`Earnest Money ${t.em>o.em?'increased':'decreased'} to ${money(t.em)}.` },
  { key:'emDays', label:'Earnest money due within', lines:'162-166', f:t=>`${t.emDays} days`, clause:t=>`Earnest Money to be deposited within ${t.emDays} days after the Binding Agreement Date.` },
  { key:'closing', label:'Closing date', lines:'193-199', f:t=>fmtDay(t.closing), clause:t=>`Closing Date changed to ${fmtDay(t.closing)}.` },
  { key:'possession', label:'Possession', lines:'200-204', f:POSS, clause:t=>`Possession: ${POSS(t)}.` },
  { key:'inspDays', label:'Inspection period', lines:'307', f:t=>t.inspCont?`${t.inspDays} days`:'Waived', clause:t=>`Inspection Period changed to ${t.inspDays} days.` },
  { key:'inspMode', label:'Repair requests', lines:'342', f:t=>t.inspMode==='PASSFAIL'?'Pass or fail, no repair requests':'Buyer may request repairs', clause:t=>t.inspMode==='PASSFAIL'?'Buyer waives the right to request repairs (Pass/Fail).':'Buyer may request repairs.' },
  { key:'appraisal', label:'Appraisal contingency', lines:'102-106', f:t=>t.appraisal?'Included':'Waived', clause:t=>t.appraisal?'Appraisal contingency added.':'Appraisal contingency waived.' },
  { key:'title', label:"Title expenses", lines:'145-147', f:TITLE, clause:t=>`Title Expenses: ${TITLE(t)}.` },
  { key:'concession', label:'Seller concession', lines:'152-157', f:CONC, clause:t=>`Seller concession: ${CONC(t)}.` },
  { key:'warranty', label:'Home warranty', lines:'421-426', f:WARR, clause:t=>t.warranty?`Home Protection Plan: ${WARR(t)}, provider ${t.warranty.provider}.`:'Home Protection Plan waived.' },
  { key:'sa', label:'Special assessments', lines:'221-223', f:t=>t.sa==='SELLER'?'Seller pays at closing':'Buyer does not assume', clause:t=>t.sa==='SELLER'?'Special assessments paid by Seller at or prior to Closing.':'The Buyer Does Not Wish to Assume the Special Assessment.' },
  { key:'comp', label:"Buyer's agent compensation", lines:'506-517', f:t=>t.comp?(t.comp.basis==='PCT'?`${t.comp.amount}% of the price`:money(t.comp.amount)):'None', clause:t=>t.comp?`BUYER BROKER COMPENSATION: Seller shall pay ${t.comp.basis==='PCT'?t.comp.amount+'% of the Purchase Price':money(t.comp.amount)} to Selling Broker at Closing.`:'Buyer broker compensation removed.' },
  { key:'resDays', label:'Resolution period', lines:'325', f:t=>`${t.resDays} days`, clause:t=>`Resolution Period changed to ${t.resDays} days.` },
  { key:'finalInsp', label:'Final inspection', lines:'355-358', f:t=>`${t.finalInsp} ${t.finalInsp===1?'day':'days'} before closing`, clause:t=>`Final inspection within ${t.finalInsp} days prior to Closing.` },
  { key:'emHolder', label:'Earnest money holder', lines:'162-166', f:t=>t.emHolder, clause:t=>`Earnest Money to be held by ${t.emHolder}.` },
  { key:'closingAgency', label:"Seller's closing agency", lines:'160-161', f:t=>t.closingAgency, clause:t=>`Seller's closing agency: ${t.closingAgency}.` },
  { key:'expenseMods', label:'Expense modifications', lines:'152-157', f:t=>t.expenseMods||'None', clause:t=>`Expense modifications: ${t.expenseMods}.` },
  { key:'greenbelt', label:'Greenbelt', lines:'211-220', f:t=>t.greenbelt===null?'No election':t.greenbelt?'Buyer keeps the Greenbelt status':'Seller pays rollback taxes', clause:t=>t.greenbelt?'Buyer intends to maintain the Greenbelt classification.':'Seller to pay rollback taxes at Closing.' },
  { key:'included', label:'Included items', lines:'23-25', f:t=>t.included },
  { key:'excluded', label:'Excluded items', lines:'26-28', f:t=>t.excluded }
];
const LINE_ORDER = k => num((TERMS.find(x=>x.key===k)||{lines:'999'}).lines.split('-')[0]);
const same = (a, b, k) => JSON.stringify(a[k]) === JSON.stringify(b[k]) && (k !== 'title' || a.titleText === b.titleText) && (k !== 'possession' || a.possessionDate === b.possessionDate) && (k !== 'method' || (a.loanType === b.loanType && a.down === b.down)) && (k !== 'inspDays' || a.inspCont === b.inspCont);
function diff(a, b){ return TERMS.filter(x => !same(a, b, x.key)).map(x => ({ key:x.key, label:x.label, lines:x.lines, was:x.f(a), now:x.f(b) })); }
function requestDiff(a, b){ return b.requests.filter(q => { const p = a.requests.find(x=>x.id===q.id); return !p || p.status !== q.status; }).map(q => ({ label:`Request · ${q.text}`, was:(a.requests.find(x=>x.id===q.id)||{}).status==='PENDING'?'Requested':'Not requested', now:q.status==='DECLINED'?'Declined':q.status==='ACCEPTED'?'Agreed':'Requested', note:q.note })); }
function exceptions(original, t){
  const out = TERMS.filter(x => x.clause && !same(original, t, x.key)).sort((a,b)=>LINE_ORDER(a.key)-LINE_ORDER(b.key)).map(x => ({ lines:x.lines, text:x.clause(t, original) }));
  t.requests.filter(q => q.status === 'DECLINED').forEach(q => out.push({ lines:'506-517', text:`${q.type === 'REPAIRS' ? 'Repair request' : 'Request'} declined: ${q.text}.${q.note ? ' ' + q.note : ''}` }));
  (t.newRequests || []).forEach(q => out.push({ lines:'506-517', text:`${q.type === 'CREDITS' ? 'Credit' : q.type === 'REPAIRS' ? 'Repairs added' : 'Added'}: ${q.text}${q.amount ? ' (' + money(q.amount) + ')' : ''}.` }));
  return out;
}

const NET_FIXED = { payoff:239500, diyFees:1198, hoa:350, annualTax:3812 };
function net(t, payoff){
  const po = payoff ?? NET_FIXED.payoff;
  const days = daysBetween('2026-01-01', t.closing);
  const tax = Math.round(NET_FIXED.annualTax * days / 365);
  const conc = t.concession ? (t.concession.basis === 'PCT' ? t.price * t.concession.amount / 100 : t.concession.amount) : 0;
  const comp = t.comp ? (t.comp.basis === 'PCT' ? t.price * t.comp.amount / 100 : t.comp.amount) : 0;
  const warr = t.warranty && t.warranty.paidBy === 'SELLER' ? t.warranty.amount : 0;
  const lines = [
    ['Offer price', t.price, 'This round'],
    ['Mortgage payoff (approx.)', po ? -po : null, po ? 'Your estimate' : 'Add your payoff'],
    ['Seller concession', conc ? -conc : 0, conc ? 'This round' : 'None requested'],
    ["Buyer's agent compensation", comp ? -comp : 0, comp ? 'This round' : 'None requested'],
    ['Home protection plan', warr ? -warr : 0, warr ? 'This round, seller pays' : 'None'],
    ['Title expenses', null, t.title === 'BUYER' ? 'Buyer pays' : 'Not included: ' + TITLE(t).toLowerCase()],
    ['DIY Residential closing fees', -NET_FIXED.diyFees, 'Two $599 fees at closing'],
    ['HOA transfer fee', -NET_FIXED.hoa, 'Your listing'],
    [`Property taxes prorated (${days} days)`, -tax, 'Jan 1 to closing'],
    ['Tennessee seller closing costs', null, 'Not included yet']
  ];
  const total = lines.reduce((s, l) => s + (typeof l[1] === 'number' ? l[1] : 0), 0);
  return { total, lines, missingPayoff: !po };
}

function priceTrack(rounds, list){
  const prices = rounds.map(r => r.t.price).concat(list);
  const lo = Math.min(...prices) - 8000, hi = Math.max(...prices) + 4000, W = 100;
  const x = p => ((p - lo) / (hi - lo) * W).toFixed(2);
  const rows = rounds.map((r, i) => `<div class="pt-row" style="--y:${i}"><span class="pt-who ${r.by==='BUYER'?'b':'s'}">${r.by==='BUYER'?'Buyers':'Sellers'}</span><span class="pt-dot ${r.by==='BUYER'?'b':'s'} ${i===rounds.length-1?'cur':''}" style="left:${x(r.t.price)}%"><b>${money(r.t.price)}</b></span></div>`).join('');
  return `<div class="pt"><div class="pt-scale"><span class="pt-list" style="left:${x(list)}%"><i></i><em>List ${money(list)}</em></span></div>${rows}</div>`;
}
