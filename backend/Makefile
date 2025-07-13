USER_TABLE_NAME = petrock-nova-users

start:
	sam local start-api \
		--docker-network petrock_nova \
		--env-vars env.local.json \
		--profile $(profile)

build:
	sam build

deploy:
	sam deploy \
		--parameter-overrides \
			UserTableName=$(USER_TABLE_NAME) \
		--profile $(profile)

delete:
	sam delete --profile $(profile)
