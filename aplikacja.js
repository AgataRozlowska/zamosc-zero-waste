const DATA=RAW.map((r,i)=>({id:i,name:r[0],cats:r[1].split(" "),addr:r[2],phone:r[3],pid:r[4],desc:r[5],flag:r[6]||""}));
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ł/g,"l");
DATA.forEach(d=>{d.own=norm(d.name+" "+d.desc);d.hay=norm([d.name,d.desc,d.addr,...d.cats.map(c=>CATS[c].n+" "+CATS[c].k)].join(" "))});
const inCats=cats=>DATA.filter(d=>d.cats.some(c=>cats.includes(c)));
const plural=n=>n===1?"zakład":(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?"zakłady":"zakładów");
const G="https://www.google.com/maps/";
const placeUrl=d=>G+"search/?api=1&query="+encodeURIComponent(d.name+", "+d.addr+", Zamość")+"&query_place_id="+d.pid;
const routeUrl=d=>G+"dir/?api=1&destination="+encodeURIComponent(d.name+", "+d.addr+", Zamość")+"&destination_place_id="+d.pid;
const areaUrl=q=>G+"search/?api=1&query="+encodeURIComponent(q+" Zamość");

$("tiles").innerHTML=ITEMS.map(([id,n,sub,cats,,ic])=>`<button class="tile" data-item="${id}">${P}${ic}</svg><span>${esc(n)}<br><small>${esc(sub)}</small></span><span class="n">${inCats(cats).length} ${plural(inCats(cats).length)}</span></button>`).join("");

const ICON_PIN='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const ICON_TEL='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>';
const ICON_ROUTE='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7"/></svg>';

let current=null; // aktualna kategoria-kafelek (do licznika)

function card(d){return `
  <article class="card">
    <span class="cat">${d.cats.map(c=>esc(CATS[c].n)).join(" · ")}</span>
    <h3>${esc(d.name)}</h3>
    <p class="desc">${esc(d.desc)}</p>
    <div class="row">${ICON_PIN}<span>${esc(d.addr)}, Zamość</span></div>
    <div class="row">${ICON_TEL}${d.phone?`<a class="phone" href="tel:${d.phone.replace(/\s/g,"")}">${esc(d.phone)}</a>`:`<span class="nophone">brak numeru w wizytówce</span>`}</div>
    ${d.flag?`<span class="tag flag">${esc(d.flag)}</span>`:`<span class="tag">Do weryfikacji</span>`}
    <div class="actions">
      <a class="btn sm" href="${routeUrl(d)}" target="_blank" rel="noopener">${ICON_ROUTE}Wyznacz trasę</a>
      <a class="link" href="${placeUrl(d)}" target="_blank" rel="noopener">Wizytówka w Google</a>
      ${d.phone?`<button class="copy" data-copy="${esc(d.phone)}">Kopiuj numer</button>`:""}
    </div>
  </article>`}

