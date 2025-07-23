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

> [!IMPORTANT]
> Pythonの仮想環境が有効化されていないと失敗する
> ```sh
> make: samlocal: No such file or directory
> make: *** [deploy-local] Error 1
> ```

```sh
make build
make deploy-local

make delete-local
```

> [!NOTE]
> デプロイに失敗する場合はLocalStackのログを確認してみる
> ```sh
> docker compose logs localstack
> ```

> [!NOTE]
> `samlocal` で削除しようとすると，SAM CLIがLocalStack上のS3のURLを解釈できずエラーになる

```sh
ValueError: URL given to the parse method is not a valid S3 url http://localhost:4566/...
```

## ダミーデータの投入

```sh
make seed
```

## Lambda関数の実行

`infrastructure` 直下に `payload.json` を作成し，Lambda関数に渡すペイロードの内容を記載する．

```json
{
    "pathParameters": {
        // パスパラメータ
    },
    "queryStringParameters": {
        // クエリパラメータ
    },
    "body": {
        // リクエストボディ
    }
}
```

```sh
make list-lambda
make invoke-lambda name=<function_name> payload=payload.json
```

## 本番環境へのデプロイ

```sh
make build
make deploy-remote profile=<profile_name>

make delete-remote profile=<profile_name>
```

`<profile_name>` には `~/.aws/credentials` に記載されているプロフィール名を指定する．
