from pathlib import Path
import cv2
import imageio.v2 as imageio
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/memories/hands-heart-indoor-v2.png"
OUTPUT = ROOT / "public/memories/hands-heart-indoor-v2.mp4"

image = cv2.imread(str(SOURCE))
image = cv2.resize(image, (720, 960), interpolation=cv2.INTER_AREA)
height, width = image.shape[:2]


def extract(rect):
    """用 GrabCut 分离一只手，并柔化边缘避免贴纸感。"""
    mask = np.zeros((height, width), np.uint8)
    bg_model = np.zeros((1, 65), np.float64)
    fg_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(image, mask, rect, bg_model, fg_model, 8, cv2.GC_INIT_WITH_RECT)
    alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (0, 0), 1.6)
    return alpha


# 两个矩形分别覆盖左右手和前臂，不包含对侧主体。
left_alpha = extract((0, int(height * .25), int(width * .56), int(height * .57)))
right_alpha = extract((int(width * .47), int(height * .21), int(width * .53), int(height * .58)))

# 去除中央误选区域，并限制各自半区，避免两只手粘成一个图层。
left_alpha[:, int(width * .59):] = 0
right_alpha[:, :int(width * .43)] = 0

combined = cv2.max(left_alpha, right_alpha)
background = cv2.inpaint(image, (combined > 16).astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA)


def translate(layer, alpha, dx, dy=0):
    matrix = np.float32([[1, 0, dx], [0, 1, dy]])
    moved_layer = cv2.warpAffine(layer, matrix, (width, height), flags=cv2.INTER_CUBIC,
                                 borderMode=cv2.BORDER_REFLECT)
    moved_alpha = cv2.warpAffine(alpha, matrix, (width, height), flags=cv2.INTER_LINEAR,
                                 borderMode=cv2.BORDER_CONSTANT)
    return moved_layer, moved_alpha.astype(np.float32) / 255


fps, seconds = 30, 4
frames = []
for frame_no in range(fps * seconds):
    t = frame_no / (fps * seconds - 1)
    # 0–3 秒连续靠近，3–4 秒完成爱心后自然停留。
    p = min(t / .75, 1.0)
    ease = 1 - (1 - p) ** 3
    gap = int((1 - ease) * width * .105)
    canvas = background.astype(np.float32)
    # 手部各自平移，不改变形状、大小或美甲。
    for layer, alpha, dx in ((image, left_alpha, -gap), (image, right_alpha, gap)):
        moved, a = translate(layer, alpha, dx)
        a = a[..., None]
        canvas = moved.astype(np.float32) * a + canvas * (1 - a)
    frames.append(cv2.cvtColor(np.clip(canvas, 0, 255).astype(np.uint8), cv2.COLOR_BGR2RGB))

imageio.mimsave(OUTPUT, frames, fps=fps, codec="libx264", quality=8,
                 pixelformat="yuv420p", macro_block_size=None)
print(OUTPUT)
