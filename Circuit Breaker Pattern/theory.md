# Circuit Breaker Pattern Theory

The **circuit breaker pattern** is a resilience design pattern that prevents an application from repeatedly attempting an operation that is likely to fail (e.g., calling a remote service that is down). It allows the system to fail fast and recover gracefully instead of wasting resources on doomed requests.

## Key Points

- Wraps calls to an external service and monitors for failures.
- After a threshold of failures, the circuit "opens" and blocks further calls for a period.
- After a timeout, the circuit moves to "half-open" and allows a test call; success closes it, failure reopens it.
- Reduces cascading failures and gives failing services time to recover.

## How It Works

The circuit has three states:

1. **Closed** — Requests pass through normally. Failures are counted; when the failure count exceeds a threshold, the circuit opens.
2. **Open** — Requests are rejected immediately (fail fast) without calling the service. After a reset timeout, the circuit moves to half-open.
3. **Half-Open** — A limited number of requests are allowed through to test if the service has recovered. Success closes the circuit; failure reopens it.

## Example Use Cases

- External API calls (payment gateways, third-party APIs)
- Database or cache connections
- Microservice-to-microservice communication
- Any operation that can temporarily fail and cause cascading failures

## Benefits

- Prevents resource exhaustion from retrying failing operations
- Fails fast instead of hanging on timeouts
- Gives downstream services time to recover
- Improves overall system stability and user experience

## Drawbacks

- Adds complexity and state to track
- May delay recovery if timeout is too long
- Requires tuning threshold and timeout for each use case
