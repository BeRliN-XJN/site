# 玲儿专属

移动端优先的纯静态恋爱惊喜网站，无后端、无数据库依赖。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 替换素材

- **背景音乐**：在 `public/music/` 目录放入 `replace-with-your-song.mp3`。推荐 MP3（128–192 kbps，兼容性最好）；也可将 `app/page.tsx` 中 `<audio>` 的 `src` 换为同源 HTTPS 音乐直链。建议控制在 3–5 MB，并确保你拥有使用权。
- **照片**：搜索 `照片占位区`，将该占位块替换成 `<img src="/你的照片.webp" alt="合照描述" />`，图片建议转为 WebP/AVIF，并放入 `public/`。
- **角色图片**：三张正式形象位于 `public/characters/`。保持文件名不变即可随时用更高清版本覆盖；动画会自动继续生效。
- **爱的文案**：搜索 `文案占位符` 后直接修改。结尾数字可搜索 `数字占位符` 修改两处。
- **提问时间**：修改 `app/page.tsx` 顶部的 `questions` 数组即可增加、删除或调整顺序。
- **主题颜色**：在 `app/globals.css` 顶部 `:root` 中修改桃粉、奶油和深夜色。

## 部署到 Cloudflare

### Cloudflare Pages（静态资源方式）

1. 将项目推送到 GitHub。
2. 在 Cloudflare 控制台进入 Workers & Pages，新建 Pages 项目并连接仓库。
3. 构建命令填 `npm run build`，输出目录按构建日志中的静态资源目录设置。
4. 部署完成后绑定自定义域名即可。

本项目也包含 `.openai/hosting.json`，可由 Codex Sites 直接发布为 Cloudflare 兼容站点。

## 浏览器兼容

支持 iOS Safari 14+ 与 Android Chrome 90+。音乐严格在点击启动页后播放，以符合移动浏览器的自动播放限制；动画支持系统“减少动态效果”设置。
