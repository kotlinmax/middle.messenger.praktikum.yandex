import './Styles.sass';
// core
import {section, div, component, a, span} from '@core/tags';
import {Component} from '@core/component';
import {Router} from '@core/router';
// app
import {GET_USER, LOGOUT_USER, UPLOAD_PHOTO} from '@app/actions';
import {ProfilePhoto, InfoLine, Layout} from '@app/components';
import {location, title} from '@app/constants';
// local
import {Item, ProfileState} from './types';
import {profileState} from './state';
import {dispatch} from './Logic';


export default class ProfilePage extends Component<ProfileState,{}> {
  constructor() {
    super();
  }

  createState() {
    return profileState;
  }

  logout(): void {
    dispatch.call(this, LOGOUT_USER);
  }

  didMount(): void {
    dispatch.call(this, GET_USER);
  }

  uploadPhoto(event: InputEvent) {
    this.state.target = event.target as HTMLInputElement;
    dispatch.call(this, UPLOAD_PHOTO);
  }

  create() {
    const {user, items, error, load} = this.state;

    const logout = this.logout.bind(this);
    const upload = this.uploadPhoto.bind(this);

    // prettier-ignore
    return (
      component(Layout, {
        title: title.profile,
        children: [
          section('c=profile__info section;', [
            component(ProfilePhoto, {
              name: load? 'Loading...' :  `${user?.first_name} ${user?.second_name}` ,
              photoUrl: user?.avatar,
              upload
            }),
            ...items.map((item: Item) => {
              return component(InfoLine, {name: item.name, value: item.value});
            }),
            div('c=profile__info__group_link;', [
              a('c=profile__info__group_link__link link;', ['Change account'], 
                {click: ()=> Router.to(location.profileEdit)},
              ),
              a('c=profile__info__group_link__link link;', ['Change password'], 
                {click: ()=> Router.to(location.passwordEdit)},
              ),
              a('c=profile__info__group_link__link link;', [load? 'Wait...' : 'Logout'], 
                {click: logout},
              ),
              span(`c=${error? 'error':'hidden'};`, [error ?? '']),
            ]),
          ])
      ]})
    );
  }
}
