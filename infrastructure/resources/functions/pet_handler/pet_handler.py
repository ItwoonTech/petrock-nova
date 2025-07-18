import os, boto3, json

# DynamoDB テーブル名を環境変数から取得
pet_table_name = os.environ.get("PET_TABLE_NAME")

# DynamoDB クライアント
dynamodb = boto3.resource("dynamodb")
pet_table = dynamodb.Table(pet_table_name)

def get_pet(event, context):
    pet_id = event["pathParameters"]["pet_id"]
    if not pet_id:
        return {"statusCode": 400, "body": json.dumps({"error": "Pet ID is required"})}

    try:
        response = pet_table.get_item(
            Key={"pet_id": pet_id}
        )
    
        item = response.get("Item")

        if not item:
            return {"statusCode": 404, "body": json.dumps({"error": "Pet not found"})}

        return {"statusCode": 200, "body": json.dumps(item)}

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
    
    

