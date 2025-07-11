STACK_NAME = petrock-nova-infra
ENDPOINT_URL = http://localhost:4566

deploy-local:
	samlocal deploy --config-env dev

delete-local:
	aws cloudformation delete-stack \
		--stack-name $(STACK_NAME) \
		--endpoint-url $(ENDPOINT_URL)

deploy-remote:
	sam deploy --config-env prod

delete-remote:
	sam delete --config-env prod

help:
	@echo "利用可能なコマンド:"
	@echo "  make deploy      - LocalStackにデプロイ"
	@echo "  make delete      - LocalStackのスタックを削除"
	@echo "  make help        - このヘルプを表示" 
