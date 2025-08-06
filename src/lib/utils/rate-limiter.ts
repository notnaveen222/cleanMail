// Rate limiter utility for managing API calls
export class RateLimiter {
  private lastRequestTime = 0;
  private requestCount = 0;
  private windowStart = Date.now();
  
  constructor(
    private maxRequestsPerMinute: number = 50,
    private minIntervalMs: number = 100
  ) {}
  
  async waitForNextRequest(): Promise<void> {
    const now = Date.now();
    
    // Reset window if a minute has passed
    if (now - this.windowStart >= 60000) {
      this.requestCount = 0;
      this.windowStart = now;
    }
    
    // Check if we're within rate limits
    if (this.requestCount >= this.maxRequestsPerMinute) {
      const waitTime = 60000 - (now - this.windowStart);
      console.log(`Rate limit reached. Waiting ${waitTime}ms for next window`);
      await this.wait(waitTime);
      this.requestCount = 0;
      this.windowStart = Date.now();
    }
    
    // Ensure minimum interval between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minIntervalMs) {
      await this.wait(this.minIntervalMs - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }
  
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Get current usage stats
  getUsageStats() {
    const now = Date.now();
    const windowElapsed = now - this.windowStart;
    const remainingRequests = Math.max(0, this.maxRequestsPerMinute - this.requestCount);
    const timeUntilReset = Math.max(0, 60000 - windowElapsed);
    
    return {
      requestsUsed: this.requestCount,
      requestsRemaining: remainingRequests,
      timeUntilReset,
      windowElapsed
    };
  }
}

// Global rate limiter instance for GPT API
export const gptRateLimiter = new RateLimiter(40, 150); // 40 requests per minute, 150ms min interval

// Utility function for exponential backoff
export function getExponentialBackoffDelay(attempt: number, baseDelay: number = 1000): number {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
}

// Utility function for retry logic
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Handle rate limiting specifically
      if (error?.status === 429) {
        const retryAfter = error.headers?.['retry-after'] || error.headers?.['retry-after-ms'];
        const waitTime = retryAfter ? parseInt(retryAfter) : getExponentialBackoffDelay(attempt, baseDelay);
        
        console.log(`Rate limit hit (attempt ${attempt + 1}/${maxRetries + 1}). Waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Handle other errors with exponential backoff
      const delay = getExponentialBackoffDelay(attempt, baseDelay);
      console.log(`Error (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries reached');
} 