// utils/withRetry.ts

export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000 // Délai entre les essais (optionnel)
  ): Promise<T> {
    let lastError;
  
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        console.warn(`⚠️ Tentative ${attempt} échouée :`, error);
        lastError = error;
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, delayMs));
        }
      }
    }
  
    throw lastError;
  }
  