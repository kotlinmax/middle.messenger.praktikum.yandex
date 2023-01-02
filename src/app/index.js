
import { render } from '@core/render';
import { LoginPage } from '@pages';

(function initApp() {
  const root = document.getElementById('root');

  render(LoginPage, root);
})();
