import {expect,test} from "@playwright/test";

const widths=[320,390,768,1024,1280,1440];
const routes=["/","/about","/faq","/support","/terms","/privacy"];

test.describe("Fixa public layout — six viewport release gate",()=>{
  for(const width of widths){
    test("content, navigation, footer and overflow at "+width+"px",async({page})=>{
      await page.setViewportSize({width,height:900});
      const errors:string[]=[];
      page.on("pageerror",e=>errors.push(e.message));
      for(const route of routes){
        await page.goto(route,{waitUntil:"networkidle"});
        await page.evaluate(()=>document.fonts.ready);
        await expect(page.locator("main#main-content")).toBeVisible();
        await expect(page.locator(".fixa-public-header .fixa-wordmark")).toBeVisible();
        await expect(page.locator("footer.fixa-public-footer")).toBeVisible();
        const report=await page.evaluate(()=>{
          const root=document.documentElement;
          const header=document.querySelector(".fixa-public-header");
          const brand=header?.querySelector(".fixa-wordmark");
          const signIn=header?.querySelector(".fixa-header-signin");
          const center=header?.querySelector(".fixa-header-desktop");
          const box=(v:Element|null|undefined)=>v?.getBoundingClientRect();
          const b=box(brand),s=box(signIn),n=box(center);
          return {scroll:root.scrollWidth,viewport:innerWidth,brandRight:b?.right||0,signInLeft:s?.left||0,navLeft:n?.left||0,navRight:n?.right||0,navVisible:!!(n&&center&&getComputedStyle(center).display!=="none")};
        });
        expect(report.scroll,"Horizontal overflow at "+route+" on "+width).toBeLessThanOrEqual(report.viewport+2);
        expect(report.brandRight+8,"Brand and sign-in overlap at "+route).toBeLessThan(report.signInLeft);
        if(report.navVisible){
          expect(report.brandRight+12,"Brand and navigation overlap").toBeLessThan(report.navLeft);
          expect(report.navRight+12,"Navigation and sign-in overlap").toBeLessThan(report.signInLeft);
        }
        if(["/terms","/privacy","/faq"].includes(route)){
          const c=await page.locator(".fixa-info-content").boundingBox();
          expect(c).not.toBeNull();
          const right=width-(c!.x+c!.width);
          expect(Math.abs(c!.x-right),"Reading column not centered at "+route+" / "+width).toBeLessThan(18);
        }
        const label=route==="/"? "home":route.slice(1);
        await page.screenshot({path:"artifacts/public-qa/"+label+"-"+width+".png",fullPage:true,animations:"disabled"});
      }
      expect(errors).toEqual([]);
    });
  }

  for(const width of [320,390,768,1024]){
    test("compact navigation opens and routes correctly at "+width+"px",async({page})=>{
      await page.setViewportSize({width,height:850});
      await page.goto("/");
      const toggle=page.locator(".fixa-menu-toggle");
      await expect(toggle).toBeVisible();
      await toggle.click();
      const panel=page.locator(".fixa-menu-popover");
      await expect(panel).toBeVisible();
      await panel.getByRole("link",{name:"Explore the workspace"}).click();
      await expect(page).toHaveURL(/\/demo$/);
    });
  }

  test("desktop nav stays centered and accessible",async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto("/about");
    const nav=page.locator(".fixa-header-desktop");
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link",{name:"FAQ"})).toBeVisible();
    await nav.getByRole("link",{name:"FAQ"}).click();
    await expect(page).toHaveURL(/\/faq$/);
  });

  test("FAQ opens only one answer at a time",async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await page.goto("/faq");
    const items=page.locator("details.fixa-faq-item");
    await expect(items).toHaveCount(12);
    await items.nth(0).locator("summary").click();
    await expect(items.nth(0)).toHaveAttribute("open","");
    await items.nth(1).locator("summary").click();
    await expect(items.nth(0)).not.toHaveAttribute("open","");
    await expect(items.nth(1)).toHaveAttribute("open","");
    await items.nth(1).locator("summary").click();
    await expect(items.nth(1)).not.toHaveAttribute("open","");
  });
});
