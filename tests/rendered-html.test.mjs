import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("Cloudflare Pages 构建包含首页入口", async () => {
  const html = await readFile(new URL("dist/index.html", root), "utf8");

  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /<title>玲儿专属｜把喜欢写进每一个明天<\/title>/);
  assert.match(html, /<script[^>]+type="module"/);
  assert.match(html, /\/assets\/[^"']+\.js/);
});

test("Cloudflare Pages 构建包含主要媒体资源", async () => {
  await Promise.all([
    access(new URL("dist/music/familiar-stranger.mp3", root)),
    access(new URL("dist/memories/heart-hands.mp4", root)),
    access(new URL("dist/choices/love.mp4", root)),
    access(new URL("dist/choices/emm.mp4", root)),
    access(new URL("dist/_redirects", root)),
    access(new URL("dist/_headers", root)),
  ]);
});
