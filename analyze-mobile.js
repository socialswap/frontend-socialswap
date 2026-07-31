const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('lighthouse.json', 'utf8'));
  const audits = data.audits;
  
  console.log("=== MOBILE SCORE ===");
  if (data.categories && data.categories.performance) {
    console.log("Performance Score:", Math.round(data.categories.performance.score * 100));
  }
  
  console.log("\n=== CORE METRICS ===");
  if(audits['first-contentful-paint']) console.log("FCP:", audits['first-contentful-paint'].displayValue);
  if(audits['largest-contentful-paint']) console.log("LCP:", audits['largest-contentful-paint'].displayValue);
  if(audits['total-blocking-time']) console.log("TBT:", audits['total-blocking-time'].displayValue);
  if(audits['cumulative-layout-shift']) console.log("CLS:", audits['cumulative-layout-shift'].displayValue);
  if(audits['speed-index']) console.log("SI:", audits['speed-index'].displayValue);

  console.log("\n=== OPPORTUNITIES ===");
  const opportunities = [
    'render-blocking-resources',
    'unminified-javascript',
    'unminified-css',
    'unused-javascript',
    'unused-css-rules',
    'offscreen-images',
    'uses-webp-images',
    'uses-optimized-images',
    'uses-text-compression',
    'server-response-time',
    'mainthread-work-breakdown',
    'bootup-time'
  ];
  
  opportunities.forEach(id => {
    if (audits[id]) {
      let savings = '';
      if (audits[id].details && audits[id].details.overallSavingsMs > 0) savings += `${audits[id].details.overallSavingsMs} ms`;
      else if (audits[id].details && audits[id].details.overallSavingsBytes > 0) savings += `${audits[id].details.overallSavingsBytes / 1024} KB`;
      else if (audits[id].displayValue) savings += audits[id].displayValue;
      if (savings) console.log(`${audits[id].title}: ${savings}`);
    }
  });

  console.log("\n=== LCP ELEMENT ===");
  if (audits['largest-contentful-paint-element'] && audits['largest-contentful-paint-element'].details && audits['largest-contentful-paint-element'].details.items[0]) {
    const lcpItem = audits['largest-contentful-paint-element'].details.items[0];
    console.log("Node:", lcpItem.node.snippet);
  }

  console.log("\n=== BOOTUP TIME DETAILS ===");
  if (audits['bootup-time'] && audits['bootup-time'].details) {
    const items = audits['bootup-time'].details.items;
    items.slice(0, 5).forEach(item => {
      console.log(`${item.url}: Total=${item.total.toFixed(1)}ms, Scripting=${item.scripting.toFixed(1)}ms`);
    });
  }
} catch(e) {
  console.error(e);
}
