import { component } from '@core/tags';
import { Component } from '@core/component';
import { ProfileInfo, Layout } from '@app/components';

export default class ProfilePage extends Component {
  constructor() {
    super();
  }

  createState() {
    return {};
  }

  didMount() {}

  create() {
    // prettier-ignore
    return (
      component(Layout, { children: [
        ProfileInfo
      ] })
    )
  }
}
