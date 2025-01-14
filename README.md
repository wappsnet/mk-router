# mk-router

# mk-router

## Overview

`mk-router` is a lightweight React library for managing routing in your React applications. It provides an intuitive API
for defining routes, handling navigation, and managing dynamic route parameters efficiently.

## Features

- Simple and flexible routing implementation.
- Dynamic route parameter support.
- Minimal and efficient – built specifically for React.
- Declarative route definitions.
- Zero dependencies apart from React.

## Installation

Install the library using npm:

```bash
npm install mk-router
```

or using yarn:

```bash
yarn add mk-router
```

## Usage

Here’s an example of how to use `mk-router` in your application:

```tsx
import React from 'react';
import { Router, Route } from 'mk-router';

const Home = () => <h1>Welcome to the Home Page</h1>;
const About = () => <h1>About Us</h1>;
const Profile = ({ params }: { params: { id: string } }) => (
  <h1>Profile ID: {params.id}</h1>
);

function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/profile/:id" component={Profile} />
    </Router>
  );
}

export default App;
```

## API

### `<Router>`

The `Router` component wraps your application and provides routing context. All `Route` components should be nested
within the `Router`.

### `<Route>`

Define individual routes using the `Route` component.

| Prop        | Type                  | Description                                       |
|-------------|-----------------------|---------------------------------------------------|
| `path`      | `string`              | The URL path to match for this route.             |
| `component` | `React.ComponentType` | The component to render when the path is matched. |

### Dynamic Route Parameters

You can define and use dynamic route parameters using the `:paramName` syntax in the path. These parameters are passed
as a `params` prop to the component.

## Contributing

We welcome contributions! Please fork the repository, create a branch, and open a pull request with your changes.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to get started with `mk-router` and simplify your React routing today!