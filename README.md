# Raid Timeline Player

「Raid Timeline Player」是一個 FF14 粉絲向戰鬥排軸視覺化播放器 MVP。它模擬歌詞播放器式的時間軸體驗，讓玩家可以依戰鬥時間查看目前 mechanic、下一個提示、職業相關行動與團隊減傷安排。

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

## 目前功能

- Play / Pause / Restart 播放控制
- 可拖曳時間進度條並跳轉戰鬥時間
- 顯示目前時間與總長度
- 倍速切換：0.5x / 1x / 1.5x / 2x
- 提示提前秒數：0 / 1 / 3 / 5 / 10 秒
- Now 區顯示目前事件與下一個 upcoming 事件
- 主時間軸支援 active、upcoming、past 狀態
- 點擊任一事件可跳到該時間
- Job filter：ALL 與所有指定職業縮寫
- 分離式面板：
  - Boss Timeline
  - My Job Actions
  - Party Mitigation
  - Notes
- 本地 mock data：MVP Demo Encounter，總長度 360 秒，31 筆原創事件

## 未來可擴充功能

- 匯入 / 匯出 JSON
- Discord 分享連結
- 多語言 i18n
- 職業技能 icon pack，但需避免侵權
- 多人協作排軸
- YouTube 影片時間同步
- FFLogs / ACT 資料輔助分析，但先不串接
