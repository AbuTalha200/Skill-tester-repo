import re, json, sys

html = open('channel.html', encoding='utf-8').read()
patterns = [
    (r'"description":"((?:[^"\\]|\\.)*?)"', 'description'),
    (r'"channelId":"([^"]+)"', 'channelId'),
    (r'"subscriberCountText":"([^"]+)"', 'subs'),
    (r'"videosCountText":"([^"]+)"', 'videoCount'),
    (r'"keywords":"([^"]+)"', 'keywords'),
]
for pat, name in patterns:
    m = re.findall(pat, html)
    if m:
        print(name, m[:3])

m = re.search(r'var ytInitialData = ({.*?});</script>', html, re.S)
print('ytInitialData found:', bool(m))
if m:
    data = json.loads(m.group(1))
    open('initial_data.json', 'w', encoding='utf-8').write(json.dumps(data, indent=1))
    tabs = data.get('contents', {}).get('twoColumnBrowseResultsRenderer', {}).get('tabs', [])
    print('tabs:', [t.get('tabRenderer', {}).get('title') for t in tabs])
    hdr = data.get('header', {})
    print('header keys:', list(hdr.keys()))
    print(json.dumps(hdr, indent=1)[:4000])
