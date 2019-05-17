import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCheck,
  faBan,
  faLevelDownAlt,
  faArrowAltCircleRight,
} from '@fortawesome/free-solid-svg-icons';

import SimpleTooltip from '../../shared/SimpleTooltip';
import { alertStatus } from '../constants';
import { modifyAlert } from '../helpers';

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

  // Can we update multple alerts at a time?
  // TODO error handling
  modifySelectedAlerts = (selectedAlerts, modification) => {
    selectedAlerts.forEach(alert => modifyAlert(alert, modification));
  };

  resetAlerts = () => {
    const {
      selectedAlerts,
      alertSummaries,
      alertSummary,
      fetchAlertSummaries,
    } = this.props;

    // TODO Does this still need to happen?

    // We need to update not only the summary when resetting the alert,
    // but other summaries affected by the change
    // const otherAlertSummaries = selectedAlerts
    //   .map(alert =>
    //     alertSummaries.find(
    //       alertSummary => alertSummary.id === alert.related_summary_id,
    //     ),
    //   )
    //   .filter(alertSummary => alertSummary !== undefined);

    // const summariesToUpdate = [...[alertSummary], ...otherAlertSummaries];
    // console.log(summariesToUpdate);

    this.modifySelectedAlerts(selectedAlerts, {
      status: alertStatus.untriaged,
      related_summary_id: null,
    });

    // when an alert status is updated via the API, the corresponding
    // alertSummary status is also updated (in the backend) so we need
    // to fetch the updated alertSummary to capture the change in the UI
    fetchAlertSummaries(alertSummary.id);
  };

  hasTriagedAlerts = () =>
    this.props.selectedAlerts.some(
      alert => alert.status !== alertStatus.untriaged,
    );

  allAlertsConfirming = () =>
    this.props.selectedAlerts.every(
      alert => alert.status === alertStatus.confirming,
    );

  // TODO add reset onclick functionality
  render() {
    return (
      <div className="bg-lightgray">
        <Row className="m-0 px-2 py-3">
          {this.hasTriagedAlerts() && (
            <Col sm="auto" className="p-2">
              <SimpleTooltip
                text={
                  <Button color="warning" onClick={this.resetAlerts}>
                    Reset
                  </Button>
                }
                tooltipText="Reset selected alerts to untriaged"
              />
            </Col>
          )}

          {!this.hasTriagedAlerts() && !this.allAlertsConfirming() && (
            // onClick markAlertsConfirming(alertSummary)
            <Col sm="auto" className="p-2">
              <SimpleTooltip
                text={
                  <Button color="secondary" onClick={() => {}}>
                    <FontAwesomeIcon icon={faClock} /> Confirming
                  </Button>
                }
                tooltipText="Retriggers & backfills are pending"
              />
            </Col>
          )}

          {(!this.hasTriagedAlerts() || this.allAlertsConfirming()) && (
            <React.Fragment>
              {/* onClick markAlertsAcknowledged(alertSummary) */}
              <Col sm="auto" className="p-2">
                <SimpleTooltip
                  text={
                    <Button color="secondary" onClick={() => {}}>
                      <FontAwesomeIcon icon={faCheck} /> Acknowledge
                    </Button>
                  }
                  tooltipText="Acknowledge selected alerts as valid"
                />
              </Col>

              {/* onClick markAlertsInvalid(alertSummary) */}
              <Col sm="auto" className="p-2">
                <SimpleTooltip
                  text={
                    <Button color="secondary" onClick={() => {}}>
                      <FontAwesomeIcon icon={faBan} /> Mark invalid
                    </Button>
                  }
                  tooltipText="Mark selected alerts as invalid"
                />
              </Col>

              {/* onClick markAlertsDownstream(alertSummary) */}
              <Col sm="auto" className="p-2">
                <SimpleTooltip
                  text={
                    <Button color="secondary" onClick={() => {}}>
                      <FontAwesomeIcon icon={faLevelDownAlt} /> Mark downstream
                    </Button>
                  }
                  tooltipText="Mark selected alerts as downstream from an alert summary on another branch"
                />
              </Col>

              {/* onClick reassignAlerts(alertSummary) */}
              <Col sm="auto" className="p-2">
                <SimpleTooltip
                  text={
                    <Button color="secondary" onClick={() => {}}>
                      <FontAwesomeIcon icon={faArrowAltCircleRight} /> Reassign
                    </Button>
                  }
                  tooltipText="Reassign selected alerts to another alert summary on the same branch"
                />
              </Col>
            </React.Fragment>
          )}
        </Row>
      </div>
    );
  }
}

AlertActionPanel.propTypes = {
  selectedAlerts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
