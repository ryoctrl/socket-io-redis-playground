# Node.js v8.16.2 ベースイメージ
FROM node:8.16.2-alpine

# 作業ディレクトリの設定
WORKDIR /app

# パッケージファイルをコピー
COPY package.json .

# パッケージインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

ENV DEBUG=*

# アプリケーションの起動
CMD ["node", "index.js"]

