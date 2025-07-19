STACK_NAME = petrock-nova-infra
ENDPOINT_URL = http://localhost:4566

build:
	sam build --use-container

deploy-local:
	samlocal deploy \
		--config-env dev \
		--parameter-overrides \
			Environment=local

delete-local:
	awslocal cloudformation delete-stack \
		--stack-name $(STACK_NAME) \

deploy-remote:
	sam deploy \
		--config-env prod \
		--profile $(profile)

delete-remote:
	sam delete \
		--config-env prod \
		--profile $(profile)

seed:
	uv run python seeds/seed_pet.py

list-table:
	aws dynamodb list-tables --endpoint-url $(ENDPOINT_URL)

list-bucket:
	aws s3 ls --endpoint-url $(ENDPOINT_URL)

list-lambda:
	aws lambda list-functions --endpoint-url $(ENDPOINT_URL)

invoke-lambda:
	aws lambda invoke \
		--function-name $(name) \
		--payload file://$(payload) \
		--endpoint-url $(ENDPOINT_URL) \
		response.json
	cat response.json | jq '.body |= fromjson' | jq '.'

help:
	@echo "利用可能なコマンド:"
	@echo "  make deploy-local      - LocalStackにデプロイ"
	@echo "  make delete-local      - LocalStackのスタックを削除"
	@echo "  make deploy-remote     - 本番環境にデプロイ"
	@echo "  make delete-remote     - 本番環境のスタックを削除"
	@echo "  make seed              - DynamoDBにダミーデータを投入"
	@echo "  make list-table        - DynamoDBテーブル一覧を表示"
	@echo "  make list-bucket       - S3バケット一覧を表示"
	@echo "  make list-lambda       - Lambda関数一覧を表示"
	@echo "  make invoke-lambda     - Lambda関数を実行"
	@echo "  make help              - このヘルプを表示"
