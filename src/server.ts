import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Truck Route Analysis using High Thinking Mode
  app.post('/api/ai/analyze-route', async (req, res) => {
    try {
      const { waypoints, truckProfile } = req.body;
      
      const prompt = `Analyze this driving route for a gas company's ground restoration crew (e.g. going to residential addresses to fix landscaping, reseed grass, repair driveways after gas works). The crew travels to up to 150 job sites. 
      The user has provided the following address sequence: \n${waypoints.map((w: any) => "- " + w.address).join('\n')}
      
      Crew Vehicle Profile:
      - Height: ${truckProfile.height}
      - Weight: ${truckProfile.weight}
      - Class: ${truckProfile.class} (Likely carrying heavy landscaping equipment like a skid steer or soil)
      
      Provide a highly detailed analysis focusing on:
      1. Residential Access Hazards: (e.g. low hanging branches, narrow neighborhood streets, sharp turns with a trailer, overhead residential wires)
      2. Parking & Unloading: Considerations for blocking driveways or streets while unloading heavy equipment in residential zones.
      3. Heavy Duty/Bridge warnings: Core constraints regarding weight limits on residential bridges or low overpasses on the main route.
      4. Fuel Optimization: Strategies based on start-stop residential routing with heavy loads.
      
      Return as JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hazards: {
                type: Type.ARRAY,
                description: 'List of potential low bridges, weight restricted areas or sharp turns based on the route and truck constraints.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: '"BRIDGE", "WEIGHT", "TURN", "TRAFFIC"' },
                    description: { type: Type.STRING, description: 'Detailed description of the hazard.' },
                    severity: { type: Type.STRING, description: '"HIGH", "MEDIUM", "LOW"' }
                  }
                }
              },
              fuelOptimization: {
                type: Type.STRING,
                description: 'Detailed strategy for optimizing fuel based on this specific heavy/medium duty truck class and route geography.'
              },
              overallAdvice: {
                type: Type.STRING,
                description: 'General safety and routing advice for the driver.'
              }
            },
            required: ['hazards', 'fuelOptimization', 'overallAdvice']
          }
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      res.json(JSON.parse(text));
    } catch (error) {
      console.error('Error analyzing route:', error);
      res.status(500).json({ error: 'Failed to analyze route.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
