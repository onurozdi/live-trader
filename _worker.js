export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Football API proxy ────────────────────────────────────────────────────
    if (url.pathname === '/api/football') {
      const path = url.searchParams.get('path') || '/status';
      try {
        const response = await fetch('https://v3.football.api-sports.io' + path, {
          headers: { 'x-apisports-key': env.FOOTBALL_API_KEY }
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // ── Polymarket API proxy ──────────────────────────────────────────────────
    if (url.pathname === '/api/polymarket') {
      const query  = url.searchParams.get('query') || '';
      const action = url.searchParams.get('action') || 'search';

      let pmUrl;
      if (action === 'search') {
        // Search active soccer markets by team name
        pmUrl = `https://gamma-api.polymarket.com/events?active=true&closed=false&limit=50&order=volume&ascending=false&tag_slug=soccer`;
      } else if (action === 'market') {
        const slug = url.searchParams.get('slug') || '';
        pmUrl = `https://gamma-api.polymarket.com/markets?slug=${encodeURIComponent(slug)}`;
      }

      try {
        const response = await fetch(pmUrl, {
          headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // ── Static files ──────────────────────────────────────────────────────────
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Not found', { status: 404 });
  }
};
