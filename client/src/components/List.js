import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('PropertiesStore')
@observer
class List extends React.Component {
  constructor(props) {
    super(props);
    props.PropertiesStore.listProperties();
  }
  render() {
    const { PropertiesStore } = this.props;
    return (
      <pre>{JSON.stringify(PropertiesStore.properties.data, null, 2)}</pre>
    );
  }
}

export default List;
