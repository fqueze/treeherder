import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import SimpleTooltip from '../../shared/SimpleTooltip';
import { alertStatus } from '../constants';

export default class AlertActionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  anyUntriaged = () =>
    this.props.selectedAlerts.some(
      alert => alert.status === alertStatus.untriaged,
    );

  // TODO add reset onclick functionality
  render() {
    const { selectedAlerts } = this.props;

    return (
      <div className="bg-lightgray px-3 py-4">
        {/* {this.anyUntriaged() && ( */}
        <SimpleTooltip
          text={
            <Button color="warning" onClick={() => {}}>
              {' '}
              Reset
            </Button>
          }
          tooltipText="Reset selected alerts to untriaged"
        />
        {/* )} */}
      </div>
    );
  }
}

AlertActionPanel.propTypes = {
  selectedAlerts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
