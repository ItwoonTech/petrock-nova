## 環境構築

### Pythonの仮想環境

```sh
uv venv
uv sync
source .venv/bin/activate

deactivate
```

## LocalStackの起動

```sh
docker compose up [-d]
docker compose down [-v]
```

DynamoDBやS3に保存されているデータは[LocalStack Desktop](https://docs.localstack.cloud/user-guide/tools/localstack-desktop/)で確認する

## LocalStackへのデプロイ

```sh
make deploy-local
make delete-local
```

> [!NOTE]
> `samlocal` で削除しようとすると，SAM CLIがLocalStack上のS3のURLを解釈できずエラーになる

```sh
ValueError: URL given to the parse method is not a valid S3 url http://localhost:4566/...
```

## 本番環境へのデプロイ

```sh
make deploy-remote profile=<profile_name>
make delete-remote profile=<profile_name>
```

`<profile_name>` には `~/.aws/credentials` に記載されているプロフィール名を指定する．
