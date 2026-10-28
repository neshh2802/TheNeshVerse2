#!/usr/bin/env python3
"""Lightweight static integrity checks for TheNeshVerse (Python standard library only)."""
from html.parser import HTMLParser
from pathlib import Path
import json, re, sys, urllib.parse

ROOT = Path(__file__).resolve().parents[1]

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.assets, self.title_parts = [], [], []
        self.in_title = False
        self.h1_count = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("a", "link") and a.get("href"): self.links.append(a["href"])
        if tag in ("img", "script", "source") and a.get("src"): self.assets.append(a["src"])
        if tag == "title": self.in_title = True
        if tag == "h1": self.h1_count += 1
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
    def handle_data(self, data):
        if self.in_title: self.title_parts.append(data)

def main():
    pages = sorted(ROOT.glob("*.html"))
    assert pages, "No HTML pages found"
    errors, titles = [], {}
    vercel = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    rewrites = {r["source"]: r["destination"] for r in vercel.get("rewrites", [])}
    for page in pages:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        title = "".join(parser.title_parts).strip()
        if not title: errors.append(f"{page.name}: missing title")
        elif title in titles: errors.append(f"{page.name}: duplicate title also used by {titles[title]}")
        else: titles[title] = page.name
        if parser.h1_count != 1: errors.append(f"{page.name}: expected 1 h1, found {parser.h1_count}")
        for url in parser.assets:
            if url.startswith(("http:", "https:", "//", "data:")): continue
            path = urllib.parse.urlparse(url).path.lstrip("/")
            if path and not (ROOT / urllib.parse.unquote(path)).exists():
                errors.append(f"{page.name}: missing asset {url}")
        for url in parser.links:
            if url.startswith(("http:", "https:", "//", "mailto:", "tel:", "javascript:", "#", "data:")): continue
            path = urllib.parse.unquote(urllib.parse.urlparse(url).path)
            if not path: continue
            if path.startswith("/"):
                if path in rewrites: path = rewrites[path].lstrip("/")
                else: path = path.lstrip("/")
            else:
                path = str((page.parent / path).resolve().relative_to(ROOT.resolve())) if (page.parent / path).resolve().is_relative_to(ROOT.resolve()) else path
            target = ROOT / path
            if target.exists() or (not target.suffix and (ROOT / (path + ".html")).exists()): continue
            if path == "" or path == ".": continue
            errors.append(f"{page.name}: unresolved local link {url}")
        raw = page.read_text(encoding="utf-8", errors="replace")
        for block in re.findall(r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script\s*>', raw, re.I | re.S):
            try: json.loads(block)
            except Exception as exc: errors.append(f"{page.name}: invalid JSON-LD ({exc})")
    print(f"HTML pages checked: {len(pages)}")
    print(f"Unique titles: {len(titles)}")
    if errors:
        print(f"FAIL: {len(errors)} issue(s)")
        print("\n".join(f"- {e}" for e in errors))
        return 1
    print("PASS: titles, h1 counts, local assets/links, and JSON-LD")
    return 0
if __name__ == "__main__":
    sys.exit(main())
