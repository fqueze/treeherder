import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import SimpleTooltip from '../../shared/SimpleTooltip';
import { alertStatus } from '../constants';

export default class AlertTableControls extends React.Component {
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
      <React.Fragment>
        {this.anyUntriaged() && (
          <SimpleTooltip
            text={
              <Button color="warning" onClick={() => {}}>
                {' '}
                Reset
              </Button>
            }
            tooltipText="Reset selected alerts to untriaged"
          />
        )}
      </React.Fragment>
    );
  }
}

AlertTableControls.propTypes = {
  selectedAlerts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
