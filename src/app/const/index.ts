const location = {
  root: '/',
  error: '/error',
  chats: '/chats',
  registration: '/registration',
  profile: '/profile',
  profileEdit: '/profile/edit',
  passwordEdit: '/password/edit',
};

const pattern = {
  email: '[a-zA-Z\\d-]+@+[a-zA-Z\\d-]+\\.+[a-zA-Z\\d-]*',
  login: '^[^\\d][^\\s][a-zA-Z\\d_-]{1,18}$', //
  firstName: '^[A-ZА-ЯЁ][^\\d^\\s][a-zа-яё-]*',
  secondName: '^[A-ZА-ЯЁ][^\\d^\\s][a-zа-яё-]*',
  displayName: '^[^\\d][^\\s][a-zA-Z\\d_-]{1,18}$',
  phone: '^[\\+]?[0-9]{10,15}$', //
  password: '^(?=^.{8,40}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
  searchChat: '^[^\\d][^\\s][a-zA-Z\\d_-]{1,18}$',
  searchMessage: '.*',
  sendMessage: '.*',
};

const name = {
  email: 'email',
  login: 'login',
  firstName: 'first_name',
  secondName: 'second_name',
  displayName: 'display_name',
  phone: 'phone',
  password: 'password',
  confirmPassword: 'confirm_password',
  searchChat: 'search_chat',
  searchMessage: 'search_message',
  sendMessage: 'message',
};

const placeholder = {
  email: 'Email Address',
  login: 'Login',
  firstName: 'Name',
  secondName: 'Surname',
  displayName: 'Display Name',
  phone: 'Phone number',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  searchChat: 'Search chat',
  searchMessage: 'Search Message',
  sendMessage: 'Send Message',
};

const error = {
  email: 'Invalid Email',
  login: 'Invalid login',
  firstName: 'Invalid name',
  secondName: 'Invalid surname',
  displayName: 'Invalid display name',
  phone: 'Invalid number',
  password: 'Invalid password',
  confirmPassword: 'Invalid password',
  searchChat: 'Invalid search string',
  searchMessage: 'Invalid search string',
  sendMessage: 'Invalid string',
};

export {location, pattern, name, placeholder, error};