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
import { alertStatusMap } from '../constants';
import { modifyAlert } from '../helpers';

export default class AlertActionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Can we update multiple alerts at a time?
  // TODO error handling
  modifySelectedAlerts = (selectedAlerts, modification) =>
    Promise.all(selectedAlerts.map(alert => modifyAlert(alert, modification)));

  resetAlerts = async () => {
    const {
      selectedAlerts,
      alertSummaries,
      alertSummary,
      fetchAlertSummaries,
    } = this.props;

    // TODO is this still needed (seems like it'd be to support an edge case)?
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
      status: alertStatusMap.untriaged,
      related_summary_id: null,
    });

    // when an alert status is updated via the API, the corresponding
    // alertSummary status is also updated (in the backend) so we need
    // to fetch the updated alertSummary to capture the change in the UI
    summariesToUpdate.forEach(summary => fetchAlertSummaries(summary.id));
    this.clearSelectedAlerts();
  };

  clearSelectedAlerts = () => {
    const { allSelected, updateState } = this.props;
    const updates = { selectedAlerts: [] };

    if (allSelected) {
      updates.allSelected = false;
    }
    updateState(updates);
  };

  updateAlerts = async newStatus => {
    const { selectedAlerts, fetchAlertSummaries, alertSummary } = this.props;

    await this.modifySelectedAlerts(selectedAlerts, {
      status: alertStatusMap[newStatus],
    });

    fetchAlertSummaries(alertSummary.id);
    this.clearSelectedAlerts();
  };

  hasTriagedAlerts = () =>
    this.props.selectedAlerts.some(
      alert => alert.status !== alertStatusMap.untriaged,
    );

  allAlertsConfirming = () =>
    this.props.selectedAlerts.every(
      alert => alert.status === alertStatusMap.confirming,
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
            <Col sm="auto" className="p-2">
              <SimpleTooltip
                text={
                  <Button
                    color="secondary"
                    onClick={() => this.updateAlerts('confirming')}
                  >
                    <FontAwesomeIcon icon={faClock} /> Confirming
                  </Button>
                }
                tooltipText="Retriggers & backfills are pending"
              />
            </Col>
          )}

          {(!this.hasTriagedAlerts() || this.allAlertsConfirming()) && (
            <React.Fragment>
              <Col sm="auto" className="p-2">
                <SimpleTooltip
                  text={
                    <Button
                      color="secondary"
                      onClick={() => this.updateAlerts('acknowledged')}
                    >
                      <FontAwesomeIcon icon={faCheck} /> Acknowledge
                    </Button>
                  }
                  tooltipText="Acknowledge selected alerts as valid"
                />
              </Col>

              <Col sm="auto" className="p-2">
                <SimpleTooltip
                  text={
                    <Button
                      color="secondary"
                      onClick={() => this.updateAlerts('invalid')}
                    >
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
  fetchAlertSummaries: PropTypes.func.isRequired,
  alertSummary: PropTypes.shape({}),
  updateState: PropTypes.func.isRequired,
  allSelected: PropTypes.bool.isRequired,
  alertSummaries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

AlertActionPanel.defaultProps = {
  alertSummary: null,
};
