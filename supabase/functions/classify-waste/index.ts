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
    const { image, language = 'english', location } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }
    
    const hasLocation = location && location.city && location.state;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Sending image to Gemini for classification...');

    const languageMap: Record<string, string> = {
      'hindi': 'Hindi (हिन्दी)',
      'bengali': 'Bengali (বাংলা)',
      'telugu': 'Telugu (తెలుగు)',
      'tamil': 'Tamil (தமிழ்)',
      'english': 'English'
    };
    
    const selectedLanguage = languageMap[language] || 'English';
    const languageInstruction = language !== 'english' 
      ? ` Provide ALL responses (item descriptions and disposal tips) in ${selectedLanguage}.`
      : '';
    
    const locationContext = hasLocation 
      ? `\n\nUser location: ${location.city}, ${location.state}, India`
      : '';
    
    const plasticInstructions = hasLocation
      ? `\n\nIf any plastic waste is detected:
1. Identify the plastic type (PET, HDPE, LDPE, PP, PS, PVC, or Other)
2. Suggest 2-3 upcycling or reuse ideas suitable for citizens
3. Recommend 2-3 local NGOs, recyclers, or municipal centers in or near ${location.city}, ${location.state} that handle plastic waste. Include realistic organization names and general addresses.`
      : '';

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
                text: `Analyze this waste image and classify each item into categories: plastic, recyclable, organic, landfill, or hazardous. For each item, provide a generic description without brand names and a confidence score.${locationContext}${plasticInstructions}${languageInstruction}`
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
                          enum: ['plastic', 'recyclable', 'organic', 'landfill', 'hazardous']
                        },
                        confidence: {
                          type: 'number',
                          description: 'Confidence score from 0-100'
                        },
                        description: {
                          type: 'string',
                          description: 'Brief generic description of the item without brand names'
                        },
                        plasticType: {
                          type: 'string',
                          description: 'Type of plastic if category is plastic (PET, HDPE, LDPE, PP, PS, PVC, Other)'
                        }
                      },
                      required: ['category', 'confidence', 'description']
                    }
                  },
                  tips: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'General waste disposal tips relevant to the items detected'
                  },
                  plasticType: {
                    type: 'string',
                    description: 'Overall plastic type if plastic detected'
                  },
                  upcyclingIdeas: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Upcycling or reuse ideas for plastic waste'
                  },
                  nearbyCenters: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        type: { type: 'string' },
                        address: { type: 'string' }
                      }
                    },
                    description: 'Local recycling centers, NGOs, or municipal facilities'
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
