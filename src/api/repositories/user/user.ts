import {api} from '../..';
import {User, UpdateProfile, UpdatePassword} from '@api/types';

const User = {
  updateProfile: (body: UpdateProfile): Promise<string> => {
    return api.put('/user/profile', body);
  },
  updatePassword: (body: UpdatePassword): Promise<string> => {
    return api.put('/user/password', body);
  },
  updatePhoto: (body: FormData): Promise<User> => {
    return api.put('/user/profile/avatar', body);
  },
};

export {User};
