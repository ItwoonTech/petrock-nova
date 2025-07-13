STACK_NAME = petrock-nova-infra
ENDPOINT_URL = http://localhost:4566

deploy-local:
	samlocal deploy --config-env dev

delete-local:
	aws cloudformation delete-stack \
		--stack-name $(STACK_NAME) \
		--endpoint-url $(ENDPOINT_URL)

deploy-remote:
	sam deploy --config-env prod --profile $(profile)

delete-remote:
	sam delete --config-env prod --profile $(profile)

help:
	@echo "利用可能なコマンド:"
	@echo "  make deploy-local      - LocalStackにデプロイ"
	@echo "  make delete-local      - LocalStackのスタックを削除"
	@echo "  make deploy-remote     - 本番環境にデプロイ"
	@echo "  make delete-remote     - 本番環境のスタックを削除"
	@echo "  make help              - このヘルプを表示" 
