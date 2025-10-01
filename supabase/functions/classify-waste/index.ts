import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Sending image to Gemini for classification...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this waste image and classify each item you can identify into one of these categories: recyclable (clean plastic bottles, cans, glass, paper), organic (food scraps, peels, shells), landfill (used tissue, dirty cloth, unrecyclable plastics), or hazardous (batteries, electronics, sharp objects). For each item, provide a generic description without brand names and a confidence score. Keep descriptions simple and clear.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'classify_waste',
              description: 'Return waste classification results for all items detected in the image',
              parameters: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        category: {
                          type: 'string',
                          enum: ['recyclable', 'organic', 'landfill', 'hazardous']
                        },
                        confidence: {
                          type: 'number',
                          description: 'Confidence score from 0-100'
                        },
                        description: {
                          type: 'string',
                          description: 'Brief generic description of the item without brand names'
                        }
                      },
                      required: ['category', 'confidence', 'description']
                    }
                  },
                  tips: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'General waste disposal tips relevant to the items detected'
                  }
                },
                required: ['items', 'tips']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'classify_waste' } }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI usage limit reached. Please add credits to continue.');
      }
      
      throw new Error('Failed to classify waste');
    }

    const data = await response.json();
    console.log('Received response from Gemini');

    // Extract the structured output from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No classification result returned');
    }

    const classification = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(classification),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in classify-waste function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
