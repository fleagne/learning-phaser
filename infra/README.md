# フォルダ構成
```
├ bin
│ ├ infra.ts // Stackを管理する
│ └ parameter.ts // 環境毎のパラメーターを管理する
├ lambda
│ └ *.ts // Lambda毎に設定する関数を管理する
├ lib
│ ├ construct // Constructを定義
│ └ stack // Stackを定義
├ test // テスト
├ utils // 共通で使用できるものを定義
└ ...
```

## デプロイ方法
```
cdk synth -c environment=dev
```