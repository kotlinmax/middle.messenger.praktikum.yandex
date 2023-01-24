import './Styles.sass';
// core
import {aside, button, component, footer, header, nav, ul} from '@core/tags';
import {Component} from '@core/component';
import {Router} from '@core/router';
// app
import {Input, ChatListItem, Tooltip} from '@app/components';
import {location, name} from '@app/constants';
import {inputs} from '@app/resources';
import {CHANGE_INPUT, CREATE_CHAT, GET_CHATS, OPEN_CHAT, SWITCH_TOOLTIP} from '@app/actions';
// local
import {chatListState, ChatListState} from './State';
import {dispatch} from './Logic';
import {IWebSocketChat} from '@api/types';

const searchChatInput = inputs.find((e) => e.name === name.searchChat);
const titleInput = inputs.find((e) => e.name === name.title);

export type ChatListProps = {
  setWebSocketChat: (socket: IWebSocketChat, chatId: string) => void;
};

export default class ChatList extends Component<ChatListState, ChatListProps> {
  constructor() {
    super();
  }

  createState() {
    return chatListState;
  }

  onChange(event: InputEvent) {
    this.state.event = event;
    dispatch.call(this, CHANGE_INPUT);
  }

  onToogleTooltip() {
    dispatch.call(this, SWITCH_TOOLTIP);
  }

  createChat() {
    dispatch.call(this, CREATE_CHAT);
  }

  openChat(chatId: string) {
    dispatch.call(this, OPEN_CHAT, chatId);
  }

  didMount() {
    dispatch.call(this, GET_CHATS);
  }

  create() {
    const {data, showTooltip, chats} = this.state;

    const onChange = this.onChange.bind(this);
    const switchTooltip = this.onToogleTooltip.bind(this);
    const createChat = this.createChat.bind(this);
    const openChat = this.openChat.bind(this);

    // prettier-ignore
    return (
      aside('c=chats__list;', [
        // header aside
        header('c=chats__list__header;', [
          nav('c=chats__list__header__nav;', [
            button('c=chats__list__header__nav__menu button; t=button; n=menu', [],
                {click: () => Router.to(location.root)},
            ),
          ]),
          component(Input, {
            ...searchChatInput,
            showError: false,
            change: onChange,
            value: data['search_chat'],
            className: 'chats__list__header_search',
          }),
          button('c=chats__list__header_search__account button; t=button; n=account', [],
            {click: () => Router.to(location.profile)},
          ),
        ]),
        // chats items
        ul('c=chats__list__items;', [
          ...chats?.map((chat) => {
            return component(ChatListItem, {chat, onClick: openChat});
          }),
        ]),
        // footer aside
        footer('c=chats__list__footer;', [
          component(Tooltip, {
            show: showTooltip, 
            children: [
              component(Input, {
                ...titleInput,
                change: onChange,
                showError: false,
                value: data['title'],
                className: 'tooltip__input',
              }),
              button('c=tooltip__button button; t=button; n=create chat', [],
                {click: createChat},
              ),
          ]}),
          button(`
              c=chats__list__footer__add_chat${showTooltip ? '--cancel' : ''} 
              button; 
              t=button; 
              n=add chat;
            `, [],
            {click: switchTooltip},
          ),
        ]),
      ])
    );
  }
}