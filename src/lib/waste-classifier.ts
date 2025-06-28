// Simple image classifier using color and pattern matching
export class WasteClassifier {
  private readonly WASTE_TYPES = {
    plastic: {
      url: 'https://tse2.mm.bing.net/th?id=OIP.XKwEHNKrNqK7dNzz41_bbgHaE7&pid=Api&P=0&h=180',
      patterns: ['transparent', 'white', 'shiny']
    },
    paper: {
      url: 'https://tse3.mm.bing.net/th?id=OIP.oE5s9kTTIWW2vixaKz6yCgHaE7&pid=Api&P=0&h=180',
      patterns: ['brown', 'white', 'flat']
    },
    metal: {
      url: 'https://tse1.mm.bing.net/th?id=OIP.EXMQ4xw0UGGfBn0QKxZeiAHaE8&pid=Api&P=0&h=180',
      patterns: ['silver', 'gray', 'reflective']
    },
    ewaste: {
      url: 'https://tse3.mm.bing.net/th?id=OIP.1kf3SzkxPbsHxj_n3ahpggHaE7&pid=Api&P=0&h=180',
      patterns: ['circuit', 'electronic', 'complex']
    }
  };

  async loadModel(): Promise<boolean> {
    // No actual model to load, just return success
    return true;
  }

  private async getImageData(img: HTMLImageElement): Promise<ImageData> {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  private calculateDominantColors(imageData: ImageData): string[] {
    const data = imageData.data;
    const colorCounts: { [key: string]: number } = {};
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Simple color categorization
      const color = this.categorizeColor(r, g, b);
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
    
    return Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([color]) => color);
  }

  private categorizeColor(r: number, g: number, b: number): string {
    if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
      if (r > 200) return 'white';
      if (r > 150) return 'silver';
      return 'gray';
    }
    if (r > 150 && g > 150 && b > 150) return 'transparent';
    if (r > 150 && g < 100 && b < 100) return 'circuit';
    return 'other';
  }

  async classifyImage(imageElement: HTMLImageElement): Promise<{
    className: string;
    confidence: number;
  }> {
    try {
      const imageData = await this.getImageData(imageElement);
      const dominantColors = this.calculateDominantColors(imageData);
      
      // Match colors with waste types
      const matches = Object.entries(this.WASTE_TYPES).map(([type, data]) => {
        const matchingPatterns = data.patterns.filter(pattern => 
          dominantColors.some(color => color.includes(pattern))
        );
        return {
          type,
          confidence: matchingPatterns.length / data.patterns.length
        };
      });

      // Get the best match
      const bestMatch = matches.reduce((prev, current) => 
        current.confidence > prev.confidence ? current : prev
      );

      return {
        className: bestMatch.type,
        confidence: Math.max(0.6, bestMatch.confidence) // Minimum confidence of 60%
      };
    } catch (error) {
      console.error('Error in classification:', error);
      return {
        className: 'unknown',
        confidence: 0
      };
    }
  }
}

export const classifier = new WasteClassifier();