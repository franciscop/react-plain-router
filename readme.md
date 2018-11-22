# React Plain Router

A 2kb React router that works exactly as expected:

```js
// App.js
import React from 'react';
import router from 'react-plain-router';

// Just this and everything is working as expected
export default router(({ path }) => (
  <div>
    {path === '/' && <div>Hello world!</div>}
    {path === '/about' && <div>About me</div>}

    <div>
      <a href="/">Go Home</a>
      <a href="/about">Go Home</a>
    </div>
  </div>
));
```

You only need to wrap your app in the `router()` [HOC](https://reactjs.org/docs/higher-order-components.html) and then both `<a>` links and `window.history.pushState()` will work as expected. It will trigger a re-render when any of those changes: `path`, `query` or `hash`.

If you have parameters in your routes or more complex routes, you can combine it with my other package [`pagex`](https://github.com/franciscop/pagex):

```js
import page from 'pagex';

export default router(() => (
  <div>
    {page('/', () => <div>Hello world!</div>)}
    {page('/users', () => <ul>...</ul>)}
    {page('/users/:id', (cat, id) => <User id={id} />)}
  </div>
));
```

**Internally**, it works by using the bubbling events at the document level and then pushing internal links. `window.location` becomes the source of truth instead of keeping an internal or global store, which makes it more reliable to interact with native Javascript or http events.

## router(cb)

This functions accepts a callback, which will be triggered with these parameters:

- `path`, `pathname` (String): the current url path, similar to the native `pathname`. Example: for `/greetings` it will be `/greetings`.
- `query` (Object|false): an object with key:values for the query in the url. Example: for `/greeting?hello=world` it will be `{ hello: 'world' }`.
- `hash` (String|false): the hash value without the `#`. Example: for `/hello#there` it will be `there`.

A fully qualified url will parse as this:

```js
// /greetings?hello=world#nice
router(({ path, query, hash }) => {
  expect(path).toBe('/greetings');
  expect(query).toEqual({ hello: 'world' });
  expect(hash).toBe('nice');
});
```


## Example: manual navigation

To trigger manual navigation you can use `history.pushState()`, but make sure to pass the right parameters:

```js

```
