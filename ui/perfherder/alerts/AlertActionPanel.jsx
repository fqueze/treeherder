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

  // Can we update multple alerts at a time?
  // TODO error handling
  modifySelectedAlerts = (selectedAlerts, modification) => {
    Promise.all(selectedAlerts.map(alert => modifyAlert(alert, modification)));
  };

  resetAlerts = async () => {
    const {
      selectedAlerts,
      alertSummaries,
      alertSummary,
      fetchAlertSummaries,
    } = this.props;

    // We need to update the summary and any related summaries when updating the alert
    const otherAlertSummaries = selectedAlerts
      .map(alert =>
        alertSummaries.find(
          alertSummary => alertSummary.id === alert.related_summary_id,
        ),
      )
      .filter(alertSummary => alertSummary !== undefined);

    const summariesToUpdate = [...[alertSummary], ...otherAlertSummaries];

    await this.modifySelectedAlerts(selectedAlerts, {
      status: alertStatus.untriaged,
      related_summary_id: null,
    });

    // when an alert status is updated via the API, the corresponding
    // alertSummary status is also updated (in the backend) so we need
    // to fetch the updated alertSummary to capture the change in the UI

    // TODO do this gracefully and in parallel
    summariesToUpdate.forEach(summary => fetchAlertSummaries(summary.id));
  };

  hasTriagedAlerts = () =>
    this.props.selectedAlerts.some(
      alert => alert.status !== alertStatus.untriaged,
    );

  allAlertsConfirming = () =>
    this.props.selectedAlerts.every(
      alert => alert.status === alertStatus.confirming,
    );

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
