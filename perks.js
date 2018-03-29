"use strict";function remove(a){a.parentNode.removeChild(a)}function switch_theme(){var a=$("#dark");localStorage.dark=(a.disabled=!a.disabled)?"":"1"}function show_alert(a,b){$("#alert").innerHTML+="<p class="+a+">\n			<span class=badge onclick='remove(this.parentNode)'>×</span>\n			"+b+"\n		</p>"}function create_share(a){var b=localStorage.notation+":";b+=$$("input,select").map(function(a){return a.value.replace(":","")}).join(":");var c=location.href.replace(/[#?].*/,"");c+="?"+LZString.compressToBase64(b);var d="https://api-ssl.bitly.com/v3/shorten?longUrl="+encodeURIComponent(c);d+="&login=grimy&apiKey=R_7ea82c1cec394d1ca5cf4da2a7f7ddd9",a=a||function(a){return show_alert("ok","Your share link is <a href="+a+">"+a)};var e=new XMLHttpRequest;e.open("GET",d,!0),e.onload=function(){return a(JSON.parse(e.responseText).data.url||c)},e.send()}function exit_share(){history.pushState({},"","perks.html"),$("textarea").removeEventListener("click",exit_share),$$("[data-saved]").forEach(function(a){return a.value=localStorage[a.id]||a.value})}function load_share(a){var b=LZString.decompressFromBase64(a).split(":"),c=localStorage.notation;localStorage.notation=b.shift(),$$("input,select").forEach(function(a){return a.value=b.shift()}),$("textarea").addEventListener("click",exit_share),localStorage.notation=c||1}function prettify(a){if(0>a)return"-"+prettify(-a);if(1e4>a)return+a.toPrecision(4)+"";if("0"===localStorage.notation)return a.toExponential(2).replace("+","");for(var b=0;a>=999.5;)a/=1e3,++b;var c=notations[localStorage.notation||1],d=b>c.length?"e"+3*b:c[b-1];return+a.toPrecision(3)+d}function parse_suffixes(a){a=a.replace(/\*.*|[^--9+a-z]/gi,"");for(var b=notations["3"===localStorage.notation?3:1],c=b.length;c>0;--c)a=a.replace(new RegExp(b[c-1]+"$","i"),"E"+3*c);return+a}function input(a){return parse_suffixes($("#"+a).value)}function check_input(a){var b=isFinite(parse_suffixes(a.value)),c="3"===localStorage.notation?"alphabetic ":"";a.setCustomValidity(b?"":"Invalid "+c+"number: "+a.value)}function mastery(a){if(!game.talents[a])throw"unknown mastery: "+a;return game.talents[a].purchased}function handle_paste(a,b,c){var d=a.clipboardData.getData("text/plain").replace(/\s/g,"");try{game=JSON.parse(LZString.decompressFromBase64(d));var e=4.72;game.global.version>e+.009?show_alert("warning","This calculator only supports up to v"+e+" of Trimps, but your save is from v"+game.global.version+". Results may be inaccurate."):game.global.version<e&&show_alert("ok","Trimps v"+e+" is out! Your save is still on v"+game.global.version+", so you should refresh the game’s page.")}catch(f){throw"Your clipboard did not contain a valid Trimps save. Open the game, click “Export” then “Copy to Clipboard”, and try again."}localStorage.notation=game.options.menu.standardNotation.enabled,b(),c()}function validate_fixed(){try{parse_perks($("#fixed").value,"l"),$("#fixed").setCustomValidity("")}catch(a){$("#fixed").setCustomValidity(a)}}function toggle_fluffy(){$("#weight-xp").parentNode.style.display=localStorage.fluffy?"":"none"}function select_preset(a,b){void 0===b&&(b=!0),delete localStorage["weight-he"],delete localStorage["weight-atk"],delete localStorage["weight-hp"],delete localStorage["weight-xp"],c=presets[a],$("#weight-he").value=c[0],$("#weight-atk").value=c[1],$("#weight-hp").value=c[2],$("#weight-xp").value=floor((+presets[a][0]+ +presets[a][1]+ +presets[a][2])/5).toString();var c}function auto_preset(){var a=presets[$("#preset").value],b=a[0],c=a[1],d=a[2],e=floor((+b+ +c+ +d)/5).toString();$("#weight-he").value=localStorage["weight-he"]||b,$("#weight-atk").value=localStorage["weight-atk"]||c,$("#weight-hp").value=localStorage["weight-hp"]||d,$("#weight-xp").value=localStorage["weight-xp"]||e}function handle_respec(a){var b=game?game.resources.helium.owned:0;$("#helium").value=(input("helium")+b*(a?-1:1)).toString()}function update_dg(){function a(a){m+=a*c*sqrt(min(d,n)),n-=h}var b=input("zone")/2+115,c=5e8+5e7*game.generatorUpgrades.Efficiency.upgrades,d=3+.4*game.generatorUpgrades.Capacity.upgrades,e=game.permanentGeneratorUpgrades.Storage.owned?1.5*d:d,f=230+2*game.generatorUpgrades.Supply.upgrades,g=game.generatorUpgrades.Overclocker.upgrades;g=g&&1-.5*pow(.99,g-1);var h=game.permanentGeneratorUpgrades.Slowburn.owned?.4:.5,i=mastery("magmaFlow")?18:16,j=mastery("quickGen")?1.03:1.02,k=mastery("hyperspeed2")?(game.global.highestLevelCleared+1)/2:0,l=.5*mastery("blacksmith")+.25*mastery("blacksmith2")+.15*mastery("blacksmith3");l*=game.global.highestLevelCleared+1;for(var m=0,n=0,o=0,p=230;b>=p;++p){n+=i*(.01*min(p,f)-2.1);var q=ceil(60/pow(j,floor((p-230)/3)));for(o+=p>l?28:p>k?20:15;o>=q;)o-=q,a(1);for(;n>e;)a(g);m*=1.009}for(;n>=h;)a(1);$("#dg").value=prettify(m)}function read_save(){localStorage.zone||($("#zone").value=game.stats.highestVoidMap.valueTotal||game.global.highestLevelCleared);var a=input("zone");game.global.spiresCompleted>=2&&(localStorage.fluffy="yay"),toggle_fluffy(),localStorage.preset||($$("#preset > *").forEach(function(a){a.selected=parseInt(a.innerHTML.replace("z",""))<game.global.highestLevelCleared}),auto_preset());var b=game.global.heliumLeftover;for(var c in game.portal)b+=game.portal[c].heliumSpent;var d=Object.keys(game.portal).filter(function(a){return!game.portal[a].locked});game.global.canRespecPerks||(d=d.map(function(a){return a+">"+game.portal[a].level}));var e=mastery("turkimp4")?1:mastery("turkimp3")?.6:mastery("turkimp2")?.4:mastery("turkimp")?.3:.25,f=1+e,g=1+.333*e,h=min(floor((a-101)/100),game.global.spiresCompleted);g*=100>a?.7:1+(mastery("stillRowing")?.3:.2)*h;var i=27*game.unlocks.imps.Jestimp+15*game.unlocks.imps.Chronoimp,j=60>a?0:85>a?7:160>a?10:185>a?14:20;i+=(mastery("mapLoot2")?5:4)*j;for(var k=0,l=game.global.StaffEquipped.mods||[];k<l.length;k++){var m=l[k];"MinerSpeed"===m[0]?f*=1+.01*m[1]:"metalDrop"===m[0]&&(g*=1+.01*m[1])}update_dg(),$("#helium").value=b+($("#respec").checked?0:game.resources.helium.owned),$("#unlocks").value=d.join(","),$("#whipimp").checked=game.unlocks.imps.Whipimp,$("#magnimp").checked=game.unlocks.imps.Magnimp,$("#tauntimp").checked=game.unlocks.imps.Tauntimp,$("#venimp").checked=game.unlocks.imps.Venimp,$("#chronojest").value=prettify(i),$("#prod").value=prettify(f),$("#loot").value=prettify(g),$("#breed-timer").value=prettify(mastery("patience")?45:30)}function parse_inputs(){var a=$("#preset").value;if("trapper"==a&&(!game||"Trapper"!=game.global.challengeActive))throw"This preset requires a save currently running Trapper². Start a new run using “Trapper² (initial)”, export, and try again.";var b={he_left:input("helium"),zone:parseInt($("#zone").value),perks:parse_perks($("#fixed").value,$("#unlocks").value),weight:{helium:input("weight-he"),attack:input("weight-atk"),health:input("weight-hp"),xp:input("weight-xp"),trimps:0},fluffy:{xp:game?game.global.fluffyExp:0,prestige:game?game.global.fluffyPrestige:0},mod:{storage:.125,soldiers:0,dg:"nerfed"==a?0:input("dg"),tent_city:"tent"==a,whip:$("#whipimp").checked,magn:$("#magnimp").checked,taunt:$("#tauntimp").checked,ven:$("#venimp").checked,chronojest:input("chronojest"),prod:input("prod"),loot:input("loot"),breed_timer:input("breed-timer")}};"nerfed"==a&&(b.he_left=1e8,b.zone=200,b.mod.dg=0),"trapper"==a&&(b.mod.soldiers=game.resources.trimps.owned,b.mod.prod=0,b.perks.Pheromones.cap=0,b.perks.Anticipation.cap=0),"spire"==a&&(b.mod.prod=b.mod.loot=0,b.perks.Overkill.cap=0,game&&(b.zone=game.global.world)),"carp"==a&&(b.mod.prod=b.mod.loot=0,b.weight.trimps=1e6),"metal"==a&&(b.mod.prod=0),"trimp"==a&&(b.mod.soldiers=1),"nerfed"==a&&(b.perks.Overkill.cap=1),"scientist"==a&&(b.perks.Coordinated.cap=0);var c=game?game.global.highestLevelCleared:999;return a.match(/trimp|coord/)&&b.zone>=c/2&&show_alert("warning","Your target zone seems too high for this c², try lowering it."),"spire"==a&&game&&game.global.world!=100*(2+game.global.lastSpireCleared)&&show_alert("warning","This preset is meant to be used mid-run, when you’re done farming for the Spire."),b}function display(a){var b=a[0],c=a[1],d=game?game.options.menu.smallPerks.enabled:0,e=$("#perks").clientWidth/(5+d);$("#test-text").innerText="Level: "+prettify(12345678)+" (+"+prettify(1234567)+")";var f=e>$("#test-text").clientWidth?"Level: ":"";$("#results").style.opacity="1",$("#info").innerText=localStorage.more?"Less info":"More info",$("#he-left").innerHTML=prettify(b)+" Helium Left Over",$("#perks").innerHTML=Object.keys(c).filter(function(a){return!c[a].locked}).map(function(a){var b=c[a],e=b.level,g=b.cap,h=b.spent,i=game?e-game.portal[a].level:0,j=i?" ("+(i>0?"+":"-")+prettify(abs(i))+")":"",k=i>0?"adding":0>i?"remove":e>=g?"capped":"";return k+=[" large"," small"," tiny"][d],"<div class='perk "+k+" "+localStorage.more+"'>"+("<b>"+a.replace("_"," ")+"</b><br>")+(f+"<b>"+prettify(e)+j+"</b><br><span class=more>")+("Price: "+(e>=g?"∞":prettify(c[a].cost()))+"<br>")+("Spent: "+prettify(h)+"</span></div>")}).join("");for(var g in c)c[g]=c[g].level;$("#perkstring").innerText=LZString.compressToBase64(JSON.stringify(c))}function main(){display(optimize(parse_inputs()))}function toggle_info(){localStorage.more=localStorage.more?"":"more",$$(".perk").forEach(function(a){return a.classList.toggle("more")}),$("#info").innerText=localStorage.more?"Less info":"More info"}function parse_perks(a,b){var c={Looting_II:new Perk(1e5,1e4,1/0,1e4),Carpentry_II:new Perk(1e5,1e4,1/0,1e4),Motivation_II:new Perk(5e4,1e3,1/0,1e4),Power_II:new Perk(2e4,500,1/0,1e4),Toughness_II:new Perk(2e4,500,1/0,1e4),Capable:new Perk(1e8,0,10,1e4,900),Cunning:new Perk(1e11,0,1/0,1e4),Curious:new Perk(1e14,0,1/0,1e4),Overkill:new Perk(1e6,0,30,1e4),Resourceful:new Perk(5e4,0,1/0,1e6),Coordinated:new Perk(15e4,0,1/0,1e4),Siphonology:new Perk(1e5,0,3,1e4),Anticipation:new Perk(1e3,0,10,1e4),Resilience:new Perk(100,0,1/0,1e4),Meditation:new Perk(75,0,7,1e4),Relentlessness:new Perk(75,0,10,1e4),Carpentry:new Perk(25,0,1/0,1e4),Artisanistry:new Perk(15,0,1/0,1e4),Range:new Perk(1,0,10,1e4),Agility:new Perk(4,0,20,1e4),Bait:new Perk(4,0,1/0,1e7),Trumps:new Perk(3,0,1/0,1e8),Pheromones:new Perk(3,0,1/0,1e6),Packrat:new Perk(3,0,1/0,1e7),Motivation:new Perk(2,0,1/0,1e4),Power:new Perk(1,0,1/0,1e4),Toughness:new Perk(1,0,1/0,1e4),Looting:new Perk(1,0,1/0,1e4)};b.match(/>/)||(b=b.replace(/(?=,|$)/g,">0"));for(var d=function(a){var b=a.match(/(\S+) *([<=>])=?(.*)/);if(!b)throw"Enter a list of perk levels, such as “power=42, toughness=51”.";var d=b[1].match(/2$|II$/),e=b[1].replace(/[ _]?(2|II)/i,"").replace(/^OK/i,"O").replace(/^Looty/i,"L"),f=new RegExp("^"+e+"[a-z]*"+(d?"_II":"")+"$","i"),g=Object.keys(c).filter(function(a){return a.match(f)});if(g.length>1)throw"Ambiguous perk abbreviation: "+b[1]+".";if(g.length<1)throw"Unknown perk: "+b[1]+".";var h=parse_suffixes(b[3]);if(!isFinite(h))throw"Invalid number: "+b[3]+".";c[g[0]].locked=!1,">"!=b[2]&&(c[g[0]].cap=h),"<"!=b[2]&&(c[g[0]].must=h)},e=0,f=(b+","+a).split(/,/).filter(function(a){return a});e<f.length;e++){var g=f[e];d(g)}return c}function optimize(a){function b(){return 1+ +(M.level<3)+ceil(10*mult(M,-5))}function c(a){var c=s.storage*mult(C,-5)/add(Q,20),d=ia()*s.magn/b(),e=a?0:ha()*add(H,1)*s.prod,f=.1*s.chronojest*e*d;return ca*(e+d*s.loot+f)*(1-c)}function d(a){var b=ga[a]*mult(K,-5),d=1.136,e=log(1+c()*ja()/b)/log(fa.cost);return e>ea+.45&&(d=log(1+.2*pow(fa.cost,e-ea))/log(1.2),e=ea),d*pow(fa[a],e)}function e(a,b){return a*=4*mult(C,-5),log(1+c(!0)*ja()*(b-1)/a)/log(b)}function f(){return max(o-229,0)}function g(){var a=e(2e6,1.06)/(1+.1*min(f(),20)),b=.0085*(o>=60?.1:1)*pow(1.1,floor(o/5));return b*pow(1.01,a)*add(P,10)*s.ven}function h(){var a=1+.25*mult(D,-2),b=(s.soldiers||ja())/3;s.soldiers>1&&(b+=36e3*add(N,100));var c=log(b/ka[D.level])/log(a),d=o-1+(f()?100:0);return ka[0]*pow(1.25,min(c,d))}function i(){var a=(.15+d("attack"))*pow(.8,f());return a*=add(S,5)*add(w,1),a*=add(I,5*add(I,30)),a*=pow(1+E.level,.1)*add(L,1),a*=add(F,6),h()*a}function j(){var a=(.6+d("health"))*pow(.8,f());a*=add(T,5)*add(x,1)*mult(G,10);var c=e(400,1.185),i=(c*log(1.185)-log(1+c))/log(1.1)+25-aa,j=.04*c*pow(1+aa/100,c)*(1+ba*i),k=60;if(70>o){var l=log(1+h()*g()/add(N,100))/log(1+g());k=l/b()}else{var m=1+.25*mult(D,-2),n=o-1+(f()?100:0),p=ka[D.level]*pow(m,n),q=min(p/ja(),1/3),r=q>1e-9?10*(pow(.5/(.5-q),.1/s.breed_timer)-1):q/s.breed_timer,t=log(g()/r)/-log(.98);a*=pow(1.01,t)}return a/=k,60>o?j+=d("block"):j=min(j,4*a),h()*(j+a)}function k(){var a=p.base*add(z,25)*add(A,60),b=10==y.level?1/0:1e3*pow(5,p.prestige)*(mult(y,300)-1)/3;return max(1,min(a,b-p.xp)+min(7*a,b-p.xp))}function l(){var a=0;for(var b in r)if(r[b]){var c=ta[b]();if(!isFinite(c))throw Error(b+" is "+c);a+=r[b]*log(c)}return a}function m(){var a,b=0,c=l();for(var d in q){var e=q[d];if(!(e.locked||e.level>=e.cap||e.cost()>n)){e.level+=e.pack;var f=l()-c;e.level-=e.pack;var g=f/e.cost();g>=b&&(b=g,a=e)}}return a}var n=a.he_left,o=a.zone,p=a.fluffy,q=a.perks,r=a.weight,s=a.mod,t=q.Looting_II,u=q.Carpentry_II,v=q.Motivation_II,w=q.Power_II,x=q.Toughness_II,y=q.Capable,z=q.Cunning,A=q.Curious,B=q.Overkill,C=q.Resourceful,D=q.Coordinated,E=q.Siphonology,F=q.Anticipation,G=q.Resilience,H=q.Meditation,I=q.Relentlessness,J=q.Carpentry,K=q.Artisanistry,L=q.Range,M=q.Agility,N=q.Bait,O=q.Trumps,P=q.Pheromones,Q=q.Packrat,R=q.Motivation,S=q.Power,T=q.Toughness,U=q.Looting;for(var V in q)V.endsWith("_II")&&(q[V].pack=pow(10,max(0,floor(log(n)/log(100)-4.2))));for(var W=0,X=["whip","magn","taunt","ven"];W<X.length;W++){var Y=X[W];s[Y]=pow(1.003,99*o*.03*s[Y])}for(var Z=pow(1.25,o)*pow(o>100?1.28:1.2,max(o-59,0)),$=max(0,min(o-60,o/2-25,o/3-12,o/5,o/10+17,39)),_=pow(1.25,min(o/2,30)+$),aa=o>=25?floor(min(o/5,9+o/25,15)):0,ba=(20+o-o%5)/100,ca=600*s.whip*Z,da=pow(o-19,2),ea=o/5+ +(5>(o-1)%10),fa={cost:pow(1.069,.85*(60>o?57:53)),attack:pow(1.19,13),health:pow(1.19,14),block:pow(1.19,10)},ga={attack:211*(r.attack+r.health)/r.attack,health:248*(r.attack+r.health)/r.health,block:5*(r.attack+r.health)/r.health},ha=function(){return add(R,5)*add(v,1)},ia=function(){return add(U,5)*add(t,.25)},ja=s.tent_city?function(){var a=mult(J,10)*add(u,.25),b=add(O,20);return 10*(s.taunt+b*(s.taunt-1)*111)*a}:function(){var a=mult(J,10)*add(u,.25),b=3+max(log(c()/ca*a/mult(C,-5)),0),d=add(O,20)*o;return 10*(_*b+d)*a*s.taunt+s.dg*a},ka=[],la=0;la<=log(1+n/5e5)/log(1.3);++la){for(var ma=1+.25*pow(.98,la),na=1,oa=0;100>oa;++oa)na=ceil(na*ma);ka[la]=na/pow(ma,100)}p.base=0;for(var pa=301;o>pa;++pa)p.base+=50*pow(1.015,pa-300);var qa=function(){return 1/mult(M,-5)},ra=function(){return da*ia()+45},sa=function(){return max(.2,B.level)},ta={agility:qa,helium:ra,xp:k,attack:i,health:j,overkill:sa,trimps:ja};s.loot*=20.8,r.agility=(r.helium+r.attack)/2,r.overkill=.25*r.attack*(2-pow(.9,r.helium/r.attack)),o>110&&s.soldiers<=1&&0==N.must&&(N.cap=0),y.must||(y.must=ceil(log(.003*p.xp/pow(5,p.prestige)+1)/log(4))),y.must=min(y.must,10,floor(log(n)/log(10)-7.5));for(var ua in q)for(var va=q[ua];va.level<va.must;){var wa=va.cost();n-=wa,va.level+=va.pack,va.spent+=wa}if(0>n)throw game&&game.global.canRespecPerks?"You don’t have enough Helium to afford your Fixed Perks.":"You don’t have a respec available.";for(var xa=void 0;xa=m();){for(var ya=0;xa.level<xa.cap&&(xa.level<xa.must||ya<n/xa.free);)n-=xa.cost(),ya+=xa.cost(),xa.level+=xa.pack,xa.level==1e3*xa.pack&&(xa.pack*=10);xa.spent+=ya}for(var va in q)console.log(va,"=",q[va].level);return[n,q]}var abs=Math.abs,ceil=Math.ceil,floor=Math.floor,log=Math.log,max=Math.max,min=Math.min,pow=Math.pow,round=Math.round,sqrt=Math.sqrt,$=function(a){return document.querySelector(a)},$$=function(a){return[].slice.apply(document.querySelectorAll(a))};$("#dark").disabled=!localStorage.dark;var notations=[[],"KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTgUtgDtgTtgQatgQitgSxtgSptgOtgNtgQaaUqaDqaTqaQaqaQiqaSxqaSpqaOqaNqaQiaUqiDqiTqiQaqiQiqiSxqiSpqiOqiNqiSxaUsxDsxTsxQasxQisxSxsxSpsxOsxNsxSpaUspDspTspQaspQispSxspSpspOspNspOgUogDogTogQaogQiogSxogSpogOogNogNaUnDnTnQanQinSxnSpnOnNnCtUc".split(/(?=[A-Z])/),[],"a b c d e f g h i j k l m n o p q r s t u v w x y z aa ab ac ad ae af ag ah ai aj ak al am an ao ap aq ar as at au av aw ax ay az ba bb bc bd be bf bg bh bi bj bk bl bm bn bo bp bq br bs bt bu bv bw bx by bz ca cb cc cd ce cf cg ch ci cj ck cl cm cn co cp cq cr cs ct cu cv cw cx".split(" "),"KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTg".split(/(?=[A-Z])/)];window.addEventListener("error",function(a){return"string"==typeof a.error?void show_alert("ko",a.error):void create_share(function(b){return show_alert("ko","Oops! It’s not your fault, but something went wrong. You can go pester the dev on\n	<a href=https://github.com/Grimy/Grimy.github.io/issues/new>GitHub</a> or\n	<a href=https://www.reddit.com/message/compose/?to=Grimy_>Reddit</a>, he’ll fix it.\n	If you do, please include the following message:<br>\n	<tt>"+b+" "+a.filename+" l"+(a.lineno||0)+"c"+(a.colno||0)+" "+a.message+"</tt>.")})});var game;document.addEventListener("DOMContentLoaded",function(){var a="2.4";a>localStorage.version&&show_alert("ok","Welcome to Trimps tools v"+a+"! See what’s new in the <a href=changelog.html>changelog</a>."),localStorage.version=a,location.search&&load_share(location.search.substr(1)),$$("[data-saved]").forEach(function(a){"checkbox"===a.type?(a.checked="true"===localStorage[a.id],a.addEventListener("change",function(){return localStorage[a.id]=a.checked})):(a.value=localStorage[a.id]||a.value,a.addEventListener("change",function(){return localStorage[a.id]=a.value}))})},!1);var Perk=function(){function a(a,b,c,d,e){void 0===e&&(e=30),this.base_cost=a,this.increment=b,this.cap=c,this.free=d,this.scaling=e,this.locked=!0,this.level=0,this.pack=1,this.must=0,this.spent=0}return a.prototype.cost=function(){return this.increment?this.pack*(this.base_cost+this.increment*(this.level+(this.pack-1)/2)):ceil(this.level/2+this.base_cost*mult(this,this.scaling))},a}(),presets={early:["5","4","3"],broken:["7","3","1"],mid:["16","5","1"],corruption:["25","7","1"],magma:["35","4","3"],z280:["42","6","1"],z400:["88","10","1"],z450:["500","50","1"],spire:["0","1","1"],nerfed:["0","4","3"],tent:["5","4","3"],scientist:["0","1","3"],carp:["0","0","0"],trapper:["0","7","1"],coord:["0","40","1"],trimp:["0","99","1"],metal:["0","7","1"],c2:["0","7","1"]};document.addEventListener("DOMContentLoaded",validate_fixed,!1),document.addEventListener("DOMContentLoaded",toggle_fluffy,!1),document.addEventListener("DOMContentLoaded",auto_preset,!1);var add=function(a,b){return 1+a.level*b/100},mult=function(a,b){return pow(1+b/100,a.level)};