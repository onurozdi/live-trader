exports.handler = async function(event) {
  const apiKey = process.env.FOOTBALL_API_KEY;
  const path = event.queryStringParameters.path || '/status';

  try {
    const response = await fetch('https://v3.football.api-sports.io' + path, {
      headers: { 'x-apisports-key': apiKey }
    });
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
