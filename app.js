/* Page renderer for the 6-page bilingual Github Pages guide. */
'use strict';
const PAGE_FILES=['04-santander.html','05-bilbao.html','06-bilbao.html','07-guggenheim.html','08-rientro.html'];
const EXTRA_UI={
 it:{home:'Home',summary:'La nostra fuga, in un colpo d’occhio',homeNav:'Panoramica',daysNav:'Giornate',daysTitle:'Scegli la giornata',daysLead:'Ogni giorno ha una pagina con itinerario, Google Maps, alloggio, trasporti e ristoranti della zona.',daysEye:'ESPLORA IL PROGRAMMA',openDay:'Apri la giornata',returnHome:'← Torna alla panoramica',itinerary:'Itinerario e Google Maps',moreDays:'Le altre giornate',moreDaysEye:'CONTINUA IL VIAGGIO',foodTitle:'Cosa mangiare oggi',foodEye:'GASTRONOMIA DELLA GIORNATA',foodLead:'Ristoranti e specialità scelti per le zone che visiteremo, con fasce di prezzo e cosa ordinare.',placesToEat:'Dove mangiare lungo il percorso',dishesTitle:'Specialità da conoscere',orderLabel:'Da ordinare',breakfastTitle:'Colazione cantabrica, senza deviazioni',breakfastNote:'Prima di partire per l’aeroporto cercate in una pasticceria o caffetteria vicina un sobao pasiego o una fetta di quesada. Non consigliamo un locale preciso per non rischiare un trasferimento inutile.',breakfastPrice:'€ · circa 5–12 €',priceFoot:'Prezzi a persona indicativi; orari, disponibilità e costi vanno confermati, specialmente durante il ponte del 6–8 dicembre.',noSync:'Le spunte si salvano su questo browser, non si sincronizzano automaticamente fra dispositivi.',dayNavPrefix:'Giorno',mapSource:'Mappa Google incorporata: la linea con le tappe è disponibile nel pulsante di navigazione.',next:'Giorno successivo →',previous:'← Giorno precedente',viewOnMap:'Vedi su Google Maps',routeLabel:'Apri il percorso su Maps'},
 es:{home:'Inicio',summary:'Nuestro viaje, de un vistazo',homeNav:'Resumen',daysNav:'Días',daysTitle:'Elige el día',daysLead:'Cada jornada tiene su página con itinerario, Google Maps, alojamiento, transporte y restaurantes de la zona.',daysEye:'EXPLORA EL PLAN',openDay:'Ver el día',returnHome:'← Volver al resumen',itinerary:'Itinerario y Google Maps',moreDays:'Los otros días',moreDaysEye:'SIGUE EL VIAJE',foodTitle:'Qué comer hoy',foodEye:'GASTRONOMÍA DEL DÍA',foodLead:'Restaurantes y especialidades elegidos para las zonas que visitaremos, con precios orientativos y qué pedir.',placesToEat:'Dónde comer durante las visitas',dishesTitle:'Especialidades para descubrir',orderLabel:'Qué pedir',breakfastTitle:'Desayuno cántabro, sin desvíos',breakfastNote:'Antes de salir al aeropuerto, buscad en una pastelería o cafetería cercana un sobao pasiego o una porción de quesada. No recomendamos un local concreto para evitar desplazamientos innecesarios.',breakfastPrice:'€ · aprox. 5–12 €',priceFoot:'Precios estimados por persona; horarios, disponibilidad y tarifas deben comprobarse, sobre todo durante el puente del 6–8 de diciembre.',noSync:'Las casillas se guardan en este navegador, no se sincronizan automáticamente entre dispositivos.',dayNavPrefix:'Día',mapSource:'Mapa de Google integrado: abre la navegación completa con paradas utilizando el botón.',next:'Día siguiente →',previous:'← Día anterior',viewOnMap:'Ver en Google Maps',routeLabel:'Abrir ruta en Maps'}
};
const DAILY_FOOD_INDEX=[[0,1,2,10,11],[4,5,7,12],[6,7,8,12],[7,3,1,11],[10,11]];
const ORDER_ES={
  'Gure Toki':'Pintxos creativos del día',
  'Sorginzulo':'Tortilla, pintxos calientes',
  'Txakoli Simón':'Txuleta a la brasa'
};
const $=(id)=>document.getElementById(id);
const esc=(v)=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const searchMaps=(q)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const embedMaps=(q)=>'https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=14&output=embed';
function directions(route){let u='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(route.start)+'&destination='+encodeURIComponent(route.end)+'&travelmode='+route.mode; if(route.waypoints&&route.waypoints.length)u+='&waypoints='+encodeURIComponent(route.waypoints.join('|'));return u;}
const link=(url,label,primary=false)=>'<a class="btn'+(primary?' primary':'')+'" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">'+esc(label)+' ↗</a>';
const pageName=document.body.dataset.page||'home';
const pageIndex=pageName.startsWith('day-')?Number(pageName.split('-')[1]):-1;
let lang=(navigator.language||'').toLowerCase().startsWith('es')?'es':'it';
try{const old=localStorage.getItem('viajeSB2026Language');if(old==='es'||old==='it')lang=old}catch(err){}
function renderNav(){
 const x=EXTRA_UI[lang],t=T[lang],isHome=pageIndex<0;
 let nav=[{label:x.home,href:'index.html',key:'home'}];
 if(isHome)nav.push({label:x.homeNav,href:'#panoramica',key:'overview'});
 nav.push(...t.days.map((d,i)=>({label:d.tab,href:PAGE_FILES[i],key:'day-'+i})));
 if(isHome)nav.push({label:t.transportTitle,href:'#spostamenti',key:'transport'},{label:t.stayTitle,href:'#alloggi',key:'stay'},{label:t.tasksTitle,href:'#preparativi',key:'tasks'});
 else nav.push({label:x.foodTitle,href:'#gastronomia',key:'food'},{label:t.tasksTitle,href:'index.html#preparativi',key:'tasks'});
 $('nav').innerHTML=nav.map(n=>'<a href="'+esc(n.href)+'"'+(n.key==='day-'+pageIndex||((n.key==='home')&&isHome)?' class="active" aria-current="page"':'')+'>'+esc(n.label)+'</a>').join('');
}
function renderHome(){
 const t=T[lang],x=EXTRA[lang],u=EXTRA_UI[lang];
 $('heroEye').textContent=t.heroEye;
 $('heroTitle').innerHTML=t.heroTitle;
 $('heroDescription').textContent=t.heroDescription;
 $('heroPills').innerHTML=t.pills.map(p=>'<span class="pill">'+esc(p)+'</span>').join('');
 $('heroOverview').innerHTML='<h2>'+esc(x.overview)+'</h2><div class="hero-agenda">'+x.agenda.map((entry,i)=>'<a class="hero-agenda-item" href="'+PAGE_FILES[i]+'" style="text-decoration:none;color:white"><span class="date">'+esc(entry[0])+' DIC</span><span><strong>'+esc(entry[1])+'</strong><small>'+esc(entry[2])+'</small></span></a>').join('')+'</div>';
 for(const name of ['summary','stay','transport','tasks']){
   $(name+'Eye').textContent=t[name+'Eye']; $(name+'Title').textContent=t[name+'Title']; $(name+'Lead').textContent=t[name+'Lead'];
 }
 $('summaryCards').innerHTML=t.summaryCards.map(c=>'<article class="card"><span class="info-label">'+esc(c.eyebrow)+'</span><div class="big-stat">'+esc(c.headline)+'</div><p><strong>'+esc(c.body)+'</strong></p><p class="small">'+esc(c.fine)+'</p></article>').join('');
 $('timeline').innerHTML=t.timeline.map(s=>'<div class="step"><b>'+esc(s[0])+'</b>'+esc(s[1])+'</div>').join('');
 $('daysEye').textContent=u.daysEye;$('daysTitle').textContent=u.daysTitle;$('daysLead').textContent=u.daysLead;
 renderDayCards();renderStay();renderTransport();renderTasks();
}
function renderDayCards(){
 const t=T[lang],x=EXTRA[lang],u=EXTRA_UI[lang];
 $('dayCards').innerHTML=t.days.map((d,i)=>'<a href="'+PAGE_FILES[i]+'" class="day-link-card"'+(i===pageIndex?' aria-current="page"':'')+'><span class="day-link-date">'+esc(x.navDays[i])+'</span><strong>'+esc(d.place)+'</strong><small>'+esc(d.title)+'</small><span class="day-link-cta">'+esc(u.openDay)+' →</span></a>').join('');
}
function renderStay(){const t=T[lang];$('stayCards').innerHTML=t.stayCards.map(c=>'<article class="card"><span class="info-label">'+esc(c.nights)+'</span><h3 style="margin-top:11px">'+esc(c.name)+'</h3><p>📍 '+esc(c.address)+'</p><div class="buttons">'+link(searchMaps(c.address),t.showOnMaps)+'</div></article>').join('');}
function renderTransport(){const t=T[lang];$('transportCards').innerHTML=t.transportCards.map(v=>'<article class="card"><h3>'+esc(v.title)+'</h3><p>'+esc(v.body)+'</p><div class="buttons">'+link(v.kind==='alsa'?'https://www.alsa.com/':v.kind==='museum'?'https://www.guggenheim-bilbao.eus/horarios-y-tarifas':searchMaps('Aeropuerto Seve Ballesteros Santander'),v.action)+'</div></article>').join('');}
function loadChecks(){try{return JSON.parse(localStorage.getItem('viajeSB2026Checklist')||'[]')}catch(_){return []}}
function renderTasks(){const t=T[lang],u=EXTRA_UI[lang],done=loadChecks();$('taskItems').innerHTML=t.tasks.map((task,i)=>'<label class="check-item"><input type="checkbox" data-check="'+i+'" '+(done[i]?'checked':'')+'><span>'+esc(task)+'</span></label>').join('');$('taskItems').querySelectorAll('input').forEach(b=>b.addEventListener('change',()=>{const updated=[...$('taskItems').querySelectorAll('input')].map(x=>x.checked);try{localStorage.setItem('viajeSB2026Checklist',JSON.stringify(updated))}catch(_){ }updateProgress()}));updateProgress();const note=$('tasksSyncNote');if(!note){const p=document.createElement('p');p.className='small';p.id='tasksSyncNote';p.textContent=u.noSync;$('taskItems').parentElement.appendChild(p);}else note.textContent=u.noSync;}
function updateProgress(){const t=T[lang],v=[...$('taskItems').querySelectorAll('input')];const n=v.filter(x=>x.checked).length;$('tasksProgress').textContent=n+' / '+v.length+' '+t.tasksDone;$('progressBar').style.width=(v.length?n/v.length*100:0)+'%';}
function renderDay(){
 const i=pageIndex,t=T[lang],u=EXTRA_UI[lang],x=EXTRA[lang],d=t.days[i],m=mapLocations[i],stay=x.lodgings[i],transport=x.transports[i];
 $('backToHome').textContent=u.returnHome;$('dayDate').textContent=d.date;
 $('dayTitle').textContent=d.title;$('dayLead').textContent=d.intro;
 $('dayContent').innerHTML=renderDayOverview(i,d,m,stay,transport,t,u,x);
 $('foodEye').textContent=u.foodEye;$('foodTitle').textContent=u.foodTitle;$('foodLead').textContent=u.foodLead;
 $('foodZone').innerHTML='<b>🍴 '+esc(x.whereTitle)+':</b> '+esc(x.foodSpot[i]);
 renderRestaurants(i,t,u,x);
 $('foodDishesHeading').textContent=u.dishesTitle;
 $('foodGrid').innerHTML=DAILY_FOOD_INDEX[i].map(j=>{
  const f=FOOD[j],l=f[lang],area=f.category==='baschi'?'Euskadi':f.category==='cantabria'?'Cantabria':lang==='it'?'Dolci / Bevande':'Dulces / Bebidas';
  return '<article class="card foodcard"><div class="emoji" aria-hidden="true">'+f.icon+'</div><div class="region">'+esc(area)+'</div><h3>'+esc(f.title)+'</h3><p>'+esc(l.description)+'</p><div class="taste"><b>'+esc(t.tasteLabel)+'</b>'+esc(l.tip)+'</div></article>';}).join('');
 $('foodFoot').textContent=u.priceFoot;
 $('moreDaysEye').textContent=u.moreDaysEye;$('moreDaysTitle').textContent=u.moreDays;
 renderDayCards();
 document.title=d.title+' | Santander & Bilbao · 2026';
}
function renderDayOverview(i,d,m,stay,transport,t,u,x){
 let secondary='';
 if(i===0)secondary=link(directions({start:'Aeropuerto Seve Ballesteros Santander',end:'Mies del Valle 4 Santander',waypoints:[],mode:'transit'}),t.hotelDirections);
 if(i===1)secondary=link('https://www.alsa.com/',t.busTickets);
 if(i===2)secondary=link(searchMaps('Funicular Artxanda estación inferior Bilbao'),t.funicularMap)+link(searchMaps('Mirador de Artxanda Bilbao'),t.mapOpen);
 if(i===3)secondary=link('https://www.guggenheim-bilbao.eus/horarios-y-tarifas',t.museumTickets)+link('https://www.alsa.com/',t.busTickets);
 if(i===4)secondary=link(directions(m),t.airportDirections);
 const mapbuttons=link(directions(m),m.mode==='transit'?t.routeTransit:t.routeButton,true)+link(searchMaps(m.center),t.mapOpen)+secondary;
 const transitUrl=i===0?directions({start:'Aeropuerto Seve Ballesteros Santander',end:'Mies del Valle 4 Santander',waypoints:[],mode:'transit'}):i===1?'https://www.alsa.com/':i===2?searchMaps('Funicular de Artxanda estación inferior Bilbao'):i===3?'https://www.alsa.com/':directions(m);
 const transitLabel=(i===1||i===3)?t.busTickets:i===2?t.funicularMap:t.routeTransit;
 return '<div class="day-layout"><article class="card"><div class="day-sub">'+esc(d.date)+'</div><p class="day-desc">'+esc(d.intro)+'</p><ol class="stoplist">'+d.steps.map(step=>'<li class="stop"><time>'+esc(step[0])+'</time><div><h4>'+esc(step[1])+'</h4><p>'+esc(step[2])+'</p></div></li>').join('')+'</ol><p class="notice"><b>'+esc(t.extraNote)+':</b> '+esc(d.note)+'</p></article>'+
 '<article class="card"><div class="maphead"><h3>'+esc(t.mapTitle)+'</h3><span aria-hidden="true">📍</span></div><div class="mapbox"><iframe title="Google Maps · '+esc(d.place)+'" src="'+esc(embedMaps(m.center))+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><p class="map-caption">'+esc(u.mapSource)+'</p><div class="buttons">'+mapbuttons+'</div><div class="rule"></div><b class="info-label">'+esc(t.routeStops)+'</b><div class="route-points">'+d.points.map(s=>'<span class="route-point">'+esc(s)+'</span>').join('')+'</div></article></div>'+
 '<div class="day-extras"><article class="mini-card"><span class="mini-label">🏨 '+esc(x.lodgingTitle)+'</span><h4>'+esc(stay.title)+'</h4><p>'+esc(stay.detail)+'</p><div class="buttons">'+link(searchMaps(stay.address),t.showOnMaps)+'</div></article><article class="mini-card transport"><span class="mini-label">🚌 '+esc(x.transportTitle)+'</span><h4>'+esc(transport.title)+'</h4><p>'+esc(transport.detail)+'</p><div class="buttons">'+link(transitUrl,transitLabel)+'</div></article></div>'+
 '<div class="day-content-footer">'+(i>0?link(PAGE_FILES[i-1],u.previous):link('index.html',u.returnHome))+(i<4?link(PAGE_FILES[i+1],u.next,true):link('index.html',u.returnHome,true))+'</div>';
}
function renderRestaurants(i,t,u,x){
 const entries=GASTRO_PICKS.filter(r=>r.day===i);
 if(!entries.length){$('restaurantPicks').innerHTML='<article class="single-restaurant"><h3>'+esc(u.breakfastTitle)+'</h3><span class="price">'+esc(u.breakfastPrice)+'</span><p>'+esc(u.breakfastNote)+'</p>'+link(searchMaps('Panadería cerca de Mies del Valle 4 Santander'),u.viewOnMap)+'</article>';return}
 $('restaurantPicks').innerHTML=entries.map(r=>'<article class="card restaurant-card"><div class="spot">'+esc(r.spot)+'</div><h4>'+esc(r.name)+'</h4><span class="price">'+esc(r.price)+'</span><p>'+esc(r[lang])+'</p><div class="order"><b>'+esc(u.orderLabel)+':</b> '+esc(lang==='es'?(ORDER_ES[r.name]||r.order):r.order)+'</div><div class="buttons">'+link(searchMaps(r.query),x.restaurantLink)+'</div></article>').join('');
}
let toastTimer;
function toast(str){const el=$('toast');el.textContent=str;el.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add('hidden'),3100)}
function renderAll(){
 document.documentElement.lang=lang;const t=T[lang];
 $('lang-it').setAttribute('aria-pressed',String(lang==='it'));
 $('lang-es').setAttribute('aria-pressed',String(lang==='es'));
 $('shareText').textContent=t.share;
 $('footerTitle').textContent=t.footerTitle;$('footerNote').textContent=t.footerNote;$('sourcesTitle').textContent=t.sourcesTitle;
 renderNav();if(pageIndex<0){renderHome();document.title=lang==='it'?'Santander & Bilbao · Il nostro viaggio':'Santander & Bilbao · Nuestro viaje'}else renderDay();
}
for(const b of document.querySelectorAll('.lang-btn'))b.addEventListener('click',()=>{if(lang!==b.dataset.lang){lang=b.dataset.lang;try{localStorage.setItem('viajeSB2026Language',lang)}catch(_){ }renderAll()}});
$('shareBtn').addEventListener('click',async()=>{
 const t=T[lang];if(location.protocol==='file:'){toast(t.shareLocal);return}
 const url=location.href.split('#')[0];
 if(navigator.share){try{await navigator.share({title:document.title,url});return}catch(_){}}
 try{await navigator.clipboard.writeText(url);toast(t.shareCopied)}catch(_){toast(url)}
});
renderAll();
