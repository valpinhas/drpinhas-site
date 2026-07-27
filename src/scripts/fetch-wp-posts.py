#!/usr/bin/env python3
"""
Fetch blog posts from WordPress API using Playwright to bypass Incapsula.
Saves the data to a JSON file for the TypeScript migration script to process.
"""

import json
from playwright.sync_api import sync_playwright

WP_API = 'http://longislandsextherapy.com/wp-json/wp/v2'
OUTPUT_FILE = '/tmp/wp_posts_data.json'


def main():
    url = f'{WP_API}/posts?categories=6&_embed=1&per_page=100&orderby=date&order=desc'
    print(f'Fetching posts from: {url}')

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()

        # Navigate to main site to get Incapsula cookies
        print('Navigating to main site to bypass Incapsula...')
        page.goto('http://longislandsextherapy.com/', wait_until='domcontentloaded', timeout=15000)
        page.wait_for_timeout(3000)

        # Reload to resolve Incapsula challenge
        print('Reloading to resolve Incapsula challenge...')
        page.reload(wait_until='domcontentloaded', timeout=15000)
        page.wait_for_timeout(5000)
        print(f'Page title: {page.title()}')

        # Fetch API data using JavaScript fetch
        print('Fetching API data...')
        result = page.evaluate('''async (url) => {
            const response = await fetch(url, { credentials: 'include' });
            return { status: response.status, contentType: response.headers.get('content-type'), text: await response.text() };
        }''', url)

        print(f'Status: {result["status"]}')
        print(f'Content-Type: {result["contentType"]}')
        print(f'Response length: {len(result["text"])}')

        browser.close()

        if result['status'] != 200 or 'application/json' not in (result['contentType'] or ''):
            raise Exception(f'Failed to fetch posts: status={result["status"]}, content-type={result["contentType"]}')

        posts = json.loads(result['text'])
        print(f'Fetched {len(posts)} posts')

        # Save to file
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)
        print(f'Saved data to {OUTPUT_FILE}')

        # Print summary
        for post in posts:
            title = post['title']['rendered']
            slug = post['slug']
            date = post['date']
            comments = post.get('_embedded', {}).get('replies', [[]])[0] if post.get('_embedded', {}).get('replies') else []
            print(f'  - "{title}" (slug: {slug}, date: {date}, comments: {len(comments)})')


if __name__ == '__main__':
    main()
