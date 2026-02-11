/**
 * Circuit Breaker Pattern
 * Wraps a potentially failing operation (e.g. an API call). After too many failures,
 * the circuit "opens" and rejects new calls immediately instead of calling the service.
 * After a reset timeout, it allows one trial (half-open); success closes the circuit again.
 */

// Circuit states: CLOSED = normal | OPEN = reject all | HALF_OPEN = allow one trial
const STATE = { CLOSED: "CLOSED", OPEN: "OPEN", HALF_OPEN: "HALF_OPEN" };

class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn; // The async function to protect (e.g. call to external service)
    this.failureThreshold = options.failureThreshold ?? 2; // Open circuit after this many failures
    this.resetTimeout = options.resetTimeout ?? 2000; // ms to wait before trying again (half-open)
    this.state = STATE.CLOSED;
    this.failureCount = 0;
    this.nextAttempt = null; // When we're allowed to try again (when state is OPEN)
  }

  async call(...args) {
    // If circuit is OPEN, reject unless enough time has passed
    if (this.state === STATE.OPEN) {
      if (Date.now() < this.nextAttempt)
        throw new Error("Circuit OPEN – request rejected.");
      // Time to try again: allow one call (half-open)
      this.state = STATE.HALF_OPEN;
    }

    try {
      const result = await this.fn(...args);
      // Success: reset failure count and keep/close the circuit
      this.failureCount = 0;
      this.state = STATE.CLOSED;
      return result;
    } catch (err) {
      this.failureCount++;
      // Open the circuit if we hit the threshold, or if the half-open trial failed
      if (
        this.state === STATE.HALF_OPEN ||
        this.failureCount >= this.failureThreshold
      ) {
        this.state = STATE.OPEN;
        this.nextAttempt = Date.now() + this.resetTimeout;
      }
      throw err;
    }
  }
}

// --- Example: a service that fails twice, then succeeds ---
let attempts = 0;
async function unreliableService() {
  attempts++;
  if (attempts <= 2) throw new Error("Service down");
  return "OK";
}

// Wrap the service with a circuit breaker (opens after 2 failures)
const breaker = new CircuitBreaker(unreliableService, { failureThreshold: 2 });

// Usage: first two calls fail and open the circuit; calls 3 and 4 are rejected without calling the service
async function main() {
  for (let i = 1; i <= 4; i++) {
    try {
      const result = await breaker.call();
      console.log(`Call ${i}: ${result} (state: ${breaker.state})`);
    } catch (e) {
      console.log(`Call ${i}: ${e.message} (state: ${breaker.state})`);
    }
  }
}
main();
