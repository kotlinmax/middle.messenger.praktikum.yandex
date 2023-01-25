import {onChange} from '@app/functions';
import {Component} from '@core/component';
import {ReasonResponse} from '@api/types';
import {error} from '@app/constants';
import {ChatListState} from './state';
import {CHANGE_INPUT, CREATE_CHAT, GET_CHATS, OPEN_CHAT, SWITCH_TOOLTIP} from '@app/actions';
import {Chat} from '@api/repositories';
import {WebSocketChat} from '@api/websocket/chat';
import {ChatListProps} from './ChatList';

function handleError(err: ReasonResponse) {
  const {state} = this as Component<ChatListState, ChatListProps>;

  if (err.reason === error.cookie) return;
  state.error = err.reason ?? error.auth;
}

async function dispatch(type: string, payload: unknown) {
  const {state, props} = this as Component<ChatListState, ChatListProps>;

  try {
    switch (type) {
      case CHANGE_INPUT: {
        onChange.call(this, state.event);
        break;
      }

      case SWITCH_TOOLTIP: {
        state.showTooltip = !state.showTooltip;
        break;
      }

      case CREATE_CHAT: {
        state.showTooltip = false;
        break;
      }

      case GET_CHATS: {
        state.load = true;
        state.chats = await Chat.getChats();
        break;
      }

      case OPEN_CHAT: {
        state.socket = WebSocketChat.instance;
        props.setWebSocketChat(state.socket, payload as string); // pass to parent component
        break;
      }
    }
  } catch (error) {
    handleError.call(this, error);
  } finally {
    state.load = false;
  }
}

export {dispatch};