export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API proxy endpoint
    if (url.pathname === '/api/football') {
      const path = url.searchParams.get('path') || '/status';
      try {
        const response = await fetch('https://v3.football.api-sports.io' + path, {
          headers: { 'x-apisports-key': env.FOOTBALL_API_KEY }
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // Static files — pass through to Pages assets
    return env.ASSETS.fetch(request);
  }
};
