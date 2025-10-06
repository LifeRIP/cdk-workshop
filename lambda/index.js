// if it's .js, need to add !lambda/*.js to .gitignore

exports.handler = async function (event) {
  console.log('Request:', JSON.stringify(event, undefined, 2))
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, CDK! You've hit ${event.path}\n`,
  }
}