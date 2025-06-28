#!/bin/bash

source .env # .envファイルを読み込む

BASE_URL="http://localhost:4010"

USER_ID="08502f5a-4452-4b8b-8038-68b0b5082f78"
PET_ID="42c829b1-b69a-4d27-b755-322f4661215d"
CHAT_ID="CHAT#001"
DATE="2024-03-20"

is_json() {
  echo "$1" | jq empty > /dev/null 2>&1
}

print_result() {
  local status_code=$1
  local expected=$2
  local body=$3

  if [ "$status_code" -eq "$expected" ] && is_json "$body"; then
    echo "Status: $status_code ✅ Passed"
    echo "Response: $body"
  else
    echo "Status: $status_code ❌ Failed (Expected $expected)"
    echo "Response: $body"
  fi
  echo ""
}

# POST /users
test_create_user() {
  echo "Testing POST /users"
  response=$(
    curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "08502f5a-4452-4b8b-8038-68b0b5082f78",
      "pet_id": "c2b16496-6262-4185-a2fd-fab858f3e3d7",
      "user_name": "星野空",
      "user_role": "child",
      "password": "1234"
    }'
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# GET /users/{user_id}
test_get_user() {
  echo "Testing GET /users/$USER_ID"
  response=$(
    curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER_ID"
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# PUT /users/{user_id}
test_update_user() {
  echo "Testing PUT /users/$USER_ID"
  response=$(
    curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/users/$USER_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "password": "newpassword123",
      "user_role": "parent"
    }'
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# POST /pets
test_create_pet() {
  echo "Testing POST /pets"
  response=$(
    curl -s -w "\n%{http_code}" -X POST "$BASE_URL/pets" \
    -H "Content-Type: application/json" \
    -d '{
      "pet_id": "a4da2537-2e1f-405b-93d2-6c8a88d4283d",
      "name": "ポチ",
      "category": "dog",
      "birth_date": "2023-01-01",
      "gender": "male",
      "pet_info": [
        {
          "pet_info_title": "好きな食べ物",
          "pet_info_description": "ドッグフード",
          "pet_info_icon": "🍖"
        }
      ]
    }'
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 201 "$body"
}

# GET /pets/{pet_id}
test_get_pet() {
  echo "Testing GET /pets/$PET_ID"
  response=$(
    curl -s -w "\n%{http_code}" -X GET "$BASE_URL/pets/$PET_ID"
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# PUT /pets/{pet_id}
test_update_pet() {
  echo "Testing PUT /pets/$PET_ID"
  response=$(
    curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/pets/$PET_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "pet_info": [
        {
          "pet_info_title": "好きな遊び",
          "pet_info_description": "ボール遊び",
          "pet_info_icon": "⚾"
        }
      ]
    }'
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# GET /pets/{pet_id}/diaries/{date}
test_get_diary() {
  echo "Testing GET /pets/$PET_ID/diaries/$DATE"
  response=$(
    curl -s -w "\n%{http_code}" -X GET "$BASE_URL/pets/$PET_ID/diaries/$DATE"
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# POST /pets/{pet_id}/diaries
test_create_diary() {
  echo "Testing POST /pets/$PET_ID/diaries"
  response=$(
    curl -s -w "\n%{http_code}" -X POST "$BASE_URL/pets/$PET_ID/diaries" \
    -H "Content-Type: application/json" \
    -d '{
      "date": "2024-03-20",
      "picture_link": "'"https://picsum.photos/id/237/720/720"'",
      "reaction": "今日は元気いっぱい！",
      "weather": "晴れ",
      "temperature": 20.5,
      "task": [
        {
          "task_title": "朝の散歩",
          "task_description": "2km走る",
          "task_time": "08:00:00",
          "completed": true,
          "repeat": true,
          "sub_task": [
            {
              "title": "リードの装着",
              "description": "首輪とリードを付ける",
              "completed": true,
              "sub_task_time": "07:55:00"
            }
          ]
        }
      ]
    }'
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# PUT /pets/{pet_id}/diaries/{date}
test_update_diary() {
  echo "Testing PUT /pets/$PET_ID/diaries/$DATE"
  response=$(
    curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/pets/$PET_ID/diaries/$DATE" \
    -H "Content-Type: application/json" \
    -d '{
      "reaction": "更新されたリアクション",
      "task": [
        {
          "task_title": "夕方の散歩",
          "task_description": "1km走る",
          "task_time": "17:00:00",
          "completed": false,
          "repeat": true,
          "sub_task": []
        }
      ]
    }'
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# POST /pets/{pet_id}/chats
test_create_chat() {
  echo "Testing POST /pets/$PET_ID/chats"
  response=$(
    curl -s -w "\n%{http_code}" -X POST "$BASE_URL/pets/$PET_ID/chats" \
    -H "Content-Type: application/json" \
    -d '{
      "chat_id": "CHAT#001",
      "sender": "user",
      "content": "お散歩にいつ行けばいいですか？"
    }'
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# GET /pets/{pet_id}/chats/{chat_id}
test_get_chat() {
  echo "Testing GET /pets/$PET_ID/chats/$CHAT_ID"
  response=$(
    curl -s -w "\n%{http_code}" -X GET "$BASE_URL/pets/$PET_ID/chats/$CHAT_ID"
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# GET /s3/presigned-url
test_get_presigned_url() {
  echo "Testing GET /s3/presigned-url"
  response=$(
    curl -s -w "\n%{http_code}" -X GET "$BASE_URL/s3/presigned-url?pet_id=$PET_ID&extension=jpg"
  )

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  print_result "$status_code" 200 "$body"
}

# メニュー表示
menu() {
  echo "Petrock AI API Test CLI"
  echo "--------------------------------"
  echo ""

  PS3="Select a test to run: "
  options=(
    "Create User" 
    "Get User" 
    "Update User"
    "Create Pet" 
    "Get Pet"
    "Update Pet"
    "Create Diary"
    "Get Diary"
    "Update Diary"
    "Create Chat" 
    "Get Chat"
    "Get Presigned URL" 
    "Run All Tests" 
    "Exit"
  )
  select opt in "${options[@]}"; do
    case $opt in
      "Create User")
        test_create_user
        ;;
      "Get User")
        test_get_user
        ;;
      "Update User")
        test_update_user
        ;;
      "Create Pet")
        test_create_pet
        ;;
      "Get Pet")
        test_get_pet
        ;;
      "Update Pet")
        test_update_pet
        ;;
      "Create Diary")
        test_create_diary
        ;;
      "Get Diary")
        test_get_diary
        ;;
      "Update Diary")
        test_update_diary
        ;;
      "Create Chat")
        test_create_chat
        ;;
      "Get Chat")
        test_get_chat
        ;;
      "Get Presigned URL")
        test_get_presigned_url
        ;;
      "Run All Tests")
        test_create_user
        test_get_user
        test_update_user
        test_create_pet
        test_get_pet
        test_update_pet
        test_create_diary
        test_get_diary
        test_update_diary
        test_create_chat
        test_get_chat
        test_get_presigned_url
        ;;
      "Exit")
        break
        ;;
      *)
        echo "Invalid option"
        ;;
    esac
  done
}

menu
