import * as fs from "fs";
import * as path from "path";
import GIFEncoder from "gif-encoder-2";
import sharp from "sharp";

const FRAMES_DIR = "public/screenshots/frames";
const OUTPUT_DIR = "public/screenshots";

async function createGif(folderName: string, delay: number = 800, scale: number = 0.5) {
  const frameDir = path.join(FRAMES_DIR, folderName);
  const outputPath = path.join(OUTPUT_DIR, `${folderName}.gif`);

  if (!fs.existsSync(frameDir)) {
    console.log(`⚠️  폴더가 없습니다: ${frameDir}`);
    return;
  }

  const files = fs
    .readdirSync(frameDir)
    .filter((f) => f.endsWith(".png"))
    .sort();

  if (files.length === 0) {
    console.log(`⚠️  프레임이 없습니다: ${folderName}`);
    return;
  }

  console.log(`🎬 ${folderName} GIF 생성 중... (${files.length} 프레임)`);

  // 첫 번째 프레임으로 크기 결정
  const firstFramePath = path.join(frameDir, files[0]);
  const firstImage = sharp(firstFramePath);
  const metadata = await firstImage.metadata();

  const width = Math.floor((metadata.width || 1440) * scale);
  const height = Math.floor((metadata.height || 900) * scale);

  // GIF 인코더 생성
  const encoder = new GIFEncoder(width, height, "neuquant", true);

  encoder.setDelay(delay);
  encoder.setQuality(10);
  encoder.setRepeat(0); // 무한 반복

  const output = fs.createWriteStream(outputPath);
  encoder.createReadStream().pipe(output);

  encoder.start();

  for (const file of files) {
    const framePath = path.join(frameDir, file);

    // 이미지 리사이즈 및 raw 픽셀 데이터 추출
    const { data, info } = await sharp(framePath)
      .resize(width, height)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // RGBA 형식으로 프레임 추가
    encoder.addFrame(data as unknown as CanvasRenderingContext2D);
  }

  encoder.finish();

  // 스트림이 완료될 때까지 대기
  await new Promise<void>((resolve) => output.on("finish", resolve));

  console.log(`✓ ${folderName}.gif 생성 완료 (${width}x${height})`);
}

async function main() {
  console.log("\n🎥 GIF 생성 시작\n");

  // 각 폴더별로 GIF 생성
  await createGif("add-to-cart", 600, 0.5);
  await createGif("wishlist", 500, 0.5);
  await createGif("search", 700, 0.5);

  console.log("\n✅ 모든 GIF 생성 완료!");
  console.log(`📁 GIF 위치: ${OUTPUT_DIR}`);
}

main().catch(console.error);
