// VDOM --------------------
export type VirtualNode = {
  attrs: Record<string, string>;
  children: VirtualNode[] | string[];
  handlers: object;
  tag: string;
  HTMLElement?: HTMLElement | Text;
};

export type FunctionVirtualNode = (...args: any[]) => VirtualNode;
export type Attrs = Record<string, string>;
export type Props = Record<string, string>;
export type Route = {path: string; component: Component};
export type NavOptions = {clickButton?: 'prev' | 'next'};
export type ClickButton = NavOptions['clickButton'];
export type State = Record<string, string>;
export type RegisteredComponent = {key: string; component: IComponent<unknown, unknown>};
export type Component = IComponentConstructable<unknown, unknown>;
export type vNode = VirtualNode | string | number;


// ROUTER ------------------
export interface IRouter {
  root: HTMLElement;
  routes: Route[];
  stack: string[];
  index: number;
  isInit: boolean;

  _subscribe(event: string, instance: IRouter): unknown;
  _navigateTo(path: string, options?: NavOptions): unknown;
  _goBack(): void;
  _renderPage(ComponentInstance: any): void;
  _changeUrl(route: Route, clickButton: NavOptions['clickButton']): void;
  _registRoute(route: Route, clickButton: NavOptions['clickButton']): void;
  _checkRoute(route: Route | undefined): boolean;
  _printError(string: string): void;
  _printInfo(string: string): void;
}

// COMPONENT -----------------

export interface IComponentConstructable<State, Props> {
  new (): IComponent<State, Props>;
}

export interface IComponent<State, Props> {
  vNodeNext: VirtualNode;
  vNodeCurrent: VirtualNode;
  state: State | null;
  initState: State | null;
  props?: Props;
  key: string;
  isClearState: boolean;
  stack: RegisteredComponent[];

  createState(): State;
  create(): VirtualNode;
  didUpdate(): void;
  didMount(): void;
  unMount(): void;

  _init(props?: Props): VirtualNode;
  _reCreate(props?: Props): VirtualNode;
  _getProxyState(state: State): State;
  _interception(state: Record<string, unknown>, prop: string, newValue: any): boolean;
  _injectHTML(): void;
  _injectTextNode(vNodePrevLast: VirtualNode, textNode: VirtualNode): void;
  _injectChilds(vNode: VirtualNode): void;
  _injectAttr(vNodePrev: VirtualNode, vNodeNext: VirtualNode): void;
  _compareInnerText(vNodePrev: VirtualNode, vNodeNext: VirtualNode): void;
  _compareAttrs(vNodePrev: VirtualNode, vNodeNext: VirtualNode): void;
  _destroy(): void;
}
