# Raid Timeline Player

「Raid Timeline Player」是一個 FF14 粉絲向戰鬥排軸視覺化播放器。它模擬歌詞播放器式的時間軸體驗，讓玩家可以依戰鬥時間查看目前 mechanic、下一個提示、職業相關行動與團隊減傷安排。

本專案不使用任何官方素材、商標、技能圖示或副本資料。Demo encounter 與所有事件內容皆為原創假資料。

## 安裝方式

```bash
npm install
```

## 啟動方式

```bash
npm run dev
```

建置正式版本：

```bash
npm run build
```

## V1 功能

- Play / Pause / Restart 播放控制
- 可拖曳時間進度條並跳轉戰鬥時間
- 顯示目前時間與總長度
- 倍速切換：0.5x / 1x / 1.5x / 2x
- 提示提前秒數：0 / 1 / 3 / 5 / 10 秒
- Now 區顯示目前事件與下一個 upcoming 事件
- 主時間軸支援 active、upcoming、past 狀態
- 點擊任一事件可跳到該時間
- Job filter：ALL 與所有指定職業縮寫
- 分離式面板：Boss Timeline / My Job Actions / Party Mitigation / Notes
- 本地 mock data：MVP Demo Encounter，總長度 360 秒，31 筆原創事件

## V2 功能：YouTube 影片同步排軸

### YouTube Sync Mode

- 貼上 YouTube 影片網址，使用 YouTube IFrame Player API 官方嵌入播放
- 支援格式：youtube.com/watch?v=、youtu.be/、youtube.com/embed/、帶 &t= 的網址
- 排軸時間 = 影片目前時間 - 戰鬥起點 (videoStartTime)
- 影片播放器與排軸完全同步：播放、暫停、跳轉皆連動

### 設定戰鬥起點 (Pull Start)

- 輸入秒數 (222) 或時間格式 (03:42, 01:03:42) 設定 videoStartTime
- 可一鍵將目前影片播放時間設為戰鬥起點
- 即時顯示：Video time / Pull start / Timeline time

### 分享連結 (Share Link)

- 使用 URL query params 保存 videoId、videoStartTime、selectedJob、leadTimeOffset
- 按「Copy share link」複製目前設定連結
- 頁面載入時自動讀取 query params 還原設定

### Fallback：外部開啟模式

- 如嵌入被阻擋，顯示「Open video on YouTube」按鈕在新分頁開啟原影片
- 使用者仍可使用 Manual Mode 手動播放排軸

### 重要聲明

- 本專案**不下載**任何 YouTube 影片
- 本專案**不重製**任何影片內容
- 僅使用 YouTube 官方 IFrame Player API 嵌入播放
- 影片創作者保有原始影片的所有權益與點閱數
- 本專案不使用任何 Square Enix / FF14 官方素材

## 部署

```bash
npm run deploy
```

使用 gh-pages 部署至 GitHub Pages。
