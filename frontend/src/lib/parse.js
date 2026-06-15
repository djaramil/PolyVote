// Load Parse SDK from CDN (browser-compatible)
// The npm 'parse' package is Node.js-only and doesn't work with Vite
export async function fetchTopics() {
  const appId = import.meta.env.VITE_PARSE_APP_ID;
  const jsKey = import.meta.env.VITE_PARSE_JS_KEY;
  const serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'https://parseapi.back4app.com';

  const res = await fetch(`${serverURL}/classes/Topic?order=-createdAt`, {
    headers: {
      'X-Parse-Application-Id': appId,
      'X-Parse-JavaScript-Key': jsKey,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data.results.map((topic) => ({
    id: topic.objectId,
    title: topic.title,
    category: topic.category,
    source: topic.source,
    age: topic.age,
    up: topic.up,
    down: topic.down,
    comments: topic.comments,
    summary: topic.summary,
  }));
}
