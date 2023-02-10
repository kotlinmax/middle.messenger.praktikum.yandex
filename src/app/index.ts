import {userStore} from './store/user';
import {Router} from '@core/router';
import {location} from '@app/constants';
import {LoginPage, ProfilePage, RegisterPage, EditProfilePage} from '@app/pages';
import {EditPasswordPage, ErrorPage, ChatsPage, TestPage} from '@app/pages';
import {Route} from '@core/types';
import {Auth} from '@api/repositories';

function initApp() {
  Auth.user().then((user) => (userStore.user = user));

  const routes: Route[] = [
    {path: '/test', component: TestPage},
    {path: location.root, component: LoginPage},
    {path: location.error, component: ErrorPage},
    {path: location.chats, component: ChatsPage},
    {path: location.registration, component: RegisterPage},
    {path: location.profile, component: ProfilePage},
    {path: location.profileEdit, component: EditProfilePage},
    {path: location.passwordEdit, component: EditPasswordPage},
  ];

  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('id #root is not exit in index.html');
  }

  Router.init(routes);
  Router.render(rootElement);
}

initApp();
