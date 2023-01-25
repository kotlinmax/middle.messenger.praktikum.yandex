import {UpdatePasswordRequest} from '@api/types';
import {name} from '@app/constants';
import {EditPasswordState} from './types';

const {oldPassword, newPassword} = name;

const editPasswordState: EditPasswordState = {
  load: false,
  error: '',
  inputData :{
    [oldPassword]: '',
    [newPassword]: '',
  } as UpdatePasswordRequest,
};

export {editPasswordState};
