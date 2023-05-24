// TODO: Find out how to fix ESLint error

/**
 * General purpose utility to await for a given amount of time
 * @param ms
 */
export async function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Self-adjusting interval to account for drifting
 *
 * This is the current implementation for calculating time until sales start.
 *
 * @todo Replace with something more robust
 *
 * @param {function} workCb  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds)
 * @param {function} errorCb (Optional) Callback to run if the drift
 *                             exceeds interval
 */
export function accurateInterval(
  workCb: (stop: () => void) => void,
  interval: number,
  errorCb?: () => void
) {
  const stop = () => {
    clearTimeout(timeout);
  };

  const step = () => {
    const drift = Date.now() - expected;
    if (drift > interval) {
      if (errorCb) errorCb();
    }
    expected += interval;
    timeout = setTimeout(step, Math.max(0, interval - drift));
    workCb(stop);
  };

  let expected = Date.now() + interval;
  let timeout = setTimeout(step, interval);

  return stop;
}
// TODO: Find out how to setup appwide env variables
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

// TODO: Might be doable with Date class
// TODO: Definition
export function secondsToPrettierPrint(timestamp: number) {
  const hours = Math.floor(timestamp / 60 / 60);
  const minutes = Math.floor(timestamp / 60) - hours * 60;
  const seconds = timestamp % 60;
  return hours + ':' + minutes + ':' + seconds;
}

export * from './webUtils';
