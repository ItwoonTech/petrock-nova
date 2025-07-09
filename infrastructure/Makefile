STACK_NAME = petrock-nova-infra
ENDPOINT_URL = http://localhost:4566

deploy:
	samlocal deploy --config-env dev

delete:
	aws cloudformation delete-stack \
		--stack-name $(STACK_NAME) \
		--endpoint-url $(ENDPOINT_URL)

help:
	@echo "利用可能なコマンド:"
	@echo "  make deploy      - LocalStackにデプロイ"
	@echo "  make delete      - LocalStackのスタックを削除"
	@echo "  make help        - このヘルプを表示" 
