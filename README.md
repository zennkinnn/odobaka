# 踊るBAKA! TOKYO Astro Site

Astro + microCMSで再構築するためのデザイン初期実装です。練習日程と最新情報はmicroCMSから取得でき、環境変数が未設定の場合はモックデータで表示します。

## Setup

このプロジェクトは `pnpm` を前提にしています。Corepack が使える環境では、初回に有効化してから依存関係を入れてください。

```sh
corepack enable
pnpm install
```

本番URLが決まるまでは `.env` に仮の `SITE_URL` を置いてください。canonical、robots、sitemap はこの値を使います。

```sh
cp .env.example .env
```

## microCMS API設計

無償プランのAPI数上限を考慮し、更新頻度の高い領域だけを5 API以内に収めます。サイト設定、固定ページ文言、ギャラリーはローカルデータで管理し、API枠を消費しません。

1. `practice-schedules`: 練習日程、会場、見学可否
2. `latest-news`: お知らせ、テーマ発表など
3. `latest-events`: 演舞予定、出演時間など
4. `latest-recruiting`: メンバー募集、見学受付など
5. `latest-reports`: 活動報告、出演後レポートなど

最新情報の4 APIは同じ項目構造で作成し、サイト側では日付順に統合して表示します。練習日程はホームでは直近3件、`/schedule/` では全件を表示します。

## Gallery更新

ギャラリーはmicroCMSを使わず、`src/data/mock.ts` の `gallery` 配列で更新します。`imageUrl` に表示画像のURL、`sourceUrl` にInstagramまたはFacebookの投稿URL、`sourceLabel` に `Instagram` または `Facebook` を入れると、画像カードから元投稿へリンクできます。

ホームのギャラリーは `sourceLabel` ごとに分かれます。Instagram は横スクロールの写真レール、Facebook は同じセクション内の追加枠として表示します。

## Commands

```sh
pnpm dev
pnpm build
pnpm preview
```

`MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` が未設定の場合は、`src/data/mock.ts` のモックデータで表示します。設定済みの場合、練習日程は `practice-schedules`、最新情報は `latest-news` / `latest-events` / `latest-recruiting` / `latest-reports` から取得します。

## Notes

- `SITE_URL` は公開前に正式ドメインへ差し替えてください。
- `src/data/mock.ts` の `joinFormUrl` は見学フォームURLとして各CTAに反映されます。
- `dist/`、`.astro/`、`node_modules/`、`.tools/` などの生成物やローカル環境物はコミット対象外です。
