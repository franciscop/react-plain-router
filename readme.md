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

It's only the `router()` wrapper, no `<Link>`, `<Route>`, etc needed. Any `<a>` link will *just work* within your SPA. It works by using the natural bubbling events at the document level and manually following internal links. It uses `window.location` as the source of truth, instead of keeping an internal store, which makes it more reliable to interact with native Javascript like `window.history.pushState()`.

If you have parameters in your routes or more complex routes, you can combine it with my other package `pagex`:

```js
export default router(() => (
  <div>
    {pagex('/', () => <div>Hello world!</div>)}
    {pagex('/users', () => <ul>...</ul>)}
    {pagex('/users/:id', (cat, id) => <User id={id} />)}
  </div>
));
```

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
