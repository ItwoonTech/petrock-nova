## 環境構築

### Pythonの仮想環境

```sh
uv venv
uv sync
source .venv/bin/activate

deactivate
```

### Lambdaの起動

```sh
sam build
task start --profile <profile_name>
```

`<profile_name>` には `~/.aws/credentials` に記載されているプロフィール名を指定する．

> [!CAUTION]
> 動作確認時のBedrockの料金はこのプロフィールに紐づいたアカウントに課金される．

## CLI

フォーマット
```sh
uv run ruff check [--fix]
```
