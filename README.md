# 概要
Phaser3を使ったゲーム開発の練習

非常にシンプルなゲームとしていますが、WebSocketを使うことでスマートフォンをコントローラーとして使えるようにするなど、挑戦的なこともしています

## 使い方
### 事前準備
#### Node, npm, pnpmの準備

省略。このリポジトリではpnpmを使用しています。

```bash
pnpm install
```

### スマートフォンの加速度情報を取得できるようにする
私はiPhone 15 Pro使っている。他のスマートフォンでできるかどうかは未検証

コマンドプロンプトで、PCのIPv4アドレスを見つけておく
```bash
ipconfig
```

たぶん、こんな感じのが見つかるのではないかなと

> 192.168.0.3

WSLの内部IPを調べておく
```bash
ip addr
```

参照する必要があるのは、`eth0`の`inet`。私の場合は次のような感じ

> 172.18.38.254

PowerShellを管理者権限で開き、ポートフォワーディングをする

```shell
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=172.18.38.254
```

ポートフォワーディングの状況は、次のコマンドで確認できる

```shell
netsh interface portproxy show all
```

ポートフォワーディングを削除するには、次のコマンドを実行する

```shell
netsh interface portproxy delete v4tov4 listenport=8080 listenaddress=0.0.0.0
```

firewallでポートにアクセスできないと思うので、インバウンド通信（内向き）のポート設定をする。8080を許可すればOK

これで、スマートフォンが同じネットワークにいれば、PCのIPアドレス:ポートで、接続できるようになる

### HTTPSを使えるようにする
httpだと加速度情報得ることができないため、httpsサーバでどうこうできるようにする

`@vitejs/plugin-basic-ssl`で簡易的にhttpsサーバを立てるようにしている

### 起動
```bash
pnpm run dev
```

スマートフォンからPCのローカルサーバーにアクセスし、ゲームをプレイしたい場合

```bash
https://192.168.0.3:8080/
```

現時点で、スマートフォン向けにresizeする機能とかは作ってないので、おいおい
