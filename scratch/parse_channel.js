const fs = require('fs');
const html = fs.readFileSync('channel.html', 'utf8');
const forMatches = [
  ['description', '"description":"'],
  ['channelId', '"channelId":"'],
  ['subscriberCountText', '"subscriberCountText":"'],
  ['videosCountText', '"videosCountText":"'],
  ['keywords', '"keywords":"'],
];
for (const [name, pat] of forMatches) {
  let idx = 0, found = [];
  while ((idx = html.indexOf(pat, idx)) !== -1) {
    let start = idx + pat.length, end = html.indexOf('"', start);
    found.push(html.slice(start, end));
    idx += pat.length;
  }
  if (found.length) console.log(name + ':', found.slice(0, 3).join(' | '));
}
const marker = 'var ytInitialData = ';
const mi = html.indexOf(marker);
if (mi !== -1) {
  const start = mi + marker.length;
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) { esc = false; }
      else if (c === '\\') { esc = true; }
      else if (c === '"') { inStr = false; }
    } else {
      if (c === '"') inStr = true;
      else if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
    }
  }
  const data = JSON.parse(html.slice(start, end));
  fs.writeFileSync('initial_data.json', JSON.stringify(data, null, 1));
  const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.map(t => t.tabRenderer?.title);
  console.log('tabs:', tabs);
  console.log('header keys:', Object.keys(data?.header || {}));
  console.log(JSON.stringify(data?.header || {}, null, 1).slice(0, 4000));
}
