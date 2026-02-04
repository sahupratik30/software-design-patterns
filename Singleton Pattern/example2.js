// Singleton Counter using an object
const Counter = (function () {
  let instance;
  function createInstance() {
    let count = 0;
    return {
      increment: function () {
        count++;
        return count;
      },
      decrement: function () {
        count--;
        return count;
      },
      getCount: function () {
        return count;
      },
    };
  }
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// Usage
const counterA = Counter.getInstance();
const counterB = Counter.getInstance();

counterA.increment();
counterB.increment();

console.log("Counter A:", counterA.getCount()); // 2
console.log("Counter B:", counterB.getCount()); // 2
console.log("Are both counters same?", counterA === counterB); // true
