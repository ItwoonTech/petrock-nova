## 環境構築

### Pythonの仮想環境

```sh
uv venv
uv sync
source .venv/bin/activate

deactivate
```

### LocalStackの起動

`scripts/.env.sample` をコピーして `scripts/.env` を作成する．

```sh
cp scripts/.env.sample scripts/.env
```

`.env` に動作確認時に使用する値を書き込む．

```sh
docker compose up [-d]
task create_table
task create_bucket

docker compose down [-v]
```

DynamoDBやS3に保存されているデータは[LocalStack Desktop](https://docs.localstack.cloud/user-guide/tools/localstack-desktop/)で確認する

### Lambdaの起動

```sh
sam build
task start --profile <profile_name>
```

`<profile_name>` には `~/.aws/credentials` に記載されているプロフィール名を指定する．

> [!CAUTION]
> 動作確認時のBedrockの料金はこのプロフィールに紐づいたアカウントに課金される．

### スクリプトを用いた動作確認

`scripts/api/` 内にある動作確認用のスクリプトを実行する．

```sh
python scripts/api/test_pet_api.py
```

## CLI

フォーマット
```sh
uv run ruff check [--fix]
```
