import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('textBoxWidth - e2e', () => {
  let driver;

  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should set textBoxWidth(manual)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      calculateTextBoxWidthMode: GALLERY_CONSTS.textBoxWidthCalculationOptions.MANUAL,
      textBoxWidth: 150,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set textBoxWidth(percent)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      calculateTextBoxWidthMode: GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
      textBoxWidthPercent: 30,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
