import { chromium } from 'playwright';
// import { analyzeCodeChanges } from './code-analyzer';

export async function captureComponentScreenshot(componentName: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Point to your development server
  await page.goto('http://localhost:3000');

  const screenshotPath = `public/screenshots/${componentName}-${Date.now()}.png`;

  try {
    await page.locator(`[data-testid="${componentName}"]`).screenshot({
      path: screenshotPath
    });
    return screenshotPath;
  } catch {
    return null;
  } finally {
    await browser.close();
  }
}