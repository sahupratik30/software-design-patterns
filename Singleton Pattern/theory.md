# Singleton Pattern Theory

The **singleton pattern** is a design pattern that restricts the instantiation of a class to a single object. This is useful when exactly one object is needed to coordinate actions across a system.

## Key Points

- Ensures a class has only one instance.
- Provides a global point of access to that instance.
- Useful for shared resources like configuration, logging, or counters.

## How It Works

The class itself manages its single instance. When a new object is requested, it returns the existing instance if one already exists, otherwise it creates a new one.

## Example Use Cases

- Database connections
- Logger classes
- Application configuration
- Shared counters

## Benefits

- Controlled access to sole instance
- Reduced memory footprint
- Consistent state across the application

## Drawbacks

- Can make unit testing harder
- May introduce global state

The singleton pattern is widely used in software engineering to ensure a class has only one instance and provides a single point of access to it.
