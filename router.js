import React, { Component } from 'react';
const internal = link => !/^(https?:\/\/|\/\/)/i.test(link);

const getQuery = ({ searchParams }) => {
  const query = {};
  for (let key of searchParams) {
    query[key[0]] = key[1];
  }
  if (!Object.keys(query).length) return false;
  return query;
};

const pair = ([k,v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v);

const createQuery = query => {
  if (!query || !Object.keys(query).length) return '';
  return '?' + Object.entries(query).map(pair).join('&');
};

const getState = loc => {
  if (loc.path) return loc;
  if (typeof loc === 'string') return getState(new URL(loc, window.location));
  const query = getQuery(loc);
  return { path: loc.pathname, query, hash: (loc.hash && loc.hash.slice(1)) || false };
};

const full = ({ path, search, hash }) => path + createQuery(search) + (hash ? ('#' + hash) : '');

export default Comp => class extends Component {
  constructor (props) {
    super(props);
    this.state = getState(document.location.href);
    this.upgrade = this.upgrade.bind(this);
    this.browser = this.browser.bind(this);
    this.clicked = this.clicked.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  upgrade (state) {
    if (!state) state = getState(document.location.href);
    if (full(state) === full(this.state)) return;
    window.dispatchEvent(new CustomEvent('navigation', { detail: state }));
    this.setState(state);
  }
  clicked (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;
    if (link.hasAttribute('target')) return;
    const href = link.getAttribute('href');
    if (!internal(href)) return;
    e.preventDefault();
    const state = getState(href);
    window.history.pushState(state, link.innerText, full(state));
    this.upgrade(state);
  }
  // For browser events like forward, backwards, etc
  browser ({ state }) {
    this.upgrade(state);
  }
  // You should not be manually setting the url if possible at all, but just in
  //  case here we listen to potential manual changes
  refresh () {
    this.upgrade(getState(document.location.href));
  }
  componentDidMount () {
    document.body.addEventListener('click', this.clicked);
    window.addEventListener('popstate', this.browser);
    this.interval = window.setInterval(this.refresh, 10);
  }
  componentWillUnmount () {
    document.body.removeEventListener('click', this.clicked);
    window.removeEventListener('popstate', this.browser);
    window.clearInterval(this.interval);
  }
  render () {
    return <Comp {...this.state} pathname={this.state.path} {...this.props} />;
  }
};
