#!/usr/bin/env python3
"""
Migrate blog posts from WordPress to Payload CMS.
Uses Playwright to bypass Incapsula bot protection, then creates posts and comments
via Payload's REST API.
"""

import json
import re
import os
import sys
import time
import requests
from playwright.sync_api import sync_playwright

# Configuration
WP_API = 'http://longislandsextherapy.com/wp-json/wp/v2'
PAYLOAD_API = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
PAYLOAD_USER = os.environ.get('PAYLOAD_USER', '')
PAYLOAD_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', '')

# WordPress author ID for Dr. Pinhas
WP_AUTHOR_ID = 2


def strip_html(html):
    """Remove HTML tags and decode entities for excerpts."""
    text = re.sub(r'<[^>]*>', '', html)
    text = text.replace('&nbsp;', ' ')
    text = text.replace('&#8217;', "'")
    text = text.replace('&#8220;', '"')
    text = text.replace('&#8221;', '"')
    text = text.replace('&#8211;', '-')
    text = text.replace('&#8212;', '--')
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&#039;', "'")
    text = text.replace('&quot;', '"')
    text = text.replace('&#8230;', '...')
    # Remove Read More suffix
    text = re.sub(r'\[.*?\]|Read More.*$', '', text)
    return text.strip()


def decode_html_entities(text):
    """Decode common HTML entities."""
    text = text.replace('&nbsp;', ' ')
    text = text.replace('&#8217;', "'")
    text = text.replace('&#8220;', '"')
    text = text.replace('&#8221;', '"')
    text = text.replace('&#8211;', '-')
    text = text.replace('&#8212;', '--')
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&#039;', "'")
    text = text.replace('&quot;', '"')
    text = text.replace('&#8230;', '...')
    return text


def fetch_posts_via_browser():
    """Use Playwright to bypass Incapsula and fetch posts from WordPress API."""
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
        return posts


def payload_login():
    """Login to Payload CMS and return a JWT token."""
    if not PAYLOAD_USER or not PAYLOAD_PASSWORD:
        print('No Payload credentials provided, will use local API without auth')
        return None

    response = requests.post(
        f'{PAYLOAD_API}/users/login',
        json={'email': PAYLOAD_USER, 'password': PAYLOAD_PASSWORD}
    )
    if response.status_code == 200:
        token = response.json().get('token')
        print('Logged in to Payload CMS')
        return token
    else:
        print(f'Failed to login: {response.status_code} {response.text}')
        return None


def find_or_create_category(token, name, slug):
    """Find or create a category in Payload CMS."""
    headers = {}
    if token:
        headers['Authorization'] = f'JWT {token}'

    # Check if category exists
    response = requests.get(
        f'{PAYLOAD_API}/categories',
        headers=headers,
        params={'where[slug][equals]': slug, 'limit': 1}
    )
    if response.status_code == 200:
        docs = response.json().get('docs', [])
        if docs:
            print(f'Category "{name}" already exists (ID: {docs[0]["id"]})')
            return str(docs[0]['id'])

    # Create category
    response = requests.post(
        f'{PAYLOAD_API}/categories',
        headers=headers,
        json={'title': name, 'slug': slug}
    )
    if response.status_code in (200, 201):
        cat_id = str(response.json()['doc']['id'])
        print(f'Created category "{name}" (ID: {cat_id})')
        return cat_id
    else:
        print(f'Failed to create category: {response.status_code} {response.text}')
        return None


def find_existing_post(token, slug):
    """Check if a post already exists by slug."""
    headers = {}
    if token:
        headers['Authorization'] = f'JWT {token}'

    response = requests.get(
        f'{PAYLOAD_API}/posts',
        headers=headers,
        params={'where[slug][equals]': slug, 'limit': 1}
    )
    if response.status_code == 200:
        docs = response.json().get('docs', [])
        if docs:
            return True
    return False


def create_post(token, post_data):
    """Create a post in Payload CMS."""
    headers = {}
    if token:
        headers['Authorization'] = f'JWT {token}'

    response = requests.post(
        f'{PAYLOAD_API}/posts',
        headers=headers,
        json=post_data
    )
    if response.status_code in (200, 201):
        return response.json()['doc']
    else:
        print(f'Failed to create post: {response.status_code}')
        print(f'Response: {response.text[:500]}')
        return None


def create_comment(token, comment_data):
    """Create a comment in Payload CMS."""
    headers = {}
    if token:
        headers['Authorization'] = f'JWT {token}'

    response = requests.post(
        f'{PAYLOAD_API}/comments',
        headers=headers,
        json=comment_data
    )
    if response.status_code in (200, 201):
        return response.json()['doc']
    else:
        print(f'Failed to create comment: {response.status_code}')
        print(f'Response: {response.text[:500]}')
        return None


