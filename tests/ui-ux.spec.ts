import { expect, test, type Locator, type Page } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const expectedInstallerPath = '/downloads/HertPicture_0.1.0_x64-setup.exe';

function primaryHeroDownload(page: Page) {
  return page.getByRole('link', { name: /download apps/i });
}

function primaryInstallerDownload(page: Page) {
  return page.getByRole('link', { name: /download \.exe/i });
}

async function expectAboveTheFold(locator: Locator, viewportHeight: number) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();

  expect(box, 'element should have a measurable box').not.toBeNull();
  expect(box!.y, 'element should start above the viewport fold').toBeLessThan(viewportHeight);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const documentWidth = document.documentElement.scrollWidth;
    const viewportWidth = document.documentElement.clientWidth;
    const bodyWidth = document.body.scrollWidth;

    return Math.max(documentWidth, bodyWidth) - viewportWidth;
  });

  expect(overflow, 'page should not create horizontal overflow').toBeLessThanOrEqual(1);
}

async function expectHeaderDoesNotOverlapMainContent(page: Page) {
  const isClear = await page.evaluate(() => {
    const header = document.querySelector('header');
    const heading = document.querySelector('h1');

    if (!header || !heading) {
      return false;
    }

    const headerBox = header.getBoundingClientRect();
    const headingBox = heading.getBoundingClientRect();

    return headerBox.bottom <= headingBox.top;
  });

  expect(isClear, 'sticky header should not overlap the hero heading').toBe(true);
}

test.describe('download CTA', () => {
  for (const viewport of [viewports[0], viewports[2]]) {
    test(`is visible above the fold and points to the installer on ${viewport.name}`, async ({ page, request }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      await expectAboveTheFold(primaryHeroDownload(page), viewport.height);

      await primaryHeroDownload(page).click();
      await expect(page).toHaveURL(/#download$/);

      const installerLink = primaryInstallerDownload(page);
      await expect(installerLink).toBeVisible();
      await expect(installerLink).toHaveAttribute('href', expectedInstallerPath);

      const href = await installerLink.getAttribute('href');
      expect(href, 'installer href should be a relative browser path').toMatch(/^\/downloads\/[^/]+\.exe$/);

      const response = await request.get(expectedInstallerPath);
      expect(response.ok(), `${expectedInstallerPath} should be served by Vite preview`).toBe(true);
    });
  }
});

test.describe('responsive layout', () => {
  for (const viewport of viewports) {
    test(`renders cleanly at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      await expectNoHorizontalOverflow(page);
      await expectAboveTheFold(primaryHeroDownload(page), viewport.height);
      await expectHeaderDoesNotOverlapMainContent(page);

      const screenshots = page.getByRole('img', { name: /application screenshot/i });
      await expect(screenshots.first()).toBeVisible();
      await expect(screenshots).toHaveCount(2);
    });
  }
});

test.describe('navigation anchors', () => {
  const anchors = [
    { label: 'Features', hash: '#features', heading: /focused windows app/i },
    { label: 'Preview', hash: '#preview', heading: /preview hertpicture/i },
    { label: 'Security', hash: '#security', heading: /security notes/i },
    { label: 'Downloads', hash: '#download', heading: /get the latest windows release/i },
  ];

  for (const anchor of anchors) {
    test(`navigates to ${anchor.hash}`, async ({ page }) => {
      await page.setViewportSize(viewports[2]);
      await page.goto('/');

      await page.getByRole('link', { name: anchor.label }).first().click();
      await expect(page).toHaveURL(new RegExp(`${anchor.hash}$`));
      await expect(page.getByRole('heading', { name: anchor.heading })).toBeVisible();
    });
  }
});

test.describe('local editor visibility', () => {
  test('shows the localhost-only toolbar on localhost', async ({ page }) => {
    await page.goto('http://localhost:4173/');

    await expect(page.getByRole('button', { name: /inline edit/i })).toBeVisible();
    await expect(page.getByText(/localhost only/i)).toBeVisible();
  });

  test('hides the toolbar on a production-like hostname', async ({ page }) => {
    await page.goto('http://distribution.test:4173/');

    await expect(page.getByRole('button', { name: /inline edit/i })).toHaveCount(0);
    await expect(page.getByText(/localhost only/i)).toHaveCount(0);
  });
});

test('keyboard users can reach navigation and download controls without a trap', async ({ page }) => {
  await page.setViewportSize(viewports[2]);
  await page.goto('/');

  const seenLabels = new Set<string>();

  for (let index = 0; index < 18; index += 1) {
    await page.keyboard.press('Tab');

    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();

    const label = await focused.evaluate((element) => {
      return element.getAttribute('aria-label') || element.textContent?.replace(/\s+/g, ' ').trim() || '';
    });

    if (label) {
      seenLabels.add(label);
    }
  }

  expect([...seenLabels].some((label) => /features/i.test(label)), 'tab order should include nav links').toBe(true);
  expect([...seenLabels].some((label) => /downloads/i.test(label)), 'tab order should include the header download CTA').toBe(true);
  expect([...seenLabels].some((label) => /download apps/i.test(label)), 'tab order should include the hero download CTA').toBe(
    true,
  );
});

test.describe('visual regression screenshots', () => {
  for (const viewport of [viewports[0], viewports[2]]) {
    test(`matches the ${viewport.name} landing page snapshot`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      await expect(page).toHaveScreenshot(`landing-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
