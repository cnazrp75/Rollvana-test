(()=>{
const Q=new URLSearchParams(location.search);
const AVK=["m","f","n"].includes(Q.get("av"))?Q.get("av"):"m";
const N0=Q.has("n")?Math.max(0,parseInt(Q.get("n"),10)||0):3;
const faD=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
const MAX=99;
const countText=n=>n>MAX?"+"+faD(MAX):faD(n);
const bellLabel=n=>n>0?"اعلان‌ها، "+faD(n)+" خوانده‌نشده":"اعلان‌ها";
const HEAD={
  n:'<circle cx="128" cy="100" r="44"/><path d="M48 224c4-42 36-66 80-66s76 24 80 66"/>',
  m:'<circle cx="128" cy="106" r="42"/><path d="M42 224c6-42 38-64 86-64s80 22 86 64"/><path class="hair" d="M80 104C74 64 96 38 130 38c34 0 56 26 48 66-8-14-18-22-32-26-14 12-38 22-66 26Z"/>',
  f:'<circle cx="128" cy="110" r="40"/><path d="M52 224c4-36 34-54 76-54s72 18 76 54"/><path class="hair" d="M82 112C76 68 98 40 128 40c30 0 52 28 46 72-14-10-34-28-46-48-12 20-32 38-46 48Z"/><path d="M82 112c-4 28-6 50-22 70M174 112c4 28 6 50 22 70"/>'
};
const avatarSvg=k=>'<svg class="avg" viewBox="0 0 256 256" aria-hidden="true">'+(HEAD[k]||HEAD.n)+'</svg>';
function Avatar({kind}){return React.createElement("span",{className:"avw",dangerouslySetInnerHTML:{__html:avatarSvg(kind||AVK)}})}
function Count({n}){const v=n==null?N0:n;if(!(v>0))return null;return React.createElement("span",{className:"bcnt num"+(v>MAX?" cap":v>9?" two":""),"aria-hidden":"true"},countText(v))}
window.RVC={AVK,N0,MAX,countText,bellLabel,avatarSvg,Avatar,Count,faD};
})();
