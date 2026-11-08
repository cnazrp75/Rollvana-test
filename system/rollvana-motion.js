(()=>{
const {useState,useEffect,useRef}=React;
const {motion,AnimatePresence,useReducedMotion,useMotionValue}=Motion;
const html=htm.bind(React.createElement);
const fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);

const EASE=[0.22,1,0.36,1];
const EASE_IN=[0.64,0,0.78,0];
const EASE_LEAVE=[0.4,0,1,1];
const EASE_STAGE=[0.4,0,0.2,1];

const SPR={type:"spring",stiffness:380,damping:32};
const SOFT={type:"spring",stiffness:260,damping:34,mass:.9};
const SNAP={type:"spring",stiffness:520,damping:34,mass:.45};
const MARK={type:"spring",stiffness:420,damping:36};
const PANEL={type:"spring",stiffness:300,damping:34};
const SHEET={type:"spring",stiffness:300,damping:30};
const TALLY={type:"spring",stiffness:120,damping:20,mass:.8};
const DIGIT={type:"spring",duration:.45,bounce:.28};
const PRESS={scale:.94};

const ITEM={hide:r=>r?{opacity:0}:{opacity:0,y:6,filter:"blur(3px)"},show:r=>({opacity:1,y:0,filter:"blur(0px)",transitionEnd:{filter:"none"},transition:{duration:r?.15:.42,ease:EASE}})};
const stagger=(each,first=.1)=>({hide:{},show:r=>({transition:{staggerChildren:r?0:each,delayChildren:r?0:first}}),out:r=>({opacity:0,transition:{duration:r?.1:.16,ease:"easeIn"}})});

function Slot({ch,dir=1,dur=450,blur=8}){
  const r=useReducedMotion();
  const d=dur/1000;
  return html`<span class="an-slot" aria-hidden="true"><${AnimatePresence} initial=${false} mode="popLayout">
    <${motion.span} key=${"c"+ch} class="an-layer"
      initial=${r?{opacity:0}:{y:(.6*dir)+"em",opacity:0,filter:`blur(${blur}px)`}}
      animate=${{y:0,opacity:1,filter:"blur(0px)",transitionEnd:{filter:"none"},transition:r?{duration:.15}:{y:{...DIGIT,duration:d},default:{duration:d,ease:EASE}}}}
      exit=${r?{opacity:0,transition:{duration:.1}}:{y:(-.6*dir)+"em",opacity:0,filter:`blur(${blur}px)`,transition:{duration:d*.6,ease:EASE_LEAVE}}}
    >${ch||"​"}</${motion.span}>
  </${AnimatePresence}></span>`;
}
function AnimChars({text,dir=1,dur=520,blur=8,label}){
  const ch=String(text).split(""),n=ch.length;
  return html`<span class="an-root" aria-label=${label||String(text)} role="text">${ch.map((c,i)=>html`<${Slot} key=${n-1-i} ch=${c} dir=${dir} dur=${dur} blur=${blur}/>`)}</span>`;
}
function Words({text,k,dir=1,reduced,stagger=.035,delay=0}){
  const w=String(text).split(" ");
  return html`<${AnimatePresence} mode="popLayout" initial=${false}>
    <${motion.span} key=${k} class="swap" style=${{display:"inline-block"}}>
      ${w.map((x,j)=>html`<${motion.span} key=${j} class="w"
        initial=${reduced?{opacity:0}:{opacity:0,y:10*dir,filter:"blur(6px)"}}
        animate=${{opacity:1,y:0,filter:"blur(0px)",transition:{duration:reduced?.2:.5,delay:reduced?0:delay+.12+j*stagger,ease:EASE}}}
        exit=${reduced?{opacity:0,transition:{duration:.15}}:{opacity:0,y:-10*dir,filter:"blur(8px)",transition:{duration:.3,delay:j*stagger*.6,ease:EASE_IN}}}
      >${x}${j<w.length-1?" ":""}</${motion.span}>`)}
    </${motion.span}>
  </${AnimatePresence}>`;
}
function Fade({k,children,reduced,dir=1,delay=0,cls}){
  return html`<${AnimatePresence} mode="popLayout" initial=${false}>
    <${motion.div} key=${k} class=${cls}
      initial=${reduced?{opacity:0}:{opacity:0,y:8*dir,filter:"blur(8px)"}}
      animate=${{opacity:1,y:0,filter:"blur(0px)",transition:{duration:reduced?.2:.6,delay:reduced?0:delay,ease:EASE}}}
      exit=${reduced?{opacity:0,transition:{duration:.15}}:{opacity:0,y:-6*dir,filter:"blur(8px)",transition:{duration:.32,ease:EASE_IN}}}
    >${children}</${motion.div}>
  </${AnimatePresence}>`;
}
function Cross({k,children,reduced,blur=10,dur=.45,delay=0}){
  return html`<${AnimatePresence} initial=${false}>
    <${motion.div} key=${k} class="cross"
      initial=${reduced?{opacity:0}:{opacity:0,filter:`blur(${blur}px)`}}
      animate=${{opacity:1,filter:"blur(0px)",transition:{duration:reduced?.15:dur,delay:reduced?0:delay,ease:EASE}}}
      exit=${reduced?{opacity:0,transition:{duration:.12}}:{opacity:0,filter:`blur(${blur}px)`,transition:{duration:dur*.7,ease:EASE_LEAVE}}}>${children}</${motion.div}>
  </${AnimatePresence}>`;
}
function Count({v,dec=0,fmt}){
  const [d,setD]=useState(v);const cur=useRef(v);const reduced=useReducedMotion();
  useEffect(()=>{if(reduced){setD(v);cur.current=v;return}const c=Motion.animate(cur.current,v,{...TALLY,onUpdate:x=>{cur.current=x;setD(x)}});return()=>c.stop()},[v]);
  const t=d.toFixed(dec),f=v.toFixed(dec);
  return html`<span class="num" aria-label=${fmt?fmt(f):f}>${fmt?fmt(t):t}</span>`;
}
function Flip({v,reduced}){
  return html`<span class="flip"><${AnimatePresence} initial=${false} mode="popLayout">
    <${motion.span} key=${v} initial=${reduced?{opacity:0}:{y:"100%",opacity:0}} animate=${{y:"0%",opacity:1}} exit=${reduced?{opacity:0}:{y:"-100%",opacity:0}} transition=${{duration:.38,ease:EASE}}>${v}</${motion.span}>
  </${AnimatePresence}></span>`;
}
function GenreMorph({text,reduced}){
  const parts=text.split("، ");
  return html`<${Motion.LayoutGroup}><span class="gm">
    <${AnimatePresence} mode="popLayout" initial=${false}>
      ${parts.map((w,j)=>html`<${motion.span} key=${w} layout=${reduced?false:"position"}
        initial=${reduced?{opacity:0}:{opacity:0,filter:"blur(6px)",y:6}} animate=${{opacity:1,filter:"blur(0px)",y:0}}
        exit=${reduced?{opacity:0}:{opacity:0,filter:"blur(6px)",y:-6}}
        transition=${{duration:.42,ease:EASE,layout:SOFT}}>${w}${j<parts.length-1?"، ":""}</${motion.span}>`)}
    </${AnimatePresence}>
  </span></${Motion.LayoutGroup}>`;
}
function Runtime({rt,kind,reduced}){
  const m=rt.match(/^([۰-۹]+)\s(.+)$/);const n=m?Number(m[1].replace(/[۰-۹]/g,c=>"۰۱۲۳۴۵۶۷۸۹".indexOf(c))):0;const unit=m?m[2]:rt;
  return html`<span class="rtw"><${AnimatePresence} initial=${false} mode="popLayout">
    <${motion.span} key=${kind} class="rt"
      initial=${reduced?{opacity:0}:{opacity:0,filter:"blur(4px)"}} animate=${{opacity:1,filter:"blur(0px)"}} exit=${reduced?{opacity:0}:{opacity:0,filter:"blur(4px)"}} transition=${{duration:.3,ease:EASE}}>
      <${Count} v=${n} fmt=${fa}/> ${unit}
    </${motion.span}>
  </${AnimatePresence}></span>`;
}
function Fill({run,dur,reduced,k,cls}){
  const x=useMotionValue(0);
  useEffect(()=>{x.set(0);if(!run)return;if(reduced){x.set(1);return}const c=Motion.animate(x,1,{duration:dur/1000,ease:"linear"});return()=>c.stop()},[run,dur,reduced,k]);
  return html`<${motion.b} class=${cls} style=${{scaleX:x}}/>`;
}
function Drift({reduced,dur=9,to=1.06,style,...p}){
  const s=useMotionValue(1);
  useEffect(()=>{s.set(1);if(reduced)return;const c=Motion.animate(s,to,{duration:dur,ease:"linear"});return()=>c.stop()},[reduced,dur,to]);
  return html`<${motion.img} ...${p} style=${{...style,scale:s}}/>`;
}
let shimA=null;
function shimmer(times=3){
  if(shimA)shimA.stop();
  const put=v=>document.querySelectorAll(".sk").forEach(el=>{el.style.backgroundPosition=v});
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){put("");return}
  shimA=Motion.animate(100,-200,{duration:1.4,ease:"linear",repeat:times-1,onUpdate:x=>put(x+"% 0"),onComplete:()=>put("")});
}
shimmer();

