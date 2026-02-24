"""
Scrape portfolio projects from Upwork profile via OAuth + GraphQL.

Profile: https://www.upwork.com/freelancers/badarm19

Usage:
  1. Set env: UPWORK_CLIENT_ID, UPWORK_CLIENT_SECRET, UPWORK_REDIRECT_URI
  2. Run: python scrap.py
  3. Open the printed URL, sign in as the profile owner (badarm19), authorize
  4. Paste the `code` from the redirect URL
  5. Script writes normalized JSON to --output (default: src/data/portfolio.json)

Optional:
  python scrap.py --output public/data/portfolio.json
  python scrap.py --code "paste_code_here"   # non-interactive
"""
import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode

import requests

# ---------------------------------------------------------------------------
# Config from env
# ---------------------------------------------------------------------------
CLIENT_ID = os.environ.get("UPWORK_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("UPWORK_CLIENT_SECRET", "")
REDIRECT_URI = os.environ.get("UPWORK_REDIRECT_URI", "")

AUTH_URL = "https://www.upwork.com/ab/account-security/oauth2/authorize"
TOKEN_URL = "https://www.upwork.com/api/v3/oauth2/token"
GQL_URL = "https://api.upwork.com/graphql"

PROFILE_URL = "https://www.upwork.com/freelancers/badarm19"


def build_authorize_url(state: str = "xyz") -> str:
    params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "state": state,
    }
    return f"{AUTH_URL}?{urlencode(params)}"


def exchange_code_for_token(code: str) -> dict:
    data = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code.strip(),
        "redirect_uri": REDIRECT_URI,
    }
    r = requests.post(TOKEN_URL, data=data, timeout=30)
    r.raise_for_status()
    return r.json()


def gql_request(
    access_token: str,
    query: str,
    variables: dict | None = None,
    tenant_id: str | None = None,
) -> dict:
    headers = {
        "Authorization": f"bearer {access_token}",
        "Content-Type": "application/json",
    }
    if tenant_id:
        headers["X-Upwork-API-TenantId"] = tenant_id
    payload = {"query": query, "variables": variables or {}}
    r = requests.post(GQL_URL, headers=headers, json=payload, timeout=30)
    r.raise_for_status()
    return r.json()


def get_tenant_id(access_token: str) -> str | None:
    q = """
    query {
      companySelector {
        items { title organizationId }
      }
    }
    """
    data = gql_request(access_token, q)
    items = (data.get("data") or {}).get("companySelector", {}).get("items") or []
    return str(items[0]["organizationId"]) if items else None


def get_portfolio_raw(access_token: str, tenant_id: str | None) -> dict:
    q = """
    query {
      user {
        talentProfile {
          projectList {
            totalProjects
            projects {
              id
              title
              description
              thumbnail
              thumbnailOriginal
              projectUrl
              attachments {
                id
                type
                title
                description
                imageSmall
                imageMiddle
                imageLarge
                link
              }
            }
          }
        }
      }
    }
    """
    data = gql_request(access_token, q, tenant_id=tenant_id)
    return (
        (data.get("data") or {})
        .get("user", {})
        .get("talentProfile", {})
        .get("projectList", {})
    )


def collect_images(project: dict) -> list[str]:
    """Collect all image URLs for a project (thumbnail + attachments), deduped order."""
    seen = set()
    out = []

    def add(url: str | None) -> None:
        if url and url.strip() and url not in seen:
            seen.add(url)
            out.append(url.strip())

    add(project.get("thumbnailOriginal"))
    add(project.get("thumbnail"))
    for att in project.get("attachments") or []:
        add(att.get("imageLarge"))
        add(att.get("imageMiddle"))
        add(att.get("imageSmall"))
        add(att.get("link"))
    return out


def normalize_for_web(raw: dict) -> dict:
    """Normalize API response to a single structure for the website."""
    projects = raw.get("projects") or []
    normalized = []
    for p in projects:
        images = collect_images(p)
        normalized.append({
            "id": p.get("id"),
            "title": (p.get("title") or "").strip(),
            "description": (p.get("description") or "").strip(),
            "projectUrl": (p.get("projectUrl") or "").strip(),
            "images": images,
        })
    return {
        "source": "upwork",
        "profileUrl": PROFILE_URL,
        "fetchedAt": datetime.now(tz=timezone.utc).isoformat(),
        "totalProjects": raw.get("totalProjects", len(normalized)),
        "projects": normalized,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch Upwork portfolio and save JSON")
    parser.add_argument(
        "--output", "-o",
        default=str(Path(__file__).resolve().parent.parent / "data" / "portfolio.json"),
        help="Output JSON path (default: src/data/portfolio.json)",
    )
    parser.add_argument("--code", "-c", help="OAuth code (skip interactive prompt)")
    args = parser.parse_args()

    if not CLIENT_ID or not CLIENT_SECRET or not REDIRECT_URI:
        print("Set UPWORK_CLIENT_ID, UPWORK_CLIENT_SECRET, UPWORK_REDIRECT_URI", file=sys.stderr)
        sys.exit(1)

    code = args.code
    if not code:
        print("1) Open this URL in your browser and authorize (use the profile owner account):")
        print(build_authorize_url())
        print("\n2) After redirect, paste the `code` query parameter here:")
        code = input("code = ").strip()
    if not code:
        print("No code provided.", file=sys.stderr)
        sys.exit(1)

    tokens = exchange_code_for_token(code)
    access_token = tokens["access_token"]
    tenant_id = get_tenant_id(access_token)
    raw = get_portfolio_raw(access_token, tenant_id)
    payload = normalize_for_web(raw)

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(payload['projects'])} projects to {out_path}")
    for i, p in enumerate(payload["projects"], 1):
        print(f"  {i}. {p['title'][:50] or '(no title)'} ... ({len(p['images'])} images)")


if __name__ == "__main__":
    main()
