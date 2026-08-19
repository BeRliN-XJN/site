# 玲儿专属（Cloudflare Pages 静态版）

移动端优先的恋爱惊喜网站。网站是纯静态 Vite + React 项目，不依赖服务器、数据库或 Cloudflare Worker。

## 本地运行

```bash
npm install
npm run dev
```

本地地址默认为 `http://localhost:3000/`。

## 构建检查

```bash
npm run build
```

构建完成后，Cloudflare Pages 所需的首页入口位于 `dist/index.html`。

## Cloudflare Pages 部署设置

将项目推送到 GitHub 后，在 Cloudflare Pages 中连接该仓库并填写：

- 框架预设：`Vite`
- 构建命令：`npm run build`
- 构建输出目录：`dist`
- 根目录：`/`（如果仓库根目录就是本项目）
- Node.js 版本：`22`

保存后重新部署即可。不要填写 `dist/client`，也不要使用 Wrangler 部署命令。

## 替换素材

- 背景音乐：`public/music/familiar-stranger.mp3`
- 回忆视频：`public/memories/heart-hands.mp4`
- “爱！”分支视频：`public/choices/love.mp4`
- “emm...”分支视频：`public/choices/emm.mp4`
- 角色图片：`public/characters/`
- 页面文案与问答：`app/page.tsx`
- 页面样式：`app/globals.css`

`public/` 中的文件会在构建时自动原样复制到 `dist/`。