const views={step1:"st1",stepSub:"st2",step2:"st3"};
function view(id){
  Object.keys(views).forEach(k=>{$(k).hidden=k!==id;$(views[k]).classList.toggle("on",k===id)});
  document.querySelector(".steps").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
}
function renderTips(id){
  const t=TIPS[id];
  if(!t){$("tips").innerHTML="";return}
  $("tips").innerHTML=`<p class="why"><strong>Warto naprawić:</strong> ${esc(t.why)}</p>
    <div class="tipbox"><h3>Zanim pójdziesz do fachowca</h3><ul>${t.diy.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="tipbox ask"><h3>O co zapytać</h3><ul>${t.ask.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`;
}
let last={best:[],rest:[]};
function renderList(){
  const {best,rest}=last;
  const grid=a=>`<div class="grid">${a.map(card).join("")}</div>`;
  if(!best.length&&!rest.length){$("list").innerHTML=`<div class="empty">Nie znaleźliśmy fachowca dla tej rzeczy. Wróć i wybierz kafelek albo wpisz inne słowo.<br>Znasz kogoś, kto to naprawia? <a class="link" href="#dodaj">Zgłoś warsztat</a></div>`;return}
  $("list").innerHTML=best.length&&rest.length
    ?`<p class="subhead">Najlepiej pasują (${best.length})</p>${grid(best)}<p class="subhead">Inne zakłady z tej kategorii (${rest.length})</p>${grid(rest)}`
    :grid(best.length?best:rest);
}
function results(title,sub,best,rest,mapQ,tipId,backTxt){
  $("resTitle").textContent=title;$("resSub").textContent=sub;
  $("mapAll").href=areaUrl(mapQ);$("backTxt").textContent=backTxt;
  renderTips(tipId);last={best,rest};renderList();view("step2");
}
function openItem(id){
  const it=ITEMS.find(x=>x[0]===id);if(!it)return;
  current=it;
  $("subQ").textContent=it[1]+": co dokładnie?";
  $("subs").innerHTML=(SUBS[id]||[]).map((s,i)=>`<button class="sub" data-sub="${i}">${esc(s[0])}</button>`).join("")+`<button class="sub all" data-sub="all">Nie wiem / pokaż wszystkie zakłady</button>`;
  view("stepSub");
}
function openSub(i){
  const it=current, all=inCats(it[3]);
  if(i==="all"){
    results(it[1],all.length+" "+plural(all.length)+" w Zamościu i okolicy",all,[],it[4],it[0],"Wróć do pytania");return;
  }
  const s=SUBS[it[0]][+i], stems=norm(s[1]).split(" ");
  const best=all.filter(d=>stems.some(w=>d.own.includes(w)));
  const rest=all.filter(d=>!best.includes(d));
  results(s[0],best.length?`Tę usługę wprost ${plural(best.length)==="zakłady"?"wymieniają":"wymienia"} ${best.length} ${plural(best.length)}. Pozostałe też mogą pomóc, zadzwoń i zapytaj.`:`Żaden zakład nie opisuje tej usługi wprost. Zadzwoń do któregoś z poniższych i zapytaj.`,best,rest,it[4],it[0],"Wróć do pytania");
}
function search(){
  const raw=$("q").value.trim();const words=norm(raw).split(/\s+/).filter(w=>w.length>1);
  if(!words.length){$("q").focus();return}
  current=null;
  const list=DATA.map(d=>({d,s:words.reduce((a,w)=>a+(d.hay.includes(w)?1:0),0)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).map(x=>x.d);
  const top=list[0]&&ITEMS.find(x=>x[3].includes(list[0].cats[0]));
  results("Zepsuło się: "+raw,list.length+" "+plural(list.length)+" pasujących do wyszukiwania",list,[],"naprawa "+raw,top?top[0]:null,"Zmień, co się zepsuło");
}
$("tiles").addEventListener("click",e=>{const b=e.target.closest(".tile");if(b)openItem(b.dataset.item)});
$("subs").addEventListener("click",e=>{const b=e.target.closest(".sub");if(b)openSub(b.dataset.sub)});
$("qgo").addEventListener("click",search);
$("q").addEventListener("keydown",e=>{if(e.key==="Enter")search()});
document.querySelector("[data-back]").addEventListener("click",()=>view("step1"));
$("back").addEventListener("click",()=>current?view("stepSub"):view("step1"));
$("list").addEventListener("click",async e=>{
  const b=e.target.closest(".copy");if(!b)return;
  try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent="Skopiowano";}catch(_){const r=document.createRange();const p=b.closest(".card").querySelector(".phone");r.selectNodeContents(p);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="Zaznaczono";}
  setTimeout(()=>b.textContent="Kopiuj numer",1800);
});
const startHash=(location.hash||"").slice(1);
if(ITEMS.some(x=>x[0]===startHash))openItem(startHash);

// Formularz zgłoszeń
$("f-cat").innerHTML=Object.entries(CATS).map(([k,v])=>`<option value="${esc(v.n)}">${esc(v.n)}</option>`).join("")+`<option value="Inne naprawy">Inne naprawy</option>`;
const st=$("f-status");
$("form").addEventListener("submit",async e=>{
  e.preventDefault();
  const v={nazwa:$("f-name").value.trim(),rodzaj:$("f-cat").value,adres:$("f-addr").value.trim(),telefon:$("f-phone").value.trim(),opis:$("f-desc").value.trim(),zgloszenie:$("f-type").value};
  if(!v.nazwa){st.className="status err";st.textContent="Wpisz nazwę warsztatu.";$("f-name").focus();return}
  const body=`Zgłoszenie do katalogu Zamość Zero Waste\n\nRodzaj zgłoszenia: ${v.zgloszenie}\nNazwa: ${v.nazwa}\nRodzaj napraw: ${v.rodzaj}\nAdres: ${v.adres}\nTelefon: ${v.telefon}\nCo naprawia: ${v.opis}`;
  if(CONFIG.formularzEndpoint){
    $("f-send").disabled=true;st.className="status";st.textContent="Wysyłam…";
    try{
      const r=await fetch(CONFIG.formularzEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(v)});
      if(!r.ok)throw new Error(r.status);
      st.className="status ok";st.textContent="Dziękujemy! Zgłoszenie trafiło do sprawdzenia.";$("form").reset();
    }catch(_){st.className="status err";st.textContent="Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę"+(CONFIG.email?" albo napisz na "+CONFIG.email+".":".");}
    $("f-send").disabled=false;return;
  }
  if(CONFIG.email){
    location.href="mailto:"+CONFIG.email+"?subject="+encodeURIComponent("Zamość Zero Waste: "+v.zgloszenie+" – "+v.nazwa)+"&body="+encodeURIComponent(body);
    st.className="status ok";st.textContent="Otworzyliśmy Twój program pocztowy z gotową wiadomością. Kliknij w nim „Wyślij”. Jeśli się nie otworzył, napisz na "+CONFIG.email+".";
    return;
  }
  st.className="status err";st.textContent="Formularz nie jest jeszcze podłączony. Wkrótce będzie można wysyłać zgłoszenia.";
});
