Parse.Cloud.define('ingestRSS', async (request) => {
  const { source, url } = request.params;
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Simple RSS XML parsing
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(text)) !== null) {
      const itemContent = match[1];
      const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
      const descriptionMatch = itemContent.match(/<description>(.*?)<\/description>/);
      
      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, ''),
          link: linkMatch[1],
          pubDate: pubDateMatch ? pubDateMatch[1] : null,
          description: descriptionMatch ? descriptionMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '') : '',
        });
      }
    }
    
    // Process items and create/update Topics
    const Topic = Parse.Object.extend('Topic');
    const results = [];
    
    for (const item of items.slice(0, 10)) { // Limit to 10 items per run
      const query = new Parse.Query(Topic);
      query.equalTo('title', item.title);
      const existing = await query.first();
      
      if (!existing) {
        const topic = new Topic();
        topic.set('title', item.title);
        topic.set('category', getCategory(source));
        topic.set('source', source);
        topic.set('age', formatAge(item.pubDate));
        topic.set('up', 0);
        topic.set('down', 0);
        topic.set('comments', 0);
        topic.set('summary', item.description.substring(0, 200));
        await topic.save();
        results.push({ title: item.title, action: 'created' });
      } else {
        results.push({ title: item.title, action: 'skipped' });
      }
    }
    
    return { success: true, processed: results.length, results };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

function getCategory(source) {
  const categories = {
    'BBC': 'Politics',
    'TechCrunch': 'Technology',
    'ESPN': 'Sports',
    'Reuters': 'Business',
    'Nature': 'Science',
    'Variety': 'Entertainment',
  };
  return categories[source] || 'General';
}

function formatAge(pubDate) {
  if (!pubDate) return 'Just now';
  const date = new Date(pubDate);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60); // minutes
  
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}
