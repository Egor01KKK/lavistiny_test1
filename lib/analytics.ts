export function yandexMetrikaSnippet(id: string){
  return `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(${id}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:false });
    document.addEventListener('click', function(e){
      const a = (e.target as HTMLElement).closest('a[data-sku][data-market]');
      if(!a) return;
      try { (window as any).ym(${id}, 'reachGoal', 'marketplace_click', { sku: (a as HTMLAnchorElement).dataset.sku, market: (a as HTMLAnchorElement).dataset.market }); } catch(_){}
    });
  `;
}
