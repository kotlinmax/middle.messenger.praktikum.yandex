import { section, form, component, a } from '@core/tags';
import { Component } from '@core/component';
import { Router } from '@core/router';
import { Button, Input } from '@app/components';

const inputs = [
  { name: 'email', placeholder: 'Email Address' },
  { name: 'login', placeholder: 'Login' },
  { name: 'first_name', placeholder: 'Name' },
  { name: 'second_name', placeholder: 'Surname' },
  { name: 'display_name', placeholder: 'Chat Name' },
  { name: 'phone', placeholder: 'Phone number' },
];

const data = {
  email: '',
  login: '',
  first_name: '',
  second_name: '',
  display_name: '',
  phone: '',
};

export default class EditProfileForm extends Component {
  constructor() {
    super();
  }

  createState() {
    return { data, inputs };
  }

  onChange(event) {
    const name = event.target.name;
    this.state.data[name] = event.target.value;
  }

  onSubmit() {
    console.log('data:', this.state.data);
  }

  goToProfilePage() {
    Router.navigateTo('/profile');
  }

  create(state) {
    const { inputs } = state;

    const onSubmit = this.onSubmit.bind(this);
    const goToProfilePage = this.goToProfilePage.bind(this);
    const onChange = this.onChange.bind(this);

    // prettier-ignore
    return (
      section([
        form('c=form;', [
          ...inputs.map(inputData => {
            return component(Input, {...inputData, change: onChange })
          }),
          component(Button, { text: 'Change data', onSubmit: onSubmit }),
        ]),
        a('c=link;', ['Go to profile'], { click: goToProfilePage}),
      ])
    );
  }
}