import './RegisterForm.sass';

import { span, h1, main, form, component, a } from '@core/tags';
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
  { name: 'password', placeholder: 'Password' },
];

const data = {
  email: '',
  login: '',
  first_name: '',
  second_name: '',
  display_name: '',
  phone: '',
};

export default class RegisterForm extends Component {
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
    console.log('state:', this.state.data);
  }

  goBack() {
    Router.goBack();
  }

  create(state) {
    const { inputs } = state;

    const onSubmit = this.onSubmit.bind(this);
    const goBack = this.goBack.bind(this);
    const onChange = this.onChange.bind(this);

    // prettier-ignore
    return (
      main('c=register__form__form;', [
        form('c=register__form__form__form form; n=edit-profile-form;', [
          ...inputs.map((inputData, index) => component(Input, {...inputData, change: onChange })),
          component(Button, { text: 'Create account', onSubmit: onSubmit }),
        ]),
        a('c=register__form__form__link link;', ['Go back'], { click: goBack}),
      ])
      
    );
  }
}
