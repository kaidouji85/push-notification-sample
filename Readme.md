# Push通知サンプル

## はじめに
このリポジトリは、「ウェブアプリへのプッシュ通知の追加」を参考にしたPush通知サンプルです。

https://developers.google.com/web/fundamentals/codelabs/push-notifications/

## 使い方

```
git clone XXXXXXX
npm install
# main.jsのPUBLIC_KEYに公開鍵を入力する
# 公開鍵は以下サイトから取得できる
# https://web-push-codelab.glitch.me/
vi main.js

npm start

# ローカルでのPush通知
# (1)ブラウザでlocalhost:8080を開く
# (2)開発者モードを開き、Service WorkerのPushを実行する
# 開発者モードの使い方は、以下URLを参照
# https://web-push-codelab.glitch.me/
# (3)端末にPush通知がくる

# ネット経由でのPush通知
# (1)ブラウザでlocalhost:8080を開く
# (2)Push Exampleの下に書かれている文字をコピーして、
# (3)https://web-push-codelab.glitch.me/を開く
# (4)「Subscription to Send To」に(2)の内容をペーストする
# (5)「SEND PUSH MESSAGE」をクリックする
# (6)端末にPush通知がくる
```
