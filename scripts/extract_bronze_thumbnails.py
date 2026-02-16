#!/usr/bin/env python3
"""
스프라이트 시트에서 미션 결과 프레임을 추출하여 썸네일로 저장합니다.
- 이미지 크기와 무관하게 세로 15등분 × 가로 4등분 그리드로 분할
- fail, bronze, silver, gold 4종 × 15미션 = 60개
- {id}.webp = bronze (기본/미션선택용), {id}_fail.webp, {id}_silver.webp, {id}_gold.webp
"""
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow가 필요합니다: pip install Pillow")
    exit(1)

# 경로 설정
ROOT = Path(__file__).resolve().parent.parent
SPRITE_PATH = ROOT / "public" / "mission_results_sprite.webp"
OUTPUT_DIR = ROOT / "public" / "mission_thumbnails"

# 그리드 분할: 세로 15등분(미션 1~15), 가로 4등분(fail, bronze, silver, gold)
GRID_ROWS = 15
GRID_COLS = 4

RESULT_SUFFIXES = ["fail", "bronze", "silver", "gold"]


def main():
    if not SPRITE_PATH.exists():
        # src/data에 있으면 복사 후 사용
        alt = ROOT / "src" / "data" / "mission_results_sprite.webp"
        if alt.exists():
            import shutil
            SPRITE_PATH.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(alt, SPRITE_PATH)
            print(f"스프라이트를 public으로 복사했습니다.")
        else:
            print(f"스프라이트를 찾을 수 없습니다: {SPRITE_PATH}")
            exit(1)

    img = Image.open(SPRITE_PATH).convert("RGBA")
    img_w, img_h = img.size

    # 셀 크기: 이미지 크기에 맞춰 균등 분할
    cell_w = img_w / GRID_COLS
    cell_h = img_h / GRID_ROWS

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for mission_id in range(1, 16):
        row = mission_id - 1
        for col, suffix in enumerate(RESULT_SUFFIXES):
            x1 = int(col * cell_w)
            y1 = int(row * cell_h)
            x2 = int((col + 1) * cell_w)
            y2 = int((row + 1) * cell_h)
            crop = img.crop((x1, y1, x2, y2))

            filename = f"{mission_id}.webp" if suffix == "bronze" else f"{mission_id}_{suffix}.webp"
            out_path = OUTPUT_DIR / filename
            crop.save(out_path, "WEBP", quality=85)
        print(f"저장: 미션 {mission_id} (fail, bronze, silver, gold)")

    print(f"\n완료: {OUTPUT_DIR}에 60개 썸네일 생성 (이미지 {img_w}×{img_h} → {GRID_COLS}×{GRID_ROWS} 그리드)")


if __name__ == "__main__":
    main()
