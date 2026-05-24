#!/usr/bin/env python3
"""
Figma APIを使って特定のノードにコメントを投稿するスクリプト

Usage:
    python3 post_comment.py <file_key> <node_id> <x> <y> <comment_message>

Arguments:
    file_key: FigmaファイルのキーID
    node_id: コメントを付けるノードID（例: 1:197 または 1-197）
    x: ノード内のX座標オフセット（ピクセル）
    y: ノード内のY座標オフセット（ピクセル）
    comment_message: コメント本文

Environment:
    FIGMA_TOKEN: Figma Personal Access Token (required)

Example:
    python3 post_comment.py ABC123 1:197 100 200 "ここにコメント"
"""

import os
import sys
import json
import urllib.request
import urllib.error


def post_comment(token: str, file_key: str, node_id: str, x: float, y: float, message: str) -> dict:
    """Figma APIにコメントを投稿する"""
    url = f"https://api.figma.com/v1/files/{file_key}/comments"

    # node_idのフォーマットを正規化（123-456 → 123:456）
    normalized_node_id = node_id.replace("-", ":")

    payload = {
        "message": message,
        "client_meta": {
            "node_id": normalized_node_id,
            "node_offset": {"x": x, "y": y}
        }
    }

    data = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=data,
        headers={
            "X-Figma-Token": token,
            "Content-Type": "application/json"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        raise Exception(f"Figma API error ({e.code}): {error_body}")


def main():
    if len(sys.argv) < 6:
        print("Usage: python3 post_comment.py <file_key> <node_id> <x> <y> <comment_message>")
        print("")
        print("Environment: FIGMA_TOKEN must be set")
        sys.exit(1)

    token = os.environ.get("FIGMA_TOKEN")
    if not token:
        print("Error: FIGMA_TOKEN environment variable is not set")
        sys.exit(1)

    file_key = sys.argv[1]
    node_id = sys.argv[2]
    try:
        x = float(sys.argv[3])
        y = float(sys.argv[4])
    except ValueError:
        print("Error: x and y must be numeric values")
        sys.exit(1)
    message = sys.argv[5]

    try:
        result = post_comment(token, file_key, node_id, x, y, message)
        print(f"Comment posted successfully!")
        print(f"  ID: {result.get('id', 'N/A')}")
        print(f"  Node: {node_id}")
        print(f"  Position: ({x}, {y})")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
