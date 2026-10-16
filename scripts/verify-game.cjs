/* Run with Playwright available in NODE_PATH and a local server at BASE_URL. */
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const out=process.env.REVIEW_DIR||'/tmp/batalha-review';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
 const errors=[],missing=[],checks=[];
 const context=await browser.newContext({viewport:{width:1366,height:900}});
 function watch(page){page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))missing.push(r.url());});}
 async function snap(page,name){await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${out}/${name}.png`,fullPage:true});}
 async function fits(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');}
 async function images(page){await page.waitForFunction(()=>[...document.images].filter(i=>i.getBoundingClientRect().width>0).every(i=>i.complete&&i.naturalWidth>0));}
 async function startLocal(page){await page.locator('#start').click();await page.locator('#passGo').click();}
 async function targetReady(page){await page.waitForSelector('#battle:not([hidden]) .target:not(.locked)');}
 const desktop=await context.newPage();watch(desktop);await desktop.goto(base);await images(desktop);await fits(desktop);await snap(desktop,'desktop-menu');assert.equal(await desktop.locator('#n1').inputValue(),'Capitão Bryan');assert.equal(await desktop.locator('#n2').inputValue(),'Capitão Albert');assert.equal(await desktop.locator('#myName').inputValue(),'Capitão Bryan');checks.push('Desktop menu, assets and Bryan/Albert defaults');
 await startLocal(desktop);assert.equal(await desktop.locator('#placeTitle').textContent(),'Capitão Bryan, posicione sua frota');await desktop.locator('#random').click();assert.equal(await desktop.locator('#place .ship').count(),5);await images(desktop);await snap(desktop,'desktop-placement');
 await desktop.locator('#clear').click();assert.equal(await desktop.locator('#place .ship').count(),0);await desktop.locator('#rotate').click();await desktop.locator('#place .cell[data-r="0"][data-c="0"]').click();assert.equal(await desktop.locator('#place .ship.v').count(),1);checks.push('Randomize, clear and rotate fleet');
 const mobile=await context.newPage();watch(mobile);await mobile.setViewportSize({width:390,height:844});await mobile.goto(base);await images(mobile);await fits(mobile);await snap(mobile,'mobile-menu');
 await mobile.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await mobile.locator('.hero .galleon').evaluate(e=>getComputedStyle(e).animationName),'none');
 await startLocal(mobile);await mobile.locator('#random').click();await images(mobile);await fits(mobile);await snap(mobile,'mobile-placement');await mobile.locator('#ready').click();await mobile.locator('#passGo').click();
 for(let r=0;r<5;r++)await mobile.locator(`#place .cell[data-r="${r}"][data-c="0"]`).click();
 assert.equal(await mobile.locator('#place .ship').count(),5);await mobile.locator('#ready').click();await mobile.locator('#passGo').click();await targetReady(mobile);await fits(mobile);await images(mobile);await snap(mobile,'mobile-battle');
 for(const [r,len] of [[0,5],[1,4],[2,3],[3,3],[4,2]]){
  for(let c=0;c<len;c++){
   await targetReady(mobile);await mobile.locator(`#targetBoard .cell[data-r="${r}"][data-c="${c}"]`).click();
  }
 }
 await mobile.locator('#win:not([hidden])').waitFor();await images(mobile);assert.equal(await mobile.locator('#targetBoard .ship.wreck').count(),5);await fits(mobile);await snap(mobile,'mobile-victory');checks.push('Complete local battle, 17 hits, five sinkings and victory with reduced motion');
 await mobile.locator('#again').click();assert(await mobile.locator('#menu').isVisible());
 // Normal-motion miss and handover, independent from victory flow.
 await startLocal(mobile);await mobile.locator('#random').click();await mobile.locator('#ready').click();await mobile.locator('#passGo').click();
 for(let r=0;r<5;r++)await mobile.locator(`#place .cell[data-r="${r}"][data-c="0"]`).click();
 await mobile.locator('#ready').click();await mobile.locator('#passGo').click();await mobile.emulateMedia({reducedMotion:'no-preference'});
 await targetReady(mobile);await mobile.locator('#targetBoard .cell[data-r="9"][data-c="9"]').click();await mobile.waitForTimeout(580);await snap(mobile,'mobile-splash');await mobile.locator('#pass:not([hidden])').waitFor();await mobile.locator('#passGo').click();assert.match(await mobile.locator('#turn').textContent(),/Capitão Albert/);checks.push('Normal-motion splash and local handover');
 // BroadcastChannel test transport: exercises the real two-player handlers.
 const host=await context.newPage(),guest=await context.newPage();watch(host);watch(guest);
 await host.goto(base+'/#teste');await guest.goto(base+'/#teste');await host.locator('#modeOnline').click();await guest.locator('#modeOnline').click();await host.locator('#myName').fill('Anne');await guest.locator('#myName').fill('Jack');await host.locator('#createRoom').click();const code=await host.locator('#roomCode').textContent();await guest.locator('#joinCode').fill(code);await guest.locator('#joinRoom').click();
 await host.locator('#place:not([hidden])').waitFor();await guest.locator('#place:not([hidden])').waitFor();
 for(let r=0;r<5;r++)await host.locator(`#place .cell[data-r="${r}"][data-c="0"]`).click();
 for(let r=0;r<5;r++)await guest.locator(`#place .cell[data-r="${r}"][data-c="0"]`).click();
 await host.locator('#ready').click();await guest.locator('#ready').click();await targetReady(host);await guest.locator('#battle:not([hidden])').waitFor();assert(await guest.locator('.target.locked').count());assert.equal(await host.locator('#targetBoard .ship').count(),0);assert.equal(await guest.locator('#targetBoard .ship').count(),0);await images(host);await snap(host,'desktop-battle');
 for(let c=0;c<5;c++){
  await targetReady(host);await host.locator(`#targetBoard .cell[data-r="0"][data-c="${c}"]`).click();
  if(c===0){await host.waitForTimeout(590);await snap(host,'desktop-impact');}
 }
 await targetReady(host);await guest.waitForFunction(()=>document.querySelectorAll('#ownBoard .ship.wreck').length===1);assert.equal(await host.locator('#targetBoard .ship.wreck').count(),1);assert.equal(await host.locator('#targetBoard .cell.sunk').count(),5);await snap(host,'desktop-sunk');
 await host.locator('#targetBoard .cell[data-r="9"][data-c="9"]').click();await targetReady(guest);await guest.locator('#targetBoard .cell[data-r="9"][data-c="9"]').click();await guest.waitForFunction(()=>document.querySelector('#targetBoard .cell[data-r="9"][data-c="9"]').classList.contains('miss'));await host.waitForFunction(()=>document.querySelector('#ownBoard .cell[data-r="9"][data-c="9"]').classList.contains('miss'));checks.push('Two-tab room, hidden fleets, synchronized hits, sinking and return shot');
 await guest.close();await host.locator('#pass:not([hidden])').waitFor();assert.match(await host.locator('#passTitle').textContent(),/nevoeiro/);checks.push('Disconnect overlay');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);checks.push('No page errors or missing local resources');
 const result={checks,errors,missing,screenshots:out};fs.writeFileSync(out+'/verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
