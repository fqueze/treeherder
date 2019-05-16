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

  // resetAlerts = () => {
  //   // We need to update not only the summary when resetting the alert,
  //   // but other summaries affected by the change
  //   const { alertSummaries, alertSummary } = this.props;
  //   // TODO this seems a little convoluted since it's doing the same thing in modifySelectedUpdates
  //   const selectedAlerts = alertSummary.alerts
  //     .filter(alert => alert.selected)
  //     .map(alert =>
  //       alertSummaries.find(
  //         alertSummary => alertSummary.id === alert.related_summary_id,
  //       ),
  //     )
  //     .filter(alertSummary => alertSummary !== undefined);

  //   const summariesToUpdate = [...[alertSummary], ...selectedAlerts];

  //   modifySelectedAlerts(alertSummary, {
  //     status: phAlertStatusMap.UNTRIAGED.id,
  //     related_summary_id: null,
  //   }).then(() =>
  //     summariesToUpdate.forEach(alertSummary =>
  //       this.updateAlertSummary(alertSummary),
  //     ),
  //   );
  // };

  hasTriagedAlerts = () =>
    this.props.selectedAlerts.some(
      alert => alert.status !== alertStatus.untriaged,
    );

  // TODO add reset onclick functionality
  render() {
    const { selectedAlerts } = this.props;

    return (
      <div className="bg-lightgray px-3 py-4">
        {this.hasTriagedAlerts() && (
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
      </div>
    );
  }
}

AlertActionPanel.propTypes = {
  selectedAlerts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
