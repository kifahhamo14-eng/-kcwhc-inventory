(function catalogInit(){
const get=id=>document.getElementById(id), clean=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={selected:new Set(),per:6,prices:true,refs:true,cover:true,cat:'All Products'};
let source=()=>typeof products!=='undefined'&&Array.isArray(products)?products:[];
let cat=p=>typeof productCategory==='function'?productCategory(p):p.category||'Other';
let photo=p=>typeof productImage==='function'?productImage(p):p.image_url||'';
let ref=p=>p.product_number||p.item_number||p.storage_number||'';
let chosen=()=>source().filter(p=>state.selected.has(String(p.id)));
let css=document.createElement('style');
css.textContent='#kcCatalogModal{display:none;position:fixed;inset:0;z-index:999999;background:#001c1499;padding:12px;align-items:center;justify-content:center}#kcCatalogModal.open{display:flex}#kcCatalogModal *{box-sizing:border-box}#kcCatalogBox{font-family:Arial,sans-serif;background:#fffdf8;color:#233b30;border-radius:14px;padding:20px;max-width:970px;width:100%;max-height:94vh;overflow:auto}#kcCatalogBox header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ddd;padding-bottom:10px}#kcCatalogBox h2{font-family:Georgia,serif;margin:0}#kcCatalogBox button{background:#14503c;color:white;padding:9px 13px;border:0;border-radius:6px;cursor:pointer;margin:4px;font-weight:bold}#kcCatalogBox select{padding:8px;max-width:180px}#kcCatalogChoices{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;max-height:215px;overflow:auto;margin:12px 0}#kcCatalogChoices label{background:white;border:1px solid #ddd7c8;padding:7px;font-size:12px;display:block}#kcCatalogChoices img{width:100%;height:78px;object-fit:contain}#kcCatalogBox .options{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:12px 0}#kcCatalogPreview{height:330px;width:100%;border:1px solid #e1dfda;background:white}#kcCatalogBox .note{font-size:11px;color:#66766a}';
document.head.appendChild(css);
let dialog=document.createElement('div');dialog.id='kcCatalogModal';
dialog.innerHTML='<section id="kcCatalogBox" role="dialog" aria-modal="true"><header><div><h2>KCWHC Catalog Studio</h2><small>Professional product booklet • Six products per page</small></div><button id="kccClose">Close ×</button></header><div class="options"><label>Category <select id="kccCategory"></select></label><label>Products/page <select id="kccPer"><option value="6">6</option><option value="8">8</option><option value="9">9</option></select></label><label><input id="kccPrices" type="checkbox" checked> Prices</label><label><input id="kccRefs" type="checkbox" checked> References</label><label><input id="kccCover" type="checkbox" checked> Cover</label></div><div><b id="kccCount"></b> <button id="kccSelectAll">Select all</button><button id="kccClear">Clear</button></div><div id="kcCatalogChoices"></div><iframe title="Print catalog preview" id="kcCatalogPreview"></iframe><div><button id="kccPrint">Print / Save as PDF</button><button id="kccDownload">Download catalog file</button><button id="kccShare">Share file</button><button id="kccCopy">Copy product list</button></div><p class="note">Print to PDF using your browser print dialog. Downloaded HTML opens as a standalone catalog. Public hosted catalog links require separate publishing and are not included.</p></section>';
document.body.appendChild(dialog);
const style='@page{size:A4 portrait;margin:12mm}*{box-sizing:border-box}body{margin:0;background:white;color:#203b2d;font-family:Arial,sans-serif}.page{height:272mm;page-break-after:always;position:relative;padding:8mm 5mm 16mm}.page:last-child{page-break-after:auto}.head{display:flex;justify-content:space-between;border-bottom:1px solid #bfae80;padding-bottom:12px}.brand{font:25px Georgia,serif;letter-spacing:2px}.tag{font:10px Arial,sans-serif;letter-spacing:1.5px;color:#a18c62}.title{font:28px Georgia,serif;margin:13px 0 4px}.subtitle{font-size:10px;color:#758077;margin-bottom:16px}.grid{display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:12px}.item{padding:10px;border:1px solid #e5e0d3;break-inside:avoid;overflow:hidden}.photo{width:100%;height:var(--photo);object-fit:contain}.name{font:16px Georgia,serif;margin:7px 0}.meta{font:11px/1.6 Arial;color:#5e6b62}.price{font-size:14px;font-weight:bold;margin-top:4px}.foot{position:absolute;bottom:8mm;left:5mm;right:5mm;border-top:1px solid #d9d1bf;padding-top:8px;display:flex;justify-content:space-between;color:#777;font-size:10px}.cover{border:1px solid #c5b082;height:246mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.cover h1{font:70px Georgia,serif;letter-spacing:5px}.cover h2{font:35px Georgia,serif}@media screen{body{background:#eee;padding:18px}.page{background:white;max-width:210mm;margin:0 auto 16px;box-shadow:0 3px 20px #0002}}@media print{body{padding:0;background:white}.page{box-shadow:none;margin:0}}';
function doc(){
let items=chosen();if(!items.length)return '';
let pages=[];
if(state.cover)pages.push('<section class="page"><div class="cover"><div class="tag">KALANDIA COOPERATIVE</div><h1>KCWHC</h1><h2>Product Collection</h2><p>PALESTINIAN CRAFT • TIMELESS HERITAGE</p></div></section>');
for(let i=0;i<items.length;i+=state.per){
let tiles=items.slice(i,i+state.per).map(p=>'<article class="item">'+(photo(p)?'<img class="photo" src="'+clean(photo(p))+'">':'<div class="photo"></div>')+'<div class="name">'+clean(p.name)+'</div><div class="meta">'+clean(cat(p))+(p.color?'<br>Color: '+clean(p.color):'')+(p.size?'<br>Size: '+clean(p.size):'')+(state.refs&&ref(p)?'<br>Ref: '+clean(ref(p)):'')+'</div>'+(state.prices&&p.selling_price!=null?'<div class="price">₪ '+Number(p.selling_price).toFixed(2)+'</div>':'')+'</article>').join('');
pages.push('<section class="page" style="--cols:'+(state.per===9?3:2)+';--photo:'+(state.per===6?'88mm':state.per===8?'62mm':'57mm')+'"><div class="head"><b class="brand">KCWHC</b><span class="tag">PRODUCT COLLECTION</span></div><h2 class="title">'+clean(state.cat==='All Products'?'Crafted Heritage Collection':state.cat)+'</h2><div class="subtitle">Traditional Palestinian craftsmanship</div><div class="grid">'+tiles+'</div><div class="foot"><span>KCWHC • Crafted with purpose</span><span>'+(Math.floor(i/state.per)+1)+'</span></div></section>');
}
return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KCWHC Catalog</title><style>'+style+'</style></head><body>'+pages.join('')+'</body></html>';
}
function render(){
let items=source().filter(p=>state.cat==='All Products'||cat(p)===state.cat);
get('kcCatalogChoices').innerHTML=items.map(p=>'<label><input type="checkbox" data-pid="'+clean(p.id)+'" '+(state.selected.has(String(p.id))?'checked':'')+'>'+(photo(p)?'<img src="'+clean(photo(p))+'">':'')+'<div>'+clean(p.name)+'</div><small>'+clean(cat(p))+'</small></label>').join('');
get('kccCount').textContent=state.selected.size+' products selected';
get('kcCatalogPreview').srcdoc=doc()||'<p>Select products to preview.</p>';
}
window.kcOpenCatalogStudio=function(){
if(!source().length){alert('Load inventory products first.');return}
state.selected=new Set(source().map(p=>String(p.id)));state.cat='All Products';
get('kccCategory').innerHTML=['All Products',...new Set(source().map(cat))].map(c=>'<option>'+clean(c)+'</option>').join('');
dialog.classList.add('open');render()};
get('kccClose').onclick=()=>dialog.classList.remove('open');
get('kccCategory').onchange=e=>{state.cat=e.target.value;render()};
get('kccPer').onchange=e=>{state.per=Number(e.target.value);render()};
[['kccPrices','prices'],['kccRefs','refs'],['kccCover','cover']].forEach(([id,k])=>get(id).onchange=e=>{state[k]=e.target.checked;render()});
get('kcCatalogChoices').onchange=e=>{let id=e.target.dataset.pid;if(id){e.target.checked?state.selected.add(id):state.selected.delete(id);render()}};
get('kccSelectAll').onclick=()=>{source().forEach(p=>state.selected.add(String(p.id)));render()};
get('kccClear').onclick=()=>{state.selected.clear();render()};
function download(){if(!chosen().length)return alert('Select products.');let url=URL.createObjectURL(new Blob([doc()],{type:'text/html'}));let a=document.createElement('a');a.href=url;a.download='KCWHC_Product_Collection.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000)}
get('kccDownload').onclick=download;
get('kccPrint').onclick=()=>{if(!chosen().length)return alert('Select products.');let w=window.open('','_blank');if(!w)return alert('Allow popups to print.');w.document.write(doc());w.document.close();setTimeout(()=>w.print(),700)};
get('kccShare').onclick=async()=>{if(!chosen().length)return alert('Select products.');let f=new File([doc()],'KCWHC_Product_Collection.html',{type:'text/html'});if(navigator.canShare?.({files:[f]})){try{await navigator.share({files:[f],title:'KCWHC Product Collection'})}catch(e){if(e.name!=='AbortError')alert(e.message)}}else{download();alert('Catalog downloaded. Attach it to WhatsApp or email.')}};
get('kccCopy').onclick=async()=>{let t=chosen().map(p=>[p.name,cat(p),p.color?'Color: '+p.color:'',p.size?'Size: '+p.size:'',state.prices&&p.selling_price!=null?'₪ '+p.selling_price:''].filter(Boolean).join(' • ')).join('\n');try{await navigator.clipboard.writeText(t);alert('Product list copied.')}catch(e){alert('Clipboard unavailable.')}};
})();