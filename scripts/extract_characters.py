from pathlib import Path
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1] / "public" / "characters"


def refine_alpha(alpha: np.ndarray) -> np.ndarray:
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.8)
    return alpha


def remove_dark_background(source: str, output: str, threshold: int = 58):
    image = cv2.imread(str(ROOT / source), cv2.IMREAD_COLOR)
    image = cv2.resize(image, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)
    brightness = np.max(image, axis=2)
    alpha = np.clip((brightness.astype(np.float32) - threshold) / 34 * 255, 0, 255).astype(np.uint8)
    alpha = refine_alpha(alpha)
    rgba = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(str(ROOT / output), rgba)


def remove_capy_background():
    image = cv2.imread(str(ROOT / "capybara-lulu.png"), cv2.IMREAD_COLOR)
    image = cv2.resize(image, None, fx=5, fy=5, interpolation=cv2.INTER_CUBIC)
    h, w = image.shape[:2]
    mask = np.full((h, w), cv2.GC_PR_BGD, np.uint8)

    # 水豚主体位于画面中央偏下；边缘和上半部确定为背景。
    mask[:int(h * .23), :] = cv2.GC_BGD
    mask[:, :int(w * .08)] = cv2.GC_BGD
    mask[:, int(w * .94):] = cv2.GC_BGD
    mask[int(h * .91):, :] = cv2.GC_BGD
    cv2.ellipse(mask, (int(w * .52), int(h * .60)),
                (int(w * .31), int(h * .34)), 0, 0, 360, cv2.GC_FGD, -1)
    # 手臂和耳朵区域标记为可能前景，交给 GrabCut 细化。
    cv2.ellipse(mask, (int(w * .72), int(h * .59)),
                (int(w * .15), int(h * .12)), -15, 0, 360, cv2.GC_PR_FGD, -1)
    bg = np.zeros((1, 65), np.float64)
    fg = np.zeros((1, 65), np.float64)
    cv2.grabCut(image, mask, None, bg, fg, 8, cv2.GC_INIT_WITH_MASK)
    alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    alpha = refine_alpha(alpha)
    rgba = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(str(ROOT / "capybara-lulu-transparent.png"), rgba)


remove_capy_background()
remove_dark_background("sprout-mochi.png", "sprout-mochi-transparent.png", 42)
remove_dark_background("cc-cat.png", "cc-cat-transparent.png", 36)
print("transparent character assets created")
