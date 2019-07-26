## Overview

Request, cache, refresh and serve OC19 data sources.


## Install

```
npm install cache-monster
```

## Usage

- **New Cache Object**

```
cache-monster(<request-config>, <result-eval-function>, <eval-failure-message>, <cache-refresh-interval>)
```

- **Accessing Cache Object**
Once instantiated, the returned data lives at `cache.data`.

- **Refresh/Update**
Data is refreshed automatically at `<cache-refresh-interval>`.

- **Example**

```javascript
const CACHE = require('cache-monster');

const requestConfig = {
  url: 'https://example.com/spiffy/resource',
  method: 'post',
  headers: {
    authorization: "Basic <my-spiffy-token>"}
  }

const evalResult = function(thing){return(thing.length > 5)};

const cache = new CACHE(requestConfig, evalResult, '💩 resources', 30000);

console.log(cache.data.length);
```