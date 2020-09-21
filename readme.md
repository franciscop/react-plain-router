# React Plain Router [![npm install react-plain-router](https://img.shields.io/badge/npm%20install-react--plain--router-blue.svg)](https://www.npmjs.com/package/react-plain-router) [![gzip size](https://img.badgesize.io/franciscop/router/master/router.min.js.svg?compression=gzip)](https://github.com/franciscop/router/blob/master/router.min.js)

A tiny React router that works exactly as expected with native Javascript:

```js
// App.js
import React from 'react';
import router from 'react-plain-router';

// Wrap it and you can use normal anchor links
export default router(({ path, query, hash }) => (
  <div>
    <nav>
      <a href="/">Go Home</a>
      <a href="/about">About us</a>
    </nav>

    {path === '/' && <div>Hello world!</div>}
    {path === '/about' && <div>About me</div>}
  </div>
));
```

You have to wrap your app with `router()` and then both `<a>` links and `window.history.pushState()` will work as expected. It will trigger a re-render when any of these properties change: `path`, `query` or `hash`.

If a link has the attribute `target`, then this library will ignore it and let the browser handle it. This is very useful for `target="_blank"`, so that the link is opened in a new tab as usual. But it will also work with `target="_self"`, where the router will ignore the link and thus perform a full-refresh.

An event named `navigation` will be triggered on `window` every time there's a re-render. You can see the parts with `e.detail`, which is very useful for debugging:

```js
// When loading /greetings?hello=world#nice
window.addEventListener('navigation', e => {
  console.log('NAVIGATION', e.detail);
  // {
  //   path: '/greetings',
  //   query: { hello: 'world' },
  //   hash: 'nice'
  // }
});
```

**Internally**, it works by using the bubbling events at the document level and then handling any link click. `window.location` becomes the source of truth instead of keeping an context or global store, which makes it more reliable to interact with native Javascript or http events.

## router(cb)

This [HOC](https://reactjs.org/docs/higher-order-components.html) function accepts a callback, which will be passed an arguments with the props from above and these 3 extra props:

- `path`, `pathname` (String): the current url path, similar to the native `pathname`. Example: for `/greetings` it will be `'/greetings'`. An empty URL would be `'/'`.
- `query` (Object | false): an object with key:values for the query in the url. Example: for `/greeting?hello=world` it will be `{ hello: 'world' }`.
- `hash` (String | false): the hash value without the `#`. Example: for `/hello#there` it will be `'there'`.

A fully qualified url will parse as this:

```js
// /greetings?hello=world#nice
router(({ path, query, hash, ...props }) => {
  expect(path).toBe('/greetings');
  expect(query).toEqual({ hello: 'world' });
  expect(hash).toBe('nice');
});
```




## Example: navigation bar

We can define our navigation in a different component. `<a>` are native so they will work cross-components:

```js
// Nav.js
export default () => (
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="https://google.com/">Go to Google</a>
    <a href="/terms" target="_blank">Terms and Conditions</a>
  </nav>
);
```

Then you can toggle the different pages in the main App.js:

```js
// App.js
import router from 'react-plain-router';
import Nav from './Nav';

export default router(({ path }) => (
  <div>
    <Nav />
    {path === '/' && <div>Homepage</div>}
    {path === '/about' && <div>About us</div>}
  </div>
));
```

The Google link will open Google, and the Terms and Conditions link will open a new tab. Everything works as expected, in the same way native html works.


## Example: scroll to top on any navigation

Add an event listener to the navigation event:

```js
window.addEventListener('navigation', e => {
  window.scrollTo(0, 0);
});
```



## Example: simulating the `<Link>`

Just an example of how easy it is to work with `react-plain-router`, let's see how to simulate the component that the library `react-router-dom` defines with this library

```js
// components/Link.js
export default ({ to, ...props }) => <a href={to} {...props} />;
```

Then to use our newly defined component, we can import it and use it:

```js
// Home.js
import router from 'react-plain-router';
import Link from './components/Link';

export default router(() => (
  <Link to="/about">About us</Link>
));
```

But you can just use native links:

```js
// Home.js
import router from 'react-plain-router';

export default router(() => (
  <a href="/about">About us</a>
));
```


## Example: manual navigation

To trigger manual navigation you can use the native `history.pushState()` as [explained in the amazing Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/History_API):

```js
// src/actions/login
export default id => async dispatch => {
  const payload = await ky(`/api/users/${id}`).json();
  dispatch({ type: 'USER_DATA', payload });
  window.history.pushState({}, 'Dashboard', `/dashboard`);
};
```
