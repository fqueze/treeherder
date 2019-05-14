import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import SimpleTooltip from '../../shared/SimpleTooltip';

export default class AlertTableControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <Container fluid className="card-body button-panel">
      {this.anySelectedAndTriaged(alertSummary.alerts) && (
        <SimpleTooltip
          text={
            <Button color="warning" onClick={this.resetAlerts}>
              {' '}
              Reset
            </Button>
          }
          tooltipText="Reset selected alerts to untriaged"
        />
      )}
      </Container>    );
        }
}

// AlertsTableControls.propTypes = {
// };

