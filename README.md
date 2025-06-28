# AWS Hackathon

# 開発ルール

このリポジトリでは、以下のルールに従って開発を行ってください。

## ワークスペース

- **ワークスペースで作業する**  
  フロントとバックで settings.json を分けるためにリポジトリ内にワークスペースがある。  
  開発するときは「ファイルでワークスペースを開く」で `petrock-ai.code-workspace` を開いてください 


## ブランチの運用

- **main,developブランチを直接編集しないでください**  
  機能開発や修正は、必ず**feature/○○**という名前のブランチを作成し、そこに変更を加えてください。  
  変更が完成したら、プルリクエスト（PR）を作成し、コードレビューを依頼してください。  
  修正の際は、**fix/○○**というブランチを作成して、変更を加えてください。  
  バグ修正の際は、**bug/○○**というブランチで作業を行なってください。  

- **プルリクエストの承認は別の人が行ってください**  
  自分のプルリクエストは、必ず他のメンバーにレビューをお願いし、承認をもらった後に`develop`ブランチにマージしてください。

- **push先をorigin/mainにしないでください**  
  必ず作成したブランチ（例: `feature/○○`）にpushしてください。`main`, `develop`ブランチには直接pushしないでください。

## コードの品質

- **コードレビューの実施**  
  プルリクエストが作成された際には、必ずコードレビューを行い、問題がないかを確認してください。  
  特に、バグやパフォーマンスの問題、コードの可読性や保守性を確認することが大切です。

- **コミットメッセージのルール**  
  コミットメッセージは、変更内容がわかりやすく、簡潔に記述してください。  
  例えば、以下のような形式で記述すると良いです：
  - `add: 新しいタスク機能の追加`
  - `fix: UIの修正`
  - `refactor: コードのリファクタリング`

- **機能のテスト**  
  新たに追加した機能や修正を行った場合、その動作確認を行い、テストを実施してからプルリクエストを作成してください。

## その他のルール

- **定期的なリベース**  
  作業中のブランチは定期的に`develop`ブランチを取り込んで、コンフリクトを避けるようにしてください。  
  作業が終了した際にも、`develop`ブランチが最新の状態であることを確認し、リベースを行ってからプルリクエストを作成してください。
  `.env`ファイルのようなパスワードやAPIを含むファイルはプッシュしないようにしてください。

## 初期動作
```
cd apps/frontend
npm install
npm run dev
```

## PWAをローカル上で確認する
### PC ver
```
npm run build
npm run preview
```
### iPhone ver
①	PCで実行
```
npm run preview -- --host
```
②	PCのローカルIPを調べる  
mac
```
ipconfig getifaddr en0
```
windows
```
ipconfig
```
③	iPhoneのSafariで http://<PCのIP>:4173 にアクセス  
④	PWAなら「ホーム画面に追加」できる

## 依存環境メモ
※今回行った初期設定メモ  
`npm create vite@latest`  
`npm i @chakra-ui/react @emotion/react`  
`npx @chakra-ui/cli snippet add`  
`npm i -D vite-tsconfig-paths`  
`npm install zustand`  
`npm install react-router-dom`  
`npm install -D vite-plugin-pwa`  
設定は公式から確認  

→プロジェクトを作る際に、
`npm create vite@latest`ではなく
`npm create @vite-pwa/pwa@latest`
した方が楽だった。

※追加  
ヘッドレスUI  
`npm install @ark-ui/react`  
ES Lint + Prettier  
`npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks`  
`npm install --save-dev prettier eslint-config-prettier`  
MSW mock
`npm i msw --save-dev`  

## モックについて
※モックを追加したため
`.env`ファイルを`frontend`ディレクトリ直下におき、
```
MODE = "development"
# MODE = "production"
```
を追加.  
mockを使う場合は、"development"  
本番環境の場合は、"production"を用いること.

これを行うことで、簡単にモックと本番環境のAPIに切り替えることができる

## 以下デフォルト内容

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
