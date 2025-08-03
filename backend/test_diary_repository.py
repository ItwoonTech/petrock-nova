#!/usr/bin/env python3
"""
日記リポジトリのデバッグテストスクリプト
"""

import os
import sys
import logging
from datetime import datetime, UTC

# プロジェクトのルートディレクトリをパスに追加
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.diary import Diary, DiaryTask
from app.repositories.dynamodb.diary_repository import DynamoDBDiaryRepository

# ログ設定
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_diary_repository():
    """日記リポジトリのテスト"""
    
    # 環境変数の設定（ローカル開発用）
    os.environ.setdefault("DYNAMODB_ENDPOINT", "http://localhost:8000")
    
    try:
        # リポジトリの初期化
        print("=== リポジトリの初期化 ===")
        repository = DynamoDBDiaryRepository("diaries-table")
        print("✅ リポジトリの初期化成功")
        
        # テストデータの作成
        print("\n=== テストデータの作成 ===")
        test_tasks = [
            DiaryTask(
                task_title="散歩",
                task_time="09:00",
                task_status="completed"
            ),
            DiaryTask(
                task_title="ご飯",
                task_time="12:00",
                task_status="pending"
            )
        ]
        
        test_diary = Diary(
            pet_id="test_pet_123",
            image_name="test_image.jpg",
            reacted=True,
            advice="よく食べました",
            comment="元気です",
            weather="sunny",
            temperature=25.5,
            tasks=test_tasks
        )
        
        print(f"✅ テストデータ作成: pet_id={test_diary.pet_id}")
        print(f"   タスク数: {len(test_diary.tasks)}")
        
        # 日記の作成テスト
        print("\n=== 日記の作成テスト ===")
        created_diary = repository.create(test_diary)
        print(f"✅ 日記作成成功: {created_diary.pet_id}")
        
        # 日記の取得テスト
        print("\n=== 日記の取得テスト ===")
        diary_id = f"{test_diary.pet_id}_{test_diary.date.strftime('%Y-%m-%d')}"
        retrieved_diary = repository.get_by_id(diary_id, test_diary.date.strftime('%Y-%m-%d'))
        
        if retrieved_diary:
            print(f"✅ 日記取得成功: {retrieved_diary.pet_id}")
            print(f"   アドバイス: {retrieved_diary.advice}")
            print(f"   天気: {retrieved_diary.weather}")
            print(f"   タスク数: {len(retrieved_diary.tasks)}")
        else:
            print("❌ 日記取得失敗")
        
        # 日記の更新テスト
        print("\n=== 日記の更新テスト ===")
        test_diary.advice = "更新されたアドバイス"
        test_diary.comment = "更新されたコメント"
        
        updated_diary = repository.update(test_diary)
        print(f"✅ 日記更新成功: {updated_diary.advice}")
        
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()

def test_diary_model():
    """日記モデルのテスト"""
    
    print("\n=== 日記モデルのテスト ===")
    
    try:
        # 辞書データからの作成テスト
        diary_data = {
            "pet_id": "test_pet_456",
            "image_name": "test_image.jpg",
            "reacted": True,
            "advice": "テストアドバイス",
            "comment": "テストコメント",
            "weather": "cloudy",
            "temperature": 20.0,
            "tasks": [
                {
                    "task_title": "テストタスク",
                    "task_time": "10:00",
                    "task_status": "pending"
                }
            ]
        }
        
        diary = Diary.from_dict(diary_data)
        print(f"✅ 辞書からの作成成功: {diary.pet_id}")
        
        # 辞書への変換テスト
        diary_dict = diary.to_dict()
        print(f"✅ 辞書への変換成功: {len(diary_dict)} フィールド")
        
    except Exception as e:
        print(f"❌ モデルテストでエラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🚀 日記リポジトリのデバッグテスト開始")
    
    # モデルのテスト
    test_diary_model()
    
    # リポジトリのテスト
    test_diary_repository()
    
    print("\n🏁 デバッグテスト完了") 