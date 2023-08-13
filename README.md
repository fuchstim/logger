<br />

<div align="center">
  <h1>@ftim/logger</h1>

  <p align="center">
    <code>@ftim/logger</code> is a lightweight, no-frills logging library.
    <br />
    <a href="https://fuchstim.github.io/logger/classes/Logger.html" target="_blank"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/fuchstim/logger/issues">Report Bug</a>
    ·
    <a href="https://github.com/fuchstim/logger/issues">Request Feature</a>
  </p>
</div>

## Installation

To install the library, run `npm install --save @ftim/logger`

## Usage

**Example:**

```typescript
import Logger from '@ftim/logger';

Logger.warn('Hello world!');
// (warn) Hello world!

const namespacedLogger = Logger.ns('test-namespace');
namespacedLogger.info('Hello world from a namespace!');
// (info)[test-namespace] Hello world from a namespace!

const nestedNamespacedLogger = namespacedLogger.ns('we', 'have', 'to', 'go', 'deeper');
nestedNamespacedLogger.error('We went too far');
// (error)[test-namespace][we][have][to][go][deeper] We went too far
```

See [here](https://fuchstim.github.io/logger/classes/Logger.html) for all available client methods.
