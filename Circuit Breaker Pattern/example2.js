/**
 * Circuit Breaker Pattern
 * Wraps a potentially failing operation (e.g. an API call). After too many failures,
 * the circuit "opens" and rejects new calls immediately instead of calling the service.
 * After a reset timeout, it allows one trial (half-open); success closes the circuit again.
 *
 * This is the same behaviour as example.js, implemented with a function and closures instead of a class.
 */

// Circuit states: CLOSED = normal | OPEN = reject all | HALF_OPEN = allow one trial
const STATE = { CLOSED: "CLOSED", OPEN: "OPEN", HALF_OPEN: "HALF_OPEN" };

// Returns an object with call(...args) and state, mirroring the class API
function createCircuitBreaker(fn, options = {}) {
  const failureThreshold = options.failureThreshold ?? 2; // Open circuit after this many failures
  const resetTimeout = options.resetTimeout ?? 2000; // ms to wait before trying again (half-open)
  let failureCount = 0;
  const stateRef = { current: STATE.CLOSED }; // Mutable ref so we can expose .state
  let nextAttempt = null; // When we're allowed to try again (when state is OPEN)

  async function call(...args) {
    // If circuit is OPEN, reject unless enough time has passed
    if (stateRef.current === STATE.OPEN) {
      if (Date.now() < nextAttempt)
        throw new Error("Circuit OPEN – request rejected.");
      // Time to try again: allow one call (half-open)
      stateRef.current = STATE.HALF_OPEN;
    }

    try {
      const result = await fn(...args);
      // Success: reset failure count and keep/close the circuit
      failureCount = 0;
      stateRef.current = STATE.CLOSED;
      return result;
    } catch (err) {
      failureCount++;
      // Open the circuit if we hit the threshold, or if the half-open trial failed
      if (
        stateRef.current === STATE.HALF_OPEN ||
        failureCount >= failureThreshold
      ) {
        stateRef.current = STATE.OPEN;
        nextAttempt = Date.now() + resetTimeout;
      }
      throw err;
    }
  }

  return {
    call,
    get state() {
      return stateRef.current;
    },
  };
}

// --- Example: a service that fails twice, then succeeds ---
let attempts = 0;
async function unreliableService() {
  attempts++;
  if (attempts <= 2) throw new Error("Service down");
  return "OK";
}

// Wrap the service with a circuit breaker (opens after 2 failures)
const breaker = createCircuitBreaker(unreliableService, {
  failureThreshold: 2,
});

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
