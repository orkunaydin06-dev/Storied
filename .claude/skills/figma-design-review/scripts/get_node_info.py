#!/usr/bin/env python3
"""
Figma REST APIを使ってノード情報を取得するスクリプト

デザインレビュー用に座標、パディング、色情報を抽出

Usage:
    python3 get_node_info.py <file_key> <node_id> [--detail]

Arguments:
    file_key: FigmaファイルのキーID
    node_id: 取得するノードID（例: 1:197 または 1-197）
    --detail: 詳細情報（色、パディング等）を出力

Environment:
    FIGMA_TOKEN: Figma Personal Access Token (required)

Example:
    python3 get_node_info.py ABC123 1:197
    python3 get_node_info.py ABC123 1:197 --detail
"""

import os
import sys
import json
import urllib.request
import urllib.error
import math


def get_node_info(token: str, file_key: str, node_id: str) -> dict:
    """Figma REST APIでノード情報を取得する"""
    url_node_id = node_id.replace(":", "-")
    url = f"https://api.figma.com/v1/files/{file_key}/nodes?ids={url_node_id}"

    request = urllib.request.Request(
        url,
        headers={"X-Figma-Token": token},
        method="GET"
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        raise Exception(f"Figma API error ({e.code}): {error_body}")


def rgba_to_hex(color: dict) -> str:
    r = int(color.get("r", 0) * 255)
    g = int(color.get("g", 0) * 255)
    b = int(color.get("b", 0) * 255)
    a = color.get("a", 1)
    if a < 1:
        return f"#{r:02x}{g:02x}{b:02x} ({a:.0%})"
    return f"#{r:02x}{g:02x}{b:02x}"


def get_relative_luminance(color: dict) -> float:
    def adjust(c):
        if c <= 0.03928:
            return c / 12.92
        return ((c + 0.055) / 1.055) ** 2.4
    r = adjust(color.get("r", 0))
    g = adjust(color.get("g", 0))
    b = adjust(color.get("b", 0))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def calculate_contrast_ratio(color1: dict, color2: dict) -> float:
    l1 = get_relative_luminance(color1)
    l2 = get_relative_luminance(color2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def extract_color_info(node: dict) -> dict:
    colors = {}
    fills = node.get("fills", [])
    if fills and isinstance(fills, list):
        for fill in fills:
            if fill.get("type") == "SOLID" and fill.get("visible", True):
                colors["fill"] = fill.get("color", {})
                colors["fill_hex"] = rgba_to_hex(fill.get("color", {}))
                break
    strokes = node.get("strokes", [])
    if strokes and isinstance(strokes, list):
        for stroke in strokes:
            if stroke.get("type") == "SOLID" and stroke.get("visible", True):
                colors["stroke"] = stroke.get("color", {})
                colors["stroke_hex"] = rgba_to_hex(stroke.get("color", {}))
                colors["stroke_weight"] = node.get("strokeWeight", 0)
                break
    return colors


def extract_spacing_info(node: dict) -> dict:
    spacing = {}
    if node.get("paddingLeft") is not None:
        spacing["padding"] = {
            "top": node.get("paddingTop", 0),
            "right": node.get("paddingRight", 0),
            "bottom": node.get("paddingBottom", 0),
            "left": node.get("paddingLeft", 0)
        }
    if node.get("itemSpacing") is not None:
        spacing["item_spacing"] = node.get("itemSpacing")
    if node.get("layoutMode"):
        spacing["layout_mode"] = node.get("layoutMode")
    if node.get("cornerRadius"):
        spacing["corner_radius"] = node.get("cornerRadius")
    elif node.get("rectangleCornerRadii"):
        spacing["corner_radii"] = node.get("rectangleCornerRadii")
    return spacing


def extract_coordinates(node: dict, depth: int = 0, root_x: float = None, root_y: float = None, detail: bool = False) -> list:
    results = []
    indent = "  " * depth

    name = node.get("name", "Unknown")
    node_type = node.get("type", "Unknown")

    bbox = node.get("absoluteBoundingBox", {})
    abs_x = bbox.get("x", 0)
    abs_y = bbox.get("y", 0)
    width = bbox.get("width", 0)
    height = bbox.get("height", 0)

    if root_x is None:
        root_x = abs_x
    if root_y is None:
        root_y = abs_y

    rel_x = abs_x - root_x
    rel_y = abs_y - root_y

    colors = extract_color_info(node) if detail else {}
    spacing = extract_spacing_info(node) if detail else {}

    if bbox:
        result_item = {
            "name": name, "type": node_type,
            "abs_x": abs_x, "abs_y": abs_y,
            "rel_x": rel_x, "rel_y": rel_y,
            "width": width, "height": height,
            "depth": depth
        }
        if colors:
            result_item["colors"] = colors
        if spacing:
            result_item["spacing"] = spacing
        results.append(result_item)

        attrs = f'name="{name}" x="{rel_x:.0f}" y="{rel_y:.0f}" width="{width:.0f}" height="{height:.0f}"'
        if detail:
            if colors.get("fill_hex"):
                attrs += f' fill="{colors["fill_hex"]}"'
            if colors.get("stroke_hex"):
                attrs += f' stroke="{colors["stroke_hex"]}" stroke-weight="{colors.get("stroke_weight", 0)}"'
            if spacing.get("padding"):
                p = spacing["padding"]
                attrs += f' padding="{p["top"]},{p["right"]},{p["bottom"]},{p["left"]}"'
            if spacing.get("item_spacing") is not None:
                attrs += f' gap="{spacing["item_spacing"]}"'
            if spacing.get("corner_radius"):
                attrs += f' radius="{spacing["corner_radius"]}"'

        print(f"{indent}<{node_type} {attrs}>")

    children = node.get("children", [])
    if children and depth < 4:
        for child in children[:15]:
            results.extend(extract_coordinates(child, depth + 1, root_x, root_y, detail))

    if bbox:
        print(f"{indent}</{node_type}>")

    return results


def analyze_design_issues(results: list) -> list:
    issues = []

    paddings = {}
    for item in results:
        if "spacing" in item and "padding" in item["spacing"]:
            p = item["spacing"]["padding"]
            key = f"{p['top']},{p['right']},{p['bottom']},{p['left']}"
            if key not in paddings:
                paddings[key] = []
            paddings[key].append(item["name"])
    if len(paddings) > 3:
        issues.append({
            "type": "spacing",
            "message": f"パディング値が{len(paddings)}種類使用されている。統一を検討",
            "details": list(paddings.keys())[:5]
        })

    colors_used = {}
    for item in results:
        if "colors" in item and item["colors"].get("fill_hex"):
            hex_val = item["colors"]["fill_hex"].split()[0]
            if hex_val not in colors_used:
                colors_used[hex_val] = []
            colors_used[hex_val].append(item["name"])
    if len(colors_used) > 8:
        issues.append({
            "type": "color",
            "message": f"背景色が{len(colors_used)}種類使用されている。デザインシステムの色に統一を検討",
            "details": list(colors_used.keys())[:8]
        })

    non_grid_items = []
    for item in results:
        w, h = item.get("width", 0), item.get("height", 0)
        if w > 0 and h > 0:
            if w % 4 != 0 or h % 4 != 0:
                non_grid_items.append(f"{item['name']} ({w:.0f}x{h:.0f})")
    if non_grid_items and len(non_grid_items) > 2:
        issues.append({
            "type": "grid",
            "message": "4pxグリッドに沿っていない要素がある",
            "details": non_grid_items[:5]
        })

    return issues


def main():
    if len(sys.argv) < 3:
        print("Usage: python3 get_node_info.py <file_key> <node_id> [--detail]")
        print("Environment: FIGMA_TOKEN must be set")
        sys.exit(1)

    token = os.environ.get("FIGMA_TOKEN")
    if not token:
        print("Error: FIGMA_TOKEN environment variable is not set")
        sys.exit(1)

    file_key = sys.argv[1]
    node_id = sys.argv[2].replace("-", ":")
    detail = "--detail" in sys.argv

    print(f"Fetching node info for {file_key} / {node_id}...")
    if detail:
        print("(Detail mode: including colors, padding, spacing)")
    print("")

    try:
        result = get_node_info(token, file_key, node_id)
        nodes = result.get("nodes", {})
        node_key = node_id.replace("-", ":")

        if node_key in nodes:
            node_data = nodes[node_key]
            document = node_data.get("document", {})

            print("=== Node Structure ===")
            print("")
            coordinates = extract_coordinates(document, detail=detail)

            print("")
            print(f"=== Summary ===")
            print(f"Total elements: {len(coordinates)}")

            if detail and coordinates:
                issues = analyze_design_issues(coordinates)
                if issues:
                    print("")
                    print("=== Design Analysis ===")
                    for i, issue in enumerate(issues, 1):
                        print(f"{i}. [{issue['type'].upper()}] {issue['message']}")
                        if issue.get('details'):
                            print(f"   例: {', '.join(str(d) for d in issue['details'][:3])}")
        else:
            print(f"Node {node_id} not found in response")
            print(f"Available keys: {list(nodes.keys())}")

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
