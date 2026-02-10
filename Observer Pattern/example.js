// Observable (Publisher)
class Observable {
  // Initialize the list of observers
  constructor() {
    this.observers = [];
  }

  // Method to add an observer
  subscribe(observer) {
    this.observers.push(observer);
  }
  // Method to remove an observer
  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
  // Method to notify all observers of an event
  notify(event) {
    this.observers.forEach((observer) => observer.update(event));
  }
}

// Observer (Subscriber)
class Observer {
  // Initialize the observer with a name
  constructor(name) {
    this.name = name;
  }

  // Method to receive updates from the observable
  update(event) {
    console.log(`${this.name} received event:`, event);
  }
}

// Usage Example
const observable = new Observable();
const observer1 = new Observer("Observer 1");
const observer2 = new Observer("Observer 2");

observable.subscribe(observer1); // Observer 1 subscribes to the observable
observable.subscribe(observer2); // Observer 2 subscribes to the observable

observable.notify("Event A occurred"); // Both Observer 1 and Observer 2 receive the event notification

observable.unsubscribe(observer2); // Observer 2 unsubscribes from the observable
observable.notify("Event B occurred"); // Only Observer 1 receives the event notification, Observer 2 does not receive it since it has unsubscribed
