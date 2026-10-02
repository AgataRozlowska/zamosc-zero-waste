const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function renderFooter(){
  const f=$("stopka");if(!f)return;
  const kontakt=[CONFIG.email?`<span class="copyline">E-mail: <code>${esc(CONFIG.email)}</code></span>`:"",CONFIG.telefon?`<span class="copyline">Telefon: <code>${esc(CONFIG.telefon)}</code></span>`:""].filter(Boolean).join("<br>");
  f.innerHTML=`<div><strong>Zamość Zero Waste</strong><br>Katalog napraw dla mieszkańców Zamościa${CONFIG.organizator?"<br>"+esc(CONFIG.organizator):""}</div>
  <div>${kontakt||"Uwagi do wpisów zgłoś przez formularz „Dodaj warsztat”."}</div>
  <div>Dane zakładów pochodzą z publicznych wizytówek firm<br>i są w trakcie weryfikacji.</div>`;
}
renderFooter();