def main():
    # Step 1: Fetch posts from WordPress
    posts = fetch_posts_via_browser()

    # Save raw data for debugging
    with open('/tmp/wp_posts_raw.json', 'w') as f:
        json.dump(posts, f)
    print(f'Saved raw data to /tmp/wp_posts_raw.json')

    # Step 2: Login to Payload
    token = payload_login()

    # Step 3: Extract and create categories
    category_map = {}  # wp_id -> name
    for post in posts:
        if '_embedded' in post and 'wp:term' in post['_embedded']:
            for term_group in post['_embedded']['wp:term']:
                for term in term_group:
                    if term['taxonomy'] == 'category':
                        category_map[term['id']] = term['name']

    print(f'\nFound categories: {category_map}')

    payload_category_map = {}  # wp_id -> payload_id
    for wp_id, name in category_map.items():
        slug = re.sub(r'[^a-z0-9-]', '', name.lower().replace(' ', '-'))
        cat_id = find_or_create_category(token, name, slug)
        if cat_id:
            payload_category_map[wp_id] = cat_id

    # Step 4: Process each post
    for post in posts:
        title = decode_html_entities(post['title']['rendered'])
        slug = post['slug']
        print(f'\nProcessing: {title}')

        # Check if post already exists
        if find_existing_post(token, slug):
            print(f'  Post already exists, skipping')
            continue

        # Get content HTML - we'll pass it as-is and let Payload handle it
        # Payload's richText field accepts HTML through the admin panel
        # For REST API, we need to convert to Lexical format
        # Since we can't easily convert HTML to Lexical from Python,
        # we'll store the content as a simple Lexical structure
        content_html = post['content']['rendered']

        # Create a simple Lexical structure with the HTML content
        # Payload's RichText field expects Lexical JSON
        # We'll create paragraphs from the HTML content
        # For now, store the entire content as a single paragraph with the raw text
        # The content will be properly converted later via the admin panel
        content_text = strip_html(content_html)

        # Create Lexical JSON structure
        lexical_content = {
            'root': {
                'type': 'root',
                'format': '',
                'indent': 0,
                'version': 1,
                'children': [
                    {
                        'type': 'paragraph',
                        'format': '',
                        'indent': 0,
                        'version': 1,
                        'children': [
                            {
                                'type': 'text',
                                'format': 0,
                                'version': 1,
                                'text': content_text,
                            }
                        ],
                    }
                ],
            }
        }

        # Create excerpt
        excerpt = strip_html(post['excerpt']['rendered'])
        if len(excerpt) > 200:
            excerpt = excerpt[:200] + '...'

        # Get primary category
        primary_cat_id = post['categories'][0] if post['categories'] else None
        payload_cat_id = payload_category_map.get(primary_cat_id)

        # Create post data
        post_data = {
            'title': title,
            'slug': slug,
            'content': lexical_content,
            'excerpt': excerpt,
            'publishedAt': post['date'],
            '_status': 'published',
        }

        if payload_cat_id:
            post_data['category'] = payload_cat_id

        # Create the post
        created_post = create_post(token, post_data)
        if not created_post:
            print(f'  Failed to create post')
            continue

        print(f'  Created post (ID: {created_post["id"]})')

        # Process comments
        comments = []
        if '_embedded' in post and 'replies' in post['_embedded']:
            comments = post['_embedded']['replies'][0] if post['_embedded']['replies'] else []

        if comments:
            print(f'  Processing {len(comments)} comments')

            # Sort by date (oldest first) for parent linking
            sorted_comments = sorted(comments, key=lambda c: c['date'])

            comment_id_map = {}  # wp_comment_id -> payload_comment_id

            for comment in sorted_comments:
                is_author_reply = comment.get('author') == WP_AUTHOR_ID
                comment_content = decode_html_entities(strip_html(comment['content']['rendered']))

                comment_data = {
                    'post': str(created_post['id']),
                    'authorName': comment['author_name'],
                    'content': comment_content,
                    'createdAt': comment['date'],
                    'isAuthorReply': is_author_reply,
                }

                # Link to parent comment
                parent = comment.get('parent', 0)
                if parent and parent in comment_id_map:
                    comment_data['parentComment'] = comment_id_map[parent]

                created_comment = create_comment(token, comment_data)
                if created_comment:
                    comment_id_map[comment['id']] = str(created_comment['id'])
                    print(f'    Created comment by {comment["author_name"]} ({comment["date"]})')

        print(f'  Done: {title}')

    print('\n=== Migration complete ===')


if __name__ == '__main__':
    main()
