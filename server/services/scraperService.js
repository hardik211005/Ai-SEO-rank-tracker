import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
});

export async function scrapeUrl(url){
    let browser;
    try{
        const session = await bb.sessions.create({ browserSettings: { blockAds: true } });
            browser = await chromium.connectOverCDP(session.connectUrl);
            const defaultContext = browser.contexts()[0];
            const page = defaultContext.pages()[0];
            page.setDefaultNavigationTimeout(30000);

            const startTime = Date.now()
            let response;
            try {
                response = await page.goto(url, {waitUntil: "domcontentloaded"})
            } catch (navError) {
                await browser.close().catch(()=> {});
                browser = null;
                return {success: false, error: navError.message}
            }
            const loadTime = Date.now() - startTime;
            await page.waitForTimeout(2000);
    } catch (error) {

    }
}