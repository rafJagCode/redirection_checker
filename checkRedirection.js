import puppeteer from "puppeteer";

export const checkRedirection = async (link) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);

  await page.goto(link);

  const redirectedTo = page.url();

  await browser.close();

  return redirectedTo;
};
