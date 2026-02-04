// Singleton Counter using a class
class Counter {
  constructor() {
    if (Counter.instance) {
      return Counter.instance;
    }
    this.count = 0;
    Counter.instance = this;
    return this;
  }

  increment() {
    this.count++;
    return this.count;
  }

  decrement() {
    this.count--;
    return this.count;
  }

  getCount() {
    return this.count;
  }
}

// Usage
const counterA = new Counter();
const counterB = new Counter();

counterA.increment();
counterB.increment();

console.log("Counter A:", counterA.getCount()); // 2
console.log("Counter B:", counterB.getCount()); // 2
console.log("Are both counters same?", counterA === counterB); // true
