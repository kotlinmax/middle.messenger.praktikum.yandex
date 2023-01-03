import { createElement } from './dom';
import { isStr, last, penultimate } from './utils';

export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.stack = [];
  }

  static _init(routes) {
    if (!this.instance) {
      this.instance = new Router(routes);
    }

    return this.instance;
  }

  static render(root) {
    this.instance.root = root;
    this.instance._subscribe('popstate', this.instance);
    this.instance._navigateTo(window.location.pathname);
  }

  static navigateTo(path, { toolbar } = {}) {
    this.instance._navigateTo(path, { toolbar });
  }

  static goBack() {
    const path = penultimate(this.instance.stack);
    this.instance._navigateTo(path);
  }

  _subscribe(event, ctx) {
    return window.addEventListener(event, function () {
      if (event === 'popstate') {
        const path = penultimate(ctx.stack);
        ctx._navigateTo(path, { toolbar: true });
      }
    });
  }

  _navigateTo(path, { toolbar } = {}) {
    const route = this.routes.find((route) => route.path === path);
    const isChecked = this._checkRoute(route);

    if (!isChecked) return;

    this._renderPage(route.comp);
    this._changeUrl(route, toolbar);
    this._registRoute(route);

    console.info('[RouterDom]: stack ', this.stack);
  }

  _goBack() {
    const path = penultimate(this.stack);
    this._navigateTo(path);
  }

  _renderPage(Instance) {
    this.root.innerHTML = '';
    const vNodeInstance = new Instance();
    const vNode = vNodeInstance._init();
    root.appendChild(createElement(vNode, vNodeInstance));
  }

  _changeUrl(route, toolbar) {
    if (toolbar) {
      history.replaceState({}, route.path, route.path);
    } else {
      history.pushState({}, route.path, route.path);
    }
  }

  _registRoute(route) {
    if (route.path !== last(this.stack)) {
      this.stack.push(route.path);
    }
  }

  _checkRoute(route) {
    const isRouteExist = this.routes.includes(route);

    if (!isRouteExist) {
      this._printError('define route in index.js');
      return false;
    }

    if (!route.path.startsWith('/')) {
      this._printError("route shoulde be start with '/'");
      return false;
    }

    if (route.comp === undefined) {
      this._printError('component in route shoudle be define');
      return false;
    }

    if (!isStr(route.path)) {
      this._printError('route shoulde be string');
      return false;
    }

    if (route.path == last(this.stack)) {
      this._printInfo('you are already on this route');
      return false;
    }

    return true;
  }

  _printError(string) {
    console.error(`[Router]: ${string}`);
  }

  _printInfo(string) {
    console.info(`[Router]: ${string}`);
  }
}
