import './InfoLine.sass';

import { div, span } from '@core/tags';
import { Component } from '@core/component';

export default class InfoLine extends Component {
  constructor() {
    super();
  }

  create(state, props) {
    const {} = state;
    const { name, value } = props;

    // prettier-ignore
    return (
      div('c=info_line;', [
        span('c=info_line__name text;', [ name ]),
        span('c=info_line__value text;', [ value ]),
      ])
    );
  }
}