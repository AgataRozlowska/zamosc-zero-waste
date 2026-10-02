const DATA=RAW.map((r,i)=>({id:i,name:r[0],cats:r[1].split(" "),addr:r[2]}));
const inCats=cats=>DATA.filter(d=>d.cats.some(c=>cats.includes(c)));
const plural=n=>n===1?"zakład":(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?"zakłady":"zakładów");

// Kafelki prowadzą prosto do aplikacji
$("tiles").innerHTML=ITEMS.map(([id,n,sub,cats,,ic])=>{const k=inCats(cats).length;return `<a class="tile" href="aplikacja.html#${id}">${P}${ic}</svg><span>${esc(n)}<br><small>${esc(sub)}</small></span><span class="n">${k} ${plural(k)}</span></a>`}).join("");

// Ramka w nagłówku: przykłady z katalogu
$("benchHead").textContent=`W KATALOGU: ${DATA.length} ${plural(DATA.length).toUpperCase()} · ${ITEMS.length} RODZAJÓW NAPRAW`;
$("bench").innerHTML=["zamek","zegarek","agd","rower"].map(id=>{const it=ITEMS.find(x=>x[0]===id);const k=inCats(it[3]).length;return `<a class="ticket" href="aplikacja.html#${id}" style="text-decoration:none;color:inherit">${P.replace('width="30" height="30"','width="26" height="26"')}${it[5]}</svg><span><b>${esc(it[1])}</b><small>${k} ${plural(k)} w Zamościu</small></span></a>`}).join("");

// Mapa
if(CONFIG.mapaEmbed){
  $("mapbox").innerHTML=`<iframe src="${esc(CONFIG.mapaEmbed)}" title="Mapa zakładów naprawczych w Zamościu" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
}else{
  $("mapbox").innerHTML=`<div class="mapempty"><p>Mapa wszystkich zakładów pojawi się tu wkrótce. Do tego czasu każdy zakład w wyszukiwarce ma przycisk „Wyznacz trasę”, a przycisk obok otwiera zakłady naprawcze w Mapach Google.</p><a class="btn ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("naprawa Zamość")}" target="_blank" rel="noopener">Otwórz Mapy Google</a></div>`;
}

// Wydarzenia z pliku ustawień
const MONTHS=["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];
(function(){
  const today=new Date().toISOString().slice(0,10);
  const up=(CONFIG.wydarzenia||[]).filter(x=>x&&x.data&&x.data>=today).sort((a,b)=>(a.data+(a.godzina||"")).localeCompare(b.data+(b.godzina||"")));
  $("evlist").innerHTML=up.length?up.map(x=>{const [,m,d]=x.data.split("-");return `<article class="ev"><div class="date"><b>${+d}</b><span>${MONTHS[+m-1]}</span></div><div><h3>${esc(x.tytul||"")}</h3><p>${esc([x.godzina?"godz. "+x.godzina:"",x.miejsce||""].filter(Boolean).join(" · "))}</p>${x.opis?`<p>${esc(x.opis)}</p>`:""}</div></article>`}).join("")
    :`<div class="evempty">Na razie nie ma zaplanowanych wydarzeń. Wkrótce pojawią się tu terminy kawiarenek naprawczych i warsztatów w Zamościu.</div>`;
})();
