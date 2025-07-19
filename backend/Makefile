start:
	sam local start-api \
		--docker-network petrock_nova \
		--env-vars env.local.json \
		--profile $(profile)

build:
	sam build --use-container

deploy:
	sam deploy --profile $(profile)

delete:
	sam delete --profile $(profile)
