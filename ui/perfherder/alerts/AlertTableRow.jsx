import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

import { update } from '../../helpers/http';
import { getApiUrl, createQueryParams } from '../../helpers/url';
import { endpoints } from '../constants';
import { getStatus, getGraphsURL } from '../helpers';
import SimpleTooltip from '../../shared/SimpleTooltip';
import ProgressBar from '../ProgressBar';

// TODO remove $stateParams and $state after switching to react router
export default class AlertTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: this.props.alert,
      starred: this.props.alert.starred,
      checkboxSelected: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allSelected !== this.props.allSelected) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ checkboxSelected: this.props.allSelected });
    }
  }

  // TODO error handling
  modifyAlert = (alert, modification) =>
    update(getApiUrl(`${endpoints.alert}${alert.id}/`), modification);

  toggleStar = async () => {
    const { starred, alert } = this.state;
    const updatedStar = {
      starred: !starred,
    };
    await this.modifyAlert(alert, updatedStar);
    this.setState(updatedStar);
  };

  getReassignment = alert => {
    let text = 'to';
    let alertId = alert.related_summary_id;

    if (alert.related_summary_id === this.props.alertSummary.id) {
      text = 'from';
      alertId = alert.summary_id;
    }
    return (
      <span>
        {` ${text} `}
        <a
          href={`#/alerts?id=${alertId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-info"
        >{`alert #${alertId}`}</a>
      </span>
    );
  };

  updateCheckbox = () => {
    const { alert, updateSelectedAlerts, selectedAlerts } = this.props;
    const { checkboxSelected } = this.state;

    const index = selectedAlerts.indexOf(alert);

    if (checkboxSelected && index === -1) {
      return updateSelectedAlerts({
        selectedAlerts: [...selectedAlerts, alert],
      });
    }

    if (index !== -1) {
      selectedAlerts.splice(index, 1);
      return updateSelectedAlerts({ selectedAlerts });
    }
  };

  getTitleText = (alert, alertStatus) => {
    const { repository, framework, id } = this.props.alertSummary;

    let statusColor = '';
    let textEffect = '';
    if (alertStatus === 'invalid') {
      statusColor = 'text-danger';
    }
    if (alertStatus === 'untriaged') {
      statusColor = 'text-success';
    }
    if (
      alertStatus === 'invalid' ||
      (alert.related_summary_id && alert.related_summary_id !== id)
    ) {
      textEffect = 'strike-through';
    }

    return (
      <span>
        <span className={textEffect}>{alert.title}</span> (
        <span className={statusColor}>{alertStatus}</span>
        {alert.related_summary_id && this.getReassignment(alert)}){' '}
        <span className="result-links">
          <a
            href={getGraphsURL(
              alert,
              this.props.timeRange,
              repository,
              framework,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            graph
          </a>
          {alert.series_signature.has_subtests && (
            <a
              href={this.getSubtestsURL()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              · subtests
            </a>
          )}
        </span>
      </span>
    );
  };

  // arbitrary scale from 0-20% multiplied by 5, capped
  // at 100 (so 20% regression === 100% bad)
  getCappedMagnitude = percent => Math.min(Math.abs(percent) * 5, 100);

  getSubtestsURL = () => {
    const { alert, alertSummary } = this.props;
    const urlParameters = {
      framework: alertSummary.framework,
      originalProject: alertSummary.repository,
      originalSignature: alert.series_signature.id,
      newProject: alertSummary.repository,
      newSignature: alert.series_signature.id,
      originalRevision: alertSummary.prev_push_revision,
      newRevision: alertSummary.revision,
    };

    return `#/comparesubtest${createQueryParams(urlParameters)}`;
  };

  render() {
    const { user, alert, alertSummary } = this.props;
    const { starred, checkboxSelected } = this.state;

    const alertStatus = getStatus(alert.status);
    const tooltipText = alert.classifier_email
      ? `Classified by ${alert.classifier_email}`
      : 'Classified automatically';
    // TODO also add to compareTable re bug filed in Perfherder
    const numberFormat = new Intl.NumberFormat();

    return (
      <tr
        className={
          alertSummary.notes ? 'border-top border-left border-right' : 'border'
        }
      >
        <td className="px-1">
          <FormGroup check>
            {/* TODO aria label */}
            <Input
              type="checkbox"
              disabled={!user.isStaff}
              checked={checkboxSelected}
              onChange={() =>
                this.setState(
                  { checkboxSelected: !checkboxSelected },
                  this.updateCheckbox,
                )
              }
            />
          </FormGroup>
        </td>
        <td className="px-0">
          <span className={starred ? 'visible' : ''} onClick={this.toggleStar}>
            <FontAwesomeIcon
              title={starred ? 'starred' : 'not starred'}
              icon={starred ? faStarSolid : faStarRegular}
            />
          </span>
        </td>
        <td className="text-left">
          {alertStatus !== 'untriaged' ? (
            <SimpleTooltip
              text={this.getTitleText(alert, alertStatus)}
              tooltipText={tooltipText}
            />
          ) : (
            <span>{this.getTitleText(alert, alertStatus)}</span>
          )}
        </td>
        <td className="table-width-md">
          {numberFormat.format(alert.prev_value)}
        </td>
        <td className="table-width-sm">
          <span
            className={alert.is_regression ? 'text-danger' : 'text-success'}
          >
            {alert.prev_value < alert.new_value && <span>&lt;</span>}
            {alert.prev_value > alert.new_value && <span>&gt;</span>}
          </span>
        </td>
        <td className="table-width-md">
          {numberFormat.format(alert.new_value)}
        </td>
        <td className="table-width-md">
          <SimpleTooltip
            textClass="detail-hint"
            text={`${alert.amount_pct}%`}
            tooltipText={`Absolute difference: ${alert.amount_abs}`}
          />
        </td>
        <td className="table-width-lg">
          <ProgressBar
            magnitude={this.getCappedMagnitude(alert.amount_pct)}
            regression={alert.is_regression}
            color={!alert.is_regression ? 'success' : 'danger'}
          />
        </td>
        <td className="table-width-sm">
          <SimpleTooltip
            textClass="detail-hint"
            text={
              alert.manually_created ? (
                <FontAwesomeIcon
                  title="Alert created by a Sheriff"
                  icon={faUser}
                />
              ) : (
                numberFormat.format(alert.t_value)
              )
            }
            tooltipText={
              alert.manually_created
                ? 'Alert created by a Sheriff'
                : 'Confidence value as calculated by Perfherder alerts. Note that this is NOT the same as the calculation used in the compare view'
            }
          />
        </td>
      </tr>
    );
  }
}

AlertTableRow.propTypes = {
  alertSummary: PropTypes.shape({
    repository: PropTypes.string,
    framework: PropTypes.number,
    id: PropTypes.number,
  }).isRequired,
  user: PropTypes.shape({}),
  alert: PropTypes.shape({
    starred: PropTypes.bool,
  }).isRequired,
  timeRange: PropTypes.number.isRequired,
  updateSelectedAlerts: PropTypes.func.isRequired,
  selectedAlerts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allSelected: PropTypes.bool.isRequired,
};

AlertTableRow.defaultProps = {
  user: null,
};
