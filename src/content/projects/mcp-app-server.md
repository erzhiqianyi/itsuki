---
id: "mcp-app-server"
name: "MCP App Server"
description: "いまあるアプリを、OAuth 2.1 で守られた MCP サーバーに。自分のアプリを AI エージェントにつなぐためのライブラリ。"
kind: "Library · GitHub"
href: "https://github.com/erzhiqianyi/mcp-app-server"
icon: "plug-zap"
order: 7
action: "GitHub で見る"
links:
  - label: "npm で見る"
    href: "https://www.npmjs.com/package/@ninomae/mcp-app-server?activeTab=versions"
---

既存のアプリのユーザーとデータを、Claude や ChatGPT、Cursor などの AI エージェントから安全に使えるようにするための TypeScript ライブラリです。Firebase や Supabase、Auth0 といった手元の認証をそのまま活かし、OAuth 2.1 の認可レイヤーとスコープ付きのツール、ユーザーが許可を選ぶ同意画面までをひとまとまりにしています。就職手帖や JLPT Master Deck など、自分のアプリを AI につなぐ土台として使っています。

- 既存の認証を一つの関数でつなぎ、OAuth 2.1（PKCE・動的クライアント登録・トークンの更新と失効）を提供
- ツールごとに必要な権限を宣言し、ユーザーが同意画面で許可を選ぶ
- Node.js のほか Cloudflare Workers・Deno・Bun でも動作し、SQLite やメモリなど保存先を選べる
