// core
import {Component} from '@core/component';
import {Router} from '@core/router';
// api
import {Auth} from '@api/repositories';
import {Reason} from '@api/types';
// app
import {location, error} from '@app/const';
import {onChange} from '@app/functions';
import {validateForm} from '@app/utils';
import {CHANGE_INPUT_ACTION, CREATE_USER_ACTION} from '@app/actions';
import {comparePasswords} from '@app/utils';
// local
import {RegisterState} from './types';

function handleError(err: Reason) {
  const {state} = this as Component<RegisterState>;
  if (err.reason === error.cookie) return;
  state.error = err.reason ?? error.auth;
}

async function dispatch(type: string) {
  const {state} = this as Component<RegisterState>;
  try {
    switch (type) {
      case CHANGE_INPUT_ACTION: {
        onChange.call(this, this.state.event);
        break;
      }

      case CREATE_USER_ACTION: {
        state.load = true;
        if (!validateForm(this.state.target.form)) return;
        if (!comparePasswords(this.state.data)) throw 'Passwords not match';
        await Auth.signup(this.state.data);
        Router.to(location.chats);
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
