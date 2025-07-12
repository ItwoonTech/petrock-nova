## 環境構築

### Pythonの仮想環境

```sh
uv venv
uv sync
source .venv/bin/activate

deactivate
```

## FastAPIの起動

```
uv run fastapi dev
```

## Lambdaの起動

`requirements.txt` を作成する．

```sh
uv pip freeze > requirements.txt
```

> [!IMPORTANT]
> インフラのdockerコンテナを先に起動する．

```sh
make build
make start profile=<profile_name>
```

`<profile_name>` には `~/.aws/credentials` に記載されているプロフィール名を指定する．

> [!CAUTION]
> 動作確認時のBedrockの料金はこのプロフィールに紐づいたアカウントに課金される．

## 本番環境へのデプロイ

```sh
make build
make deploy profile=<profile_name>

make delete profile=<profile_name>
```

## CLI

フォーマット
```sh
uv run ruff check [--fix]
```
