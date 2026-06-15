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

export async function vote(topicId, direction, sessionToken) {
  const appId = import.meta.env.VITE_PARSE_APP_ID;
  const jsKey = import.meta.env.VITE_PARSE_JS_KEY;
  const serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'https://parseapi.back4app.com';

  // Check if user already voted
  const queryRes = await fetch(
    `${serverURL}/classes/Vote?where=${encodeURIComponent(JSON.stringify({ topicId, userId: sessionToken }))}`,
    {
      headers: {
        'X-Parse-Application-Id': appId,
        'X-Parse-JavaScript-Key': jsKey,
      },
    }
  );
  const queryData = await queryRes.json();

  if (queryData.results.length > 0) {
    // Update existing vote
    const existingVote = queryData.results[0];
    if (existingVote.direction === direction) {
      // Remove vote if same direction
      await fetch(`${serverURL}/classes/Vote/${existingVote.objectId}`, {
        method: 'DELETE',
        headers: {
          'X-Parse-Application-Id': appId,
          'X-Parse-JavaScript-Key': jsKey,
          'X-Parse-Session-Token': sessionToken,
        },
      });
      return { action: 'removed', direction };
    } else {
      // Change direction
      await fetch(`${serverURL}/classes/Vote/${existingVote.objectId}`, {
        method: 'PUT',
        headers: {
          'X-Parse-Application-Id': appId,
          'X-Parse-JavaScript-Key': jsKey,
          'X-Parse-Session-Token': sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction }),
      });
      return { action: 'changed', direction };
    }
  } else {
    // Create new vote
    await fetch(`${serverURL}/classes/Vote`, {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': appId,
        'X-Parse-JavaScript-Key': jsKey,
        'X-Parse-Session-Token': sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topicId, userId: sessionToken, direction }),
    });
    return { action: 'created', direction };
  }
}

export async function updateTopicVotes(topicId, upDelta, downDelta, sessionToken) {
  const appId = import.meta.env.VITE_PARSE_APP_ID;
  const jsKey = import.meta.env.VITE_PARSE_JS_KEY;
  const serverURL = import.meta.env.VITE_PARSE_SERVER_URL || 'https://parseapi.back4app.com';

  // Fetch current topic
  const res = await fetch(`${serverURL}/classes/Topic/${topicId}`, {
    headers: {
      'X-Parse-Application-Id': appId,
      'X-Parse-JavaScript-Key': jsKey,
    },
  });
  const topic = await res.json();

  // Update vote counts
  await fetch(`${serverURL}/classes/Topic/${topicId}`, {
    method: 'PUT',
    headers: {
      'X-Parse-Application-Id': appId,
      'X-Parse-JavaScript-Key': jsKey,
      'X-Parse-Session-Token': sessionToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      up: Math.max(0, topic.up + upDelta),
      down: Math.max(0, topic.down + downDelta),
    }),
  });
}
