import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = "public/screenshots";
const GIF_FRAMES_DIR = "public/screenshots/frames";

async function ensureDirs() {
  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  if (!fs.existsSync(GIF_FRAMES_DIR)) fs.mkdirSync(GIF_FRAMES_DIR, { recursive: true });
}

async function waitForAnimations(page: Page) {
  await page.waitForTimeout(1500);
}

async function captureScreenshot(page: Page, name: string, fullPage = false) {
  const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage });
  console.log(`✓ Captured: ${name}.png`);
}

async function captureGifFrames(page: Page, name: string, actions: () => Promise<void>) {
  const frameDir = path.join(GIF_FRAMES_DIR, name);
  if (!fs.existsSync(frameDir)) fs.mkdirSync(frameDir, { recursive: true });

  let frameIndex = 0;
  const captureFrame = async () => {
    await page.screenshot({
      path: path.join(frameDir, `frame-${String(frameIndex++).padStart(4, "0")}.png`),
    });
  };

  await captureFrame();
  await actions();
  console.log(`✓ Captured GIF frames: ${name} (${frameIndex} frames)`);
}

async function main() {
  await ensureDirs();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    // ==================== 1. 홈페이지 ====================
    console.log("\n📸 홈페이지 캡처...");
    await page.goto(BASE_URL);
    await waitForAnimations(page);
    await captureScreenshot(page, "01-home");

    // ==================== 2. 컬렉션 페이지 (필터 적용) ====================
    console.log("\n📸 컬렉션 페이지 캡처...");
    await page.goto(`${BASE_URL}/collection?category=tops`);
    await waitForAnimations(page);
    await captureScreenshot(page, "02-collection-filtered");

    // ==================== 3. 제품 상세 페이지 ====================
    console.log("\n📸 제품 상세 페이지 캡처...");
    await page.goto(`${BASE_URL}/product/cashmere-cardigan-cream-camel-4`);
    await waitForAnimations(page);
    // 사이즈 선택
    await page.click('button:has-text("M")');
    await page.waitForTimeout(300);
    await captureScreenshot(page, "03-product-detail");

    // ==================== 4. 장바구니 추가 GIF ====================
    console.log("\n🎬 장바구니 추가 GIF 캡처...");
    await page.goto(`${BASE_URL}/product/silk-blouse-black-ivory-5`);
    await waitForAnimations(page);
    
    const addToCartFrameDir = path.join(GIF_FRAMES_DIR, "add-to-cart");
    if (!fs.existsSync(addToCartFrameDir)) fs.mkdirSync(addToCartFrameDir, { recursive: true });
    
    let frame = 0;
    const captureFrame = async () => {
      await page.screenshot({
        path: path.join(addToCartFrameDir, `frame-${String(frame++).padStart(4, "0")}.png`),
      });
    };

    await captureFrame(); // 초기 상태
    
    // 사이즈 버튼들 중 S 선택 (w-12 h-12 사이즈 버튼)
    const sizeButton = page.locator('button.w-12.h-12:has-text("S")').first();
    await sizeButton.click();
    await page.waitForTimeout(400);
    await captureFrame();
    
    // 장바구니 추가 클릭 (버튼 텍스트가 "Add to Cart"로 변경됨)
    const addToCartBtn = page.locator('button:has-text("Add to Cart")');
    await addToCartBtn.click();
    await page.waitForTimeout(500);
    await captureFrame();
    
    // 장바구니 사이드바가 열리는 것을 기다림
    await page.waitForTimeout(800);
    await captureFrame();
    await page.waitForTimeout(400);
    await captureFrame();
    
    console.log(`✓ Captured GIF frames: add-to-cart (${frame} frames)`);

    // ==================== 5. 장바구니 열린 상태 스크린샷 ====================
    await captureScreenshot(page, "04-cart-sidebar");

    // ==================== 6. 로그인 페이지 (폼 채운 상태) ====================
    console.log("\n📸 로그인 페이지 캡처...");
    await page.goto(`${BASE_URL}/login`);
    await waitForAnimations(page);
    
    // 폼 채우기
    await page.fill('input[type="email"]', "user@example.com");
    await page.fill('input[type="password"]', "mypassword123");
    await page.check('input[type="checkbox"]');
    await page.waitForTimeout(300);
    await captureScreenshot(page, "05-login-filled");

    // ==================== 7. 회원가입 페이지 ====================
    console.log("\n📸 회원가입 페이지 캡처...");
    await page.goto(`${BASE_URL}/signup`);
    await waitForAnimations(page);
    
    // FormInput은 label에서 id를 생성 (예: "First Name" → "first-name")
    await page.fill('#first-name', "John");
    await page.fill('#last-name', "Doe");
    await page.fill('#email-address', "john.doe@example.com");
    // password 필드 (첫번째는 일반 input, 두번째는 FormInput)
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill("SecurePass123!");
    await page.fill('#confirm-password', "SecurePass123!");
    // 체크박스 선택
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await page.waitForTimeout(300);
    await captureScreenshot(page, "06-signup-filled");

    // ==================== 8. 연락처 폼 (채운 상태) ====================
    console.log("\n📸 연락처 페이지 캡처...");
    await page.goto(`${BASE_URL}/contact`);
    await waitForAnimations(page);
    
    await page.fill('#name', "Jane Smith");
    await page.fill('#email', "jane@example.com");
    await page.selectOption('#subject', "general");
    await page.fill('#message', "I'm interested in your new collection. Could you please provide more information about the Cashmere Cardigan sizing and care instructions?");
    await page.waitForTimeout(300);
    await captureScreenshot(page, "07-contact-filled");

    // ==================== 9. 체크아웃 페이지 ====================
    console.log("\n📸 체크아웃 페이지 캡처...");
    // 먼저 제품을 장바구니에 추가 (slug: oversized-wool-coat-black-white-1)
    await page.goto(`${BASE_URL}/product/oversized-wool-coat-black-white-1`);
    await waitForAnimations(page);
    const sizeM = page.locator('button.w-12.h-12:has-text("M")').first();
    await sizeM.click();
    await page.waitForTimeout(300);
    const addBtn = page.locator('button:has-text("Add to Cart")');
    await addBtn.click();
    await page.waitForTimeout(1000);
    
    // 체크아웃으로 이동
    await page.goto(`${BASE_URL}/checkout`);
    await waitForAnimations(page);
    
    // 폼 채우기 (placeholder로 접근)
    await page.fill('input[placeholder="Email"]', "customer@example.com");
    await page.fill('input[placeholder="First Name"]', "Alex");
    await page.fill('input[placeholder="Last Name"]', "Johnson");
    await page.fill('input[placeholder="Address"]', "123 Fashion Street, Apt 4B");
    await page.fill('input[placeholder="City"]', "New York");
    await page.fill('input[placeholder="Postal Code"]', "10001");
    await page.selectOption('select[name="country"]', "United States");
    await page.fill('input[placeholder="Phone (optional)"]', "+1 (555) 123-4567");
    await page.waitForTimeout(300);
    await captureScreenshot(page, "08-checkout-filled");

    // ==================== 10. 퀵뷰 모달 ====================
    console.log("\n📸 퀵뷰 모달 캡처...");
    await page.goto(`${BASE_URL}/collection`);
    await waitForAnimations(page);
    
    // 제품 카드에 호버 후 퀵뷰 버튼 클릭 (group 클래스 사용)
    const productCard = page.locator('.group').first();
    await productCard.hover();
    await page.waitForTimeout(500);
    
    // Quick View 버튼 클릭 (Eye 아이콘 버튼)
    const quickViewBtn = page.locator('button[aria-label="Quick view"]').first();
    if (await quickViewBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await quickViewBtn.click();
      await page.waitForTimeout(800);
      await captureScreenshot(page, "09-quick-view-modal");
    } else {
      console.log("  (Quick View 버튼을 찾지 못해 스킵)");
    }

    // ==================== 11. 위시리스트 기능 GIF ====================
    console.log("\n🎬 위시리스트 GIF 캡처...");
    await page.goto(`${BASE_URL}/collection`);
    await waitForAnimations(page);
    
    const wishlistFrameDir = path.join(GIF_FRAMES_DIR, "wishlist");
    if (!fs.existsSync(wishlistFrameDir)) fs.mkdirSync(wishlistFrameDir, { recursive: true });
    
    frame = 0;
    const captureWishlistFrame = async () => {
      await page.screenshot({
        path: path.join(wishlistFrameDir, `frame-${String(frame++).padStart(4, "0")}.png`),
      });
    };

    await captureWishlistFrame();
    
    // 제품 카드에 호버
    const card = page.locator('.group').first();
    await card.hover();
    await page.waitForTimeout(500);
    await captureWishlistFrame();
    
    // 위시리스트 버튼 클릭 (heart 아이콘)
    const wishlistBtn = page.locator('button[aria-label*="wishlist"]').first();
    if (await wishlistBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await wishlistBtn.click();
      await page.waitForTimeout(500);
      await captureWishlistFrame();
      await page.waitForTimeout(300);
      await captureWishlistFrame();
      console.log(`✓ Captured GIF frames: wishlist (${frame} frames)`);
    } else {
      console.log("  (위시리스트 버튼을 찾지 못해 스킵)");
    }

    // ==================== 12. 룩북 페이지 ====================
    console.log("\n📸 룩북 페이지 캡처...");
    await page.goto(`${BASE_URL}/lookbook`);
    await waitForAnimations(page);
    await captureScreenshot(page, "10-lookbook");

    // ==================== 13. About 페이지 ====================
    console.log("\n📸 About 페이지 캡처...");
    await page.goto(`${BASE_URL}/about`);
    await waitForAnimations(page);
    await captureScreenshot(page, "11-about");

    // ==================== 14. FAQ 페이지 ====================
    console.log("\n📸 FAQ 페이지 캡처...");
    await page.goto(`${BASE_URL}/faq`);
    await waitForAnimations(page);
    // FAQ 아이템 하나 열기
    const faqItem = page.locator('button, [role="button"]').filter({ hasText: /shipping|order|return/i }).first();
    if (await faqItem.isVisible()) {
      await faqItem.click();
      await page.waitForTimeout(400);
    }
    await captureScreenshot(page, "12-faq");

    // ==================== 15. 검색 모달 GIF ====================
    console.log("\n🎬 검색 모달 GIF 캡처...");
    await page.goto(BASE_URL);
    await waitForAnimations(page);
    
    const searchFrameDir = path.join(GIF_FRAMES_DIR, "search");
    if (!fs.existsSync(searchFrameDir)) fs.mkdirSync(searchFrameDir, { recursive: true });
    
    frame = 0;
    const captureSearchFrame = async () => {
      await page.screenshot({
        path: path.join(searchFrameDir, `frame-${String(frame++).padStart(4, "0")}.png`),
      });
    };

    await captureSearchFrame();
    
    // 검색 버튼 클릭
    const searchBtn = page.locator('button[aria-label="Open search"]');
    if (await searchBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchBtn.click();
      await page.waitForTimeout(600);
      await captureSearchFrame();
      
      // 검색어 입력
      const searchInput = page.locator('input').first();
      if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await searchInput.fill("silk");
        await page.waitForTimeout(800);
        await captureSearchFrame();
        await page.waitForTimeout(400);
        await captureSearchFrame();
      }
      console.log(`✓ Captured GIF frames: search (${frame} frames)`);
    } else {
      console.log("  (검색 버튼을 찾지 못해 스킵)");
    }

    console.log("\n✅ 모든 스크린샷 캡처 완료!");
    console.log(`📁 스크린샷 위치: ${SCREENSHOT_DIR}`);
    console.log(`📁 GIF 프레임 위치: ${GIF_FRAMES_DIR}`);
    console.log("\n💡 GIF 생성 명령어:");
    console.log("   ffmpeg -framerate 2 -i frames/add-to-cart/frame-%04d.png -vf 'scale=720:-1' add-to-cart.gif");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

main();
