//base source from: https://medium.com/geekculture/nodejs-circuit-breaker-pattern-ed6b31896a57
export type CircuitBreakerOptions = {
    openBreakerTimeoutInMs?: number;
    closedBreakerTimeoutInMs?: number;
    minFailedRequestThreshold?: number;
    percentageFailedRequestsThreshold?: number;
}

enum CircuitBreakerState {
    OPENED = "OPENED",
    CLOSED = "CLOSED",
    HALF = "HALF"
}

export class CircuitBreaker<PAYLOAD> {
    options: Required<CircuitBreakerOptions>;
    state = CircuitBreakerState.OPENED;

    constructor(
        opts?: CircuitBreakerOptions
    ) {
        this.options = {
            openBreakerTimeoutInMs: opts?.openBreakerTimeoutInMs || 10000,
            closedBreakerTimeoutInMs: opts?.closedBreakerTimeoutInMs || 5000,
            minFailedRequestThreshold: opts?.minFailedRequestThreshold || 15,
            percentageFailedRequestsThreshold: opts?.percentageFailedRequestsThreshold || 50,
        };
    }

    finishHalfStateAt: number | undefined = undefined;
    tryTriggerFromCloseAt: number | undefined = undefined;
    failCount = 0;
    successCount = 0;

    private resetStatistic() {
        this.successCount = 0;
        this.failCount = 0;
        this.finishHalfStateAt = undefined;
    }

    async fire(request: any, ...args: any[]) {
        console.log('Fire invoked with request: (' + request.name + ') and params: (' + args + ')!')
        if (this.state === CircuitBreakerState.CLOSED
            && (Date.now() < this.tryTriggerFromCloseAt!)) {
            throw new Error('Breaker is closed!');
        }
        try {
            const response = await request(...args);
            return this.success(response);
        } catch (e) {
            console.log('Invoke ' + request.name + ' with (' + args + ') failed!');
            throw new Error(this.fail());
        }
    }

    private success(response: PAYLOAD) {
        if (this.state === CircuitBreakerState.HALF) {
            this.successCount++;
            // the previous tracking window closed and
            // nothing happened to close breaker
            if (Date.now() >= this.finishHalfStateAt!) {
                this.state = CircuitBreakerState.OPENED;
                this.resetStatistic();
            }
        }
        // attempt after closedBreakerTimeoutInMs successful
        // it means that we should open breaker
        if (this.state === CircuitBreakerState.CLOSED) {
            this.state = CircuitBreakerState.OPENED;
            this.resetStatistic();
        }

        return response;
    }

    private fail() {
        // breaker closed and new attempt is failed
        if (this.state === CircuitBreakerState.CLOSED) {
            this.tryTriggerFromCloseAt = Date.now() + this.options.closedBreakerTimeoutInMs;
            return 'Retrying... Request failed!';
        }

        // the first failed request comes in
        if (this.state === CircuitBreakerState.OPENED) {
            this.failCount = 1;
            this.state = CircuitBreakerState.HALF;
            this.finishHalfStateAt = Date.now() + this.options.openBreakerTimeoutInMs;
            return 'First request failed!';
        }

        if (this.state === CircuitBreakerState.HALF) {
            this.failCount++;

            // it means that the previous tracking window closed
            // and nothing happened to close breaker
            // but the new HALF state should be started immediately
            if (Date.now() > this.finishHalfStateAt!) {
                this.resetStatistic();
                this.failCount = 1;
                this.finishHalfStateAt = Date.now() + this.options.openBreakerTimeoutInMs;
                return 'Service unavailable!';
            }

            // the tracking window isn't closed yet
            if (this.failCount >= this.options.minFailedRequestThreshold) {
                const failRate = this.failCount * 100 / (this.failCount + this.successCount);

                // failed rate exceeds and breaker is closed
                if (failRate >= this.options.percentageFailedRequestsThreshold) {
                    this.state = CircuitBreakerState.CLOSED;
                    this.resetStatistic();
                    this.tryTriggerFromCloseAt = Date.now() + this.options.closedBreakerTimeoutInMs;
                    return 'Another request failed!';
                }

                // otherwise it's considered as normal state
                // but the new tracking window should be started
                this.resetStatistic();
                this.failCount = 1;
                this.finishHalfStateAt = Date.now() + this.options.openBreakerTimeoutInMs;
                return 'Service unavailable!';
            }
        }
    }
}
