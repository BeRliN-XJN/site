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

- **背景音乐**：当前使用 `public/music/familiar-stranger.mp3`，用户点击启动页的“点击进入”后会自动播放。替换时保持文件名不变即可。
- **回忆视频**：当前照片区域使用 `public/memories/heart-hands.mp4`，设置为静音、自动、循环、内联播放，以兼容移动端浏览器。
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
