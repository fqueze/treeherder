import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form, FormGroup, Label, Input, Table } from 'reactstrap';

import {
  phAlertStatusMap,
  phDefaultTimeRangeValue,
  phTimeRanges,
} from '../../helpers/constants';
import RepositoryModel from '../../models/repository';

import AlertHeader from './AlertHeader';
import StatusDropdown from './StatusDropdown';
import AlertTableRow from './AlertTableRow';
import DownstreamSummary from './DownstreamSummary';

export default class AlertTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertSummary: this.props.alertSummary,
      downstreamIds: [],
      showMoreNotes: false,
    };
  }

  // TODO call getInitializedAlerts(alert, optionCollectionMap) to create title on each alert
  componentDidMount() {
    this.getDownstreamList();
  }

  getDownstreamList = () => {
    const { alertSummary } = this.props;

    const downstreamIds = [
      ...new Set(
        alertSummary.alerts
          .map(alert => {
            if (
              alert.status === phAlertStatusMap.DOWNSTREAM.id &&
              alert.summary_id !== alertSummary.id
            ) {
              return [alert.summary_id];
            }
            return [];
          })
          .reduce((a, b) => [...a, ...b], []),
      ),
    ];

    this.setState({ downstreamIds });
  };

  selectAlerts = () => {
    const { alertSummary: oldAlertSummary } = this.state;
    const alertSummary = { ...oldAlertSummary };
    alertSummary.allSelected = !alertSummary.allSelected;

    alertSummary.alerts.forEach(function selectAlerts(alert) {
      alert.selected = alert.visible && alertSummary.allSelected;
    });
    this.setState({ alertSummary });
  };

  // TODO move to alertTableRow
  getTimeRange = () => {
    const { alertSummary } = this.props;

    const defaultTimeRange =
      alertSummary.repository === 'mozilla-beta'
        ? 7776000
        : phDefaultTimeRangeValue;
    const timeRange = Math.max(
      defaultTimeRange,
      phTimeRanges
        .map(time => time.value)
        .find(
          value => Date.now() / 1000.0 - alertSummary.push_timestamp < value,
        ),
    );

    return timeRange;
  };

  render() {
    const { user, validated, alertSummaries, issueTrackers } = this.props;
    const { alertSummary, downstreamIds, showMoreNotes } = this.state;

    const downstreamIdsLength = downstreamIds.length;
    const repo = validated.projects.find(
      repo => repo.name === alertSummary.repository,
    );
    const repoModel = new RepositoryModel(repo);

    return (
      <Container fluid className="px-0 max-width-default">
        <Form>
          <Table className="compare-table">
            <thead>
              <tr className="bg-lightgray">
                <th
                  colSpan="8"
                  className="text-left alert-summary-header-element"
                >
                  <FormGroup check>
                    <Label check className="pl-1">
                      <Input
                        type="checkbox"
                        disabled={!user.isStaff}
                        onClick={this.selectAlerts}
                      />
                      <AlertHeader
                        alertSummary={alertSummary}
                        repoModel={repoModel}
                        issueTrackers={issueTrackers}
                      />
                    </Label>
                  </FormGroup>
                </th>
                <th className="table-width-sm align-top font-weight-normal">
                  <StatusDropdown
                    alertSummary={alertSummary}
                    user={user}
                    updateState={alertSummary =>
                      this.setState({ alertSummary })
                    }
                    repoModel={repoModel}
                    issueTrackers={issueTrackers}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {/* // TODO orderBy: ['-starred', 'title'] */}
              {alertSummary.alerts.map(
                alert =>
                  alert.visible && (
                    <AlertTableRow
                      key={alert.id}
                      alertSummary={alertSummary}
                      alert={alert}
                      user={user}
                      timeRange={this.getTimeRange()}
                    />
                  ),
              )}
              {downstreamIdsLength > 0 && (
                <tr>
                  <td colSpan="9" className="text-left text-muted pl-3 py-4">
                    <span>Downstream alert summaries: </span>
                    {downstreamIds.map((id, index) => (
                      <DownstreamSummary
                        key={id}
                        id={id}
                        alertSummaries={alertSummaries}
                        position={downstreamIdsLength - 1 - index}
                      />
                    ))}
                  </td>
                </tr>
              )}
              {alertSummary.notes && (
                <tr className="border">
                  <td colSpan="9" className="text-left text-muted  pl-3 py-4">
                    <p
                      className={`max-width-row-text ${
                        showMoreNotes ? '' : 'text-truncate'
                      }`}
                    >
                      <span className="font-weight-bold">Notes </span>
                      {alertSummary.notes}
                    </p>
                    {alertSummary.notes.length > 168 && (
                      <p
                        className="mb-0 text-right font-weight-bold text-info pointer"
                        onClick={() =>
                          this.setState({ showMoreNotes: !showMoreNotes })
                        }
                      >
                        {`show ${showMoreNotes ? 'less' : 'more'}`}
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Form>
      </Container>
    );
  }
}

AlertTable.propTypes = {
  alertSummary: PropTypes.shape({}),
  user: PropTypes.shape({}),
  validated: PropTypes.shape({
    projects: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  alertSummaries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  issueTrackers: PropTypes.arrayOf(PropTypes.shape({})),
};

AlertTable.defaultProps = {
  alertSummary: null,
  user: null,
  issueTrackers: [],
};
