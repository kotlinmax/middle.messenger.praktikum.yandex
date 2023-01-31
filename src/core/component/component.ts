import {isStr, isNum, isArr, isDiffLength, random, deepCopy, isObject} from '../utils';
import {createHTMLElement} from '../vdom/dom/dom';
import {RegisteredComponent, IComponent, VirtualNode} from '../types';

export abstract class Component<State = {}, Props = {}> implements IComponent<State, Props> {
  vNodeNext: VirtualNode;
  vNodeCurrent: VirtualNode;
  state: State;
  initState: State;
  props: Props;
  key: string;
  observer: MutationObserver;
  isClearState: boolean;
  stack: RegisteredComponent[];

  constructor() {
    this.key = random().toString();
  }

  _init(props: Props) {
    this.stack = [];
    this.isClearState = false;

    this.state = this._getProxyState(this.createState());
    this.initState = deepCopy(this.state) as State;

    this.props = props;
    this.vNodeCurrent = this.create();
    this.vNodeCurrent.attrs['data-key'] = this.key;

    this._observer(this.key);

    return this.vNodeCurrent;
  }

  _reCreate(props: Props) {
    this.props = props;
    return this.create();
  }

  _getProxyState(state: State) {
    return new Proxy(state as Record<string, unknown>, {
      set: this._interception.bind(this),
    }) as State;
  }

  _interception(state: Record<string, unknown>, prop: string, newValue: unknown) {
    state[prop] = newValue;

    if (this.isClearState) {
      return true;
    }

    this.vNodeNext = this.create();
    this._injectHTML();
    return true;
  }

  _injectHTML() {
    let isDiff = false;

    const stackPrev = [this.vNodeCurrent];
    const stackNext = [this.vNodeNext];

    let vNodePrevLast = this.vNodeCurrent;
    let vNodeNextLast = this.vNodeNext;

    while (stackPrev.length > 0 || stackNext.length > 0) {
      const vNodePrev: VirtualNode | string = stackPrev.pop()!;
      const vNodeNext: VirtualNode | string = stackNext.pop()!;

      if (isDiffLength(stackPrev, stackNext)) {
        vNodePrevLast.children = vNodeNextLast.children;
        this._injectChilds(vNodePrevLast);
        break;
      }

      if (isArr(vNodePrev.children)) {
        vNodePrevLast = vNodePrev;
        stackPrev.push(...(vNodePrev.children as []));
      }

      if (isArr(vNodeNext.children)) {
        vNodeNextLast = vNodeNext;
        stackNext.push(...(vNodeNext.children as []));
      }

      isDiff = this._compateTags(vNodePrev, vNodeNext);

      if (isDiff) {
        this._injectTags(vNodePrevLast, vNodeNext);
      }

      isDiff = this._compareInnerText(vNodePrev, vNodeNext);

      if (isDiff) {
        this._injectTextNode(vNodePrevLast, vNodeNext);
      }

      isDiff = this._compareAttrs(vNodePrev, vNodeNext);

      if (isDiff) {
        this._injectAttr(vNodePrev, vNodeNext);
      }
    }
  }

  _injectTags(vPrev: VirtualNode, vNext: VirtualNode) {
    if (!(vPrev.HTMLElement instanceof HTMLElement)) return;
    const element = createHTMLElement(vNext);
    vPrev.HTMLElement.replaceWith(element);
    vPrev.tag = vNext.tag;
    vPrev.HTMLElement = element;
  }

  _injectTextNode(vNode: VirtualNode, textNode: VirtualNode | string) {
    if (vNode.HTMLElement instanceof HTMLElement) {
      vNode.HTMLElement.innerHTML = textNode as string;
      vNode.children = [textNode as string];
    }
  }

  _injectChilds(vNode: VirtualNode) {
    const isTextNode = vNode.children.length === 1 && isStr(vNode.children[0]);

    if (vNode.HTMLElement instanceof HTMLElement) {
      vNode.HTMLElement.innerHTML = isTextNode ? (vNode.children[0] as string) : '';
    }

    if (isTextNode) {
      return;
    }

    vNode.children.forEach((item) => {
      const child = item as VirtualNode;
      const element = createHTMLElement(child);

      child.HTMLElement = element;
      vNode.HTMLElement?.appendChild(element);
    });
  }

  _injectAttr(vPrev: VirtualNode, vNext: VirtualNode) {
    if (!(vPrev.HTMLElement instanceof HTMLElement)) return;

    const attrsNext = Object.entries(vNext.attrs);
    const attrsPrev = Object.entries(vPrev.attrs);

    let isDisabled = false;

    attrsNext.forEach(([nextKey, nextValue]) => {
      attrsPrev.forEach(([prevKey, prevValue]) => {
        if (!(vPrev.HTMLElement instanceof HTMLElement)) return;

        if (nextKey === 'disabled') isDisabled = true;
        if (nextKey !== prevKey) return;
        if (prevValue === nextValue) return;

        vPrev.HTMLElement.removeAttribute(prevKey);
        vPrev.HTMLElement.setAttribute(nextKey, nextValue);
      });
    });

    if (isDisabled) {
      vPrev.HTMLElement.setAttribute('disabled', '');
    } else {
      vPrev.HTMLElement.removeAttribute('disabled');
    }

    vPrev.attrs = vNext.attrs;
  }

  _compareInnerText(vPrev: VirtualNode, vNext: VirtualNode) {
    if (!(isStr(vPrev) || isNum(vPrev))) {
      return false;
    }
    return vPrev !== vNext;
  }

  _compateTags(vPrev: VirtualNode, vNext: VirtualNode) {
    return vPrev.tag !== vNext.tag;
  }

  _compareAttrs(vPrev: VirtualNode, vNext: VirtualNode) {
    if (isStr(vPrev) || isNum(vPrev)) {
      return false;
    }

    const prevAttrs = Object.entries(vPrev.attrs).join();
    const nextAttrs = Object.entries(vNext.attrs).join();

    return prevAttrs !== nextAttrs;
  }

  _observer(key: string) {
    const root = document.querySelector('#root');

    this.observer = new MutationObserver(() => {
      const selector = `[data-key="${key}"]`;
      const component = document.querySelector(selector);
      const inDom = document.body.contains(component);

      inDom ? this.didMount() : this._destroy();
    });

    if (!root) return;

    this.observer.observe(root, {childList: true});
  }

  _destroy() {
    this.observer.disconnect();
    this._clearState();
    this.unMount();
  }

  _clearState() {
    this.isClearState = true;

    const stack = [this.state];
    const initStack = [this.initState];

    while (stack.length > 0) {
      const state = stack.pop() as Record<string, unknown>;
      const initState = initStack.pop() as Record<string, unknown>;

      for (const key in state) {
        if (!state.hasOwnProperty(key)) {
          continue;
        }

        const value = state[key];
        const initValue = initState[key];
        const isObjects = isObject(value) && isObject(initValue);

        if (isObjects) {
          stack.push(value as State);
          initStack.push(initValue as State);
        } else {
          state[key] = initValue;
        }
      }
    }

    this.isClearState = false;
  }

  createState(): State {
    return {} as State;
  }

  /* eslint-disable */
  didMount() {}
  didUpdate() {}
  unMount() {}

  abstract create(): VirtualNode;
}
