// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.


// https://spacenews.com/ursa-major-wins-28-5-million-air-force-contract-to-flight-test-draper-engine-for-hypersonic-use/
// https://breakingdefense.com/2025/05/ursa-major-looks-to-fly-draper-engine-takes-aim-at-rocket-engine-markets/
// https://executivebiz.com/2025/05/ursa-major-wins-afrl-contract-to-demonstrate-draper/
// https://www.defensedaily.com/air-force-taps-ursa-major-to-integrate-tactical-flight-demonstrator-for-hypersonic-uses/air-force/
// https://www.ursamajor.com/media/press-release/afrl-awards-ursa-major-usd28-6m-contract
// https://www.airforce-technology.com/news/ursa-afrl-deal-hypersonics/


// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/research-event' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
