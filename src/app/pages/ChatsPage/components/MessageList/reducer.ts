import {onChange} from '@app/functions';
import {Component} from '@core/component';
import {ReasonResponse} from '@api/types';
import {error} from '@app/constants';
import {ADD_USER_TO_CHAT, CHANGE_INPUT, CLOSE_OPEN_ADD_USER_MENU, SWITCH_TABS} from '@app/actions';

import {Chat, User} from '@api/repositories';
import {MessageListState, MessageListProps} from './types';

function handleError(err: ReasonResponse) {
  const {state} = this as Component<MessageListState, MessageListProps>;

  if (err.reason === error.cookie) return;
  state.error = err.reason ?? error.auth;
}

async function dispatch(type: string, payload: unknown) {
  const {state, props} = this as Component<MessageListState, MessageListProps>;
  const login = (state.event?.target as HTMLInputElement)?.value;
  const chatId = props.selectedChatId;

  try {
    switch (type) {
      case CLOSE_OPEN_ADD_USER_MENU: {
        state.showPopover = !state.showPopover;
        break;
      }
      case CHANGE_INPUT: {
        onChange.call(this, state.event);
        state.error = '';
        state.allUser = await User.searchUser({login});
        break;
      }

      case SWITCH_TABS: {
        state.addUserTab = !state.addUserTab;
        state.deleteUserTab = !state.deleteUserTab;
        break;
      }

      case ADD_USER_TO_CHAT: {
        const userId = payload as number;
        state.loadAddUser = true;
        await Chat.addUser({chatId, users: [userId]});
        break;
      }
    }
  } catch (error) {
    // console.log('[error] ChatList reducer:', error);
    handleError.call(this, error);
  } finally {
    state.loadAddUser = false;
  }
}

export {dispatch};