const STATE={tap:.15,ink:.2,fill:.25,swing:.3,glide:.32,tint:.35,reveal:.4,grow:.45,settle:.5,slow:.6,tide:1.4};
const ACCENT={duration:1.1,ease:EASE_STAGE};
const ALL=["background-color","color","box-shadow","border-color","opacity"];
const ALIAS={background:["background-color"],margin:["margin-top","margin-right","margin-bottom","margin-left"],all:ALL};
const RM=matchMedia("(prefers-reduced-motion: reduce)");
const cv=document.createElement("canvas");cv.width=cv.height=1;const cx=cv.getContext("2d",{willReadFrequently:true});
const ccache=new Map();
function rgba(c){
  if(ccache.has(c))return ccache.get(c);
  cx.clearRect(0,0,1,1);cx.fillStyle="#000";cx.fillStyle=c;cx.fillRect(0,0,1,1);
  const [r,g,b,a]=cx.getImageData(0,0,1,1).data;
  const out=a?`rgba(${r}, ${g}, ${b}, ${+(a/255).toFixed(2)})`:"rgba(0, 0, 0, 0)";
  ccache.set(c,out);return out;
}
const CRE=/(?:rgba?|hsla?|oklab|oklch|lab|lch|hwb|color|color-mix)\((?:[^()]|\([^()]*\))*\)|#[0-9a-fA-F]{3,8}\b|\btransparent\b/g;
const colors=s=>s.replace(CRE,rgba);
const shape=s=>s.replace(/-?\d*\.?\d+(e-?\d+)?/g,"#");
const IDF={blur:"0px",brightness:"1",saturate:"1",contrast:"1",grayscale:"0",sepia:"0",opacity:"1",invert:"0","hue-rotate":"0deg"};
const shadows=s=>s.split(/,(?![^()]*\))/).map(x=>x.trim());
const zeroShadow=x=>x.replace(CRE,"rgba(0, 0, 0, 0)").replace(/-?\d*\.?\d+px/g,"0px");
function pair(p,a,b){
  if(a===b)return null;
  if(p.startsWith("--")){if(!CSS.supports("color",a)||!CSS.supports("color",b))return null;return [rgba(a),rgba(b)]}
  a=colors(a);b=colors(b);
  if(p==="transform"){const id=m=>m.startsWith("matrix3d")?"matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)":"matrix(1, 0, 0, 1, 0, 0)";if(a==="none")a=id(b);if(b==="none")b=id(a)}
  if(p==="filter"){
    const fx=v=>v==="none"?[]:[...v.matchAll(/([a-z-]+)\(([^)]*)\)/g)].map(x=>[x[1],x[2]]);
    const A=fx(a),B=fx(b),names=[...new Set([...A,...B].map(x=>x[0]))];
    if(names.some(n=>IDF[n]==null))return null;
    const out=L=>names.map(n=>{const f=L.find(x=>x[0]===n);return `${n}(${f?f[1]:IDF[n]})`}).join(" ");
    a=out(A);b=out(B);
  }
  if(p==="box-shadow"){
    let A=a==="none"?[]:shadows(a),B=b==="none"?[]:shadows(b);
    while(A.length<B.length)A.push(zeroShadow(B[A.length]));
    while(B.length<A.length)B.push(zeroShadow(A[B.length]));
    a=A.join(", ");b=B.join(", ");
  }
  if(a===b||shape(a)!==shape(b)||!/\d/.test(a))return null;
  return [a,b];
}
function spec(cs){
  const v=cs.getPropertyValue("--motion").trim();if(!v)return null;
  const out={};let hold=false,max=0;
  for(const part of v.split(",")){const [p,t]=part.trim().split(/\s+/);
    if(p==="visibility"){hold=true;continue}
    const d=STATE[t]??STATE.ink;max=Math.max(max,d);
    for(const q of ALIAS[p]||[p])out[q]=d;}
  return {props:out,hold,max};
}
const TRACK=new Set(),MEM=new WeakMap();
function own(el){let m=MEM.get(el);if(!m){m={vals:{},anim:{},wrote:{},base:{},vis:null,init:false};MEM.set(el,m)}return m}
function target(el,m,props){
  const live=Object.keys(m.wrote);
  for(const p of live)el.style.setProperty(p,m.base[p]||"");
  const cs=getComputedStyle(el);const sp=spec(cs);const vals={};
  for(const p of new Set([...Object.keys(props||{}),...Object.keys(sp?sp.props:{})]))vals[p]=cs.getPropertyValue(p);
  const vis=cs.visibility;
  for(const p of live){el.style.setProperty(p,m.wrote[p],"important");m.wrote[p]=el.style.getPropertyValue(p)}
  return {sp,vals,vis};
}
function settle(el,m,p){
  const a=m.anim[p];if(a)a.stop();delete m.anim[p];
  if(p in m.wrote){if(el.style.getPropertyValue(p)===m.wrote[p])el.style.setProperty(p,m.base[p]||"");delete m.wrote[p];delete m.base[p]}
}
function tween(el,m,p,from,to,d){
  const shown=p in m.wrote?m.wrote[p]:from;
  const pr=pair(p,shown,to);
  if(!pr){settle(el,m,p);return}
  if(!(p in m.wrote)){const b=el.style.getPropertyValue(p);if(b)return;m.base[p]=b}
  if(m.anim[p])m.anim[p].stop();
  const put=v=>{el.style.setProperty(p,String(v),"important");m.wrote[p]=el.style.getPropertyValue(p)};
  const write=v=>{if(p in m.wrote&&el.style.getPropertyValue(p)!==m.wrote[p]){settle(el,m,p);return}put(v)};
  put(pr[0]);
  m.anim[p]=run(pr[0],pr[1],{duration:d,ease:EASE},write,()=>settle(el,m,p));
}
function run(a,b,o,up,done){
  const num=x=>/^-?\d*\.?\d+$/.test(x);if(num(a)&&num(b)){a=+a;b=+b}
  const mv=Motion.motionValue(a);const off=mv.on("change",up);
  const c=Motion.animate(mv,b,{...o,onComplete:()=>{off();done&&done()}});
  return {stop:()=>{off();c.stop()}};
}
let still=false;
function check(el){
  if(!el.isConnected){TRACK.delete(el);return}
  const m=own(el);const t=target(el,m,m.vals);
  if(!t.sp&&!Object.keys(m.wrote).length&&!m.init){return}
  TRACK.add(el);
  if(!m.init||still){m.vals=t.vals;m.visv=t.vis;m.init=true;return}
  const reduced=RM.matches;
  if(!t.sp)for(const p of Object.keys(m.wrote))settle(el,m,p);
  if(t.sp)for(const p in t.sp.props){
    const a=m.vals[p],b=t.vals[p];
    if(a==null||a===b)continue;
    if(reduced&&p!=="opacity"){settle(el,m,p);continue}
    tween(el,m,p,a,b,reduced?STATE.tap:t.sp.props[p]);
  }
  if(t.sp&&t.sp.hold&&m.visv==="visible"&&t.vis==="hidden"&&!reduced){
    clearTimeout(m.vis);el.style.setProperty("visibility","visible","important");
    m.vis=setTimeout(()=>{el.style.removeProperty("visibility")},t.sp.max*1000);
  }else if(t.vis!==m.visv&&m.vis){clearTimeout(m.vis);m.vis=null;el.style.removeProperty("visibility")}
  m.vals=t.vals;m.visv=t.vis;
}
function sweep(root){
  if(root.nodeType!==1)return;
  check(root);for(const el of root.querySelectorAll("*"))if(!TRACK.has(el))check(el);
}
function pass(){for(const el of [...TRACK])check(el)}
const ATTR=["class","aria-expanded","aria-selected","aria-pressed","aria-current","aria-checked","data-state","open","disabled","checked","opacity","hidden"];
function stateMotion(root=document.documentElement){
  sweep(root);
  new MutationObserver(list=>{
    const fresh=new Set();let attr=false;
    for(const r of list){
      if(r.type==="childList"){for(const n of r.addedNodes)if(n.nodeType===1)fresh.add(n)}
      else{attr=true;if(!TRACK.has(r.target))fresh.add(r.target)}
    }
    for(const n of fresh)if(n.isConnected){if(attr&&n.nodeType===1)sweep(n);else{check(n);for(const el of n.querySelectorAll("*"))check(el)}}
    if(attr)pass();
  }).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:ATTR});
  for(const ev of ["pointerover","pointerout","pointerdown","pointerup","pointercancel","focusin","focusout","change","input"])root.addEventListener(ev,()=>{pass();requestAnimationFrame(pass)},true);
  let rt;addEventListener("resize",()=>{still=true;pass();clearTimeout(rt);rt=setTimeout(()=>{pass();still=false},120)});
}
if(document.readyState==="loading")addEventListener("DOMContentLoaded",()=>stateMotion());else stateMotion();

let accA=null;
function accent(v,el=document.documentElement){
  const from=getComputedStyle(el).getPropertyValue("--acc").trim();
  if(accA)accA.stop();
  if(!from||rgba(from)===rgba(v)){el.style.setProperty("--acc",v);return}
  accA=run(rgba(from),rgba(v),{...ACCENT,duration:RM.matches?.15:ACCENT.duration},x=>el.style.setProperty("--acc",x),()=>el.style.setProperty("--acc",v));
}

window.RVM={fa,EASE,EASE_IN,EASE_LEAVE,EASE_STAGE,SPR,SOFT,SNAP,MARK,PANEL,SHEET,TALLY,DIGIT,PRESS,STATE,ACCENT,ITEM,stagger,shimmer,Slot,AnimChars,Words,Fade,Cross,Count,Flip,GenreMorph,Runtime,Fill,Drift,stateMotion,accent};
})();
