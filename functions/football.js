export async function onRequest(context) {
  const apiKey = context.env.FOOTBALL_API_KEY;
  const url = new URL(context.request.url);
  const path = url.searchParams.get('path') || '/status';

  try {
    const response = await fetch('https://v3.football.api-sports.io' + path, {
      headers: { 'x-apisports-key': apiKey }
    });
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
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
