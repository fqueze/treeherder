import React from 'react';
import PropTypes from 'prop-types';
import { react2angular } from 'react2angular/index.es2015';
import { Alert, Container } from 'reactstrap';

import perf from '../../js/perf';
import withValidation from '../Validation';
import { convertParams, getFrameworkData, getStatus } from '../helpers';
import { alertSummaryStatus } from '../constants';
import FilterControls from '../FilterControls';

import AlertsViewControls from './AlertsViewControls';

// TODO remove $stateParams and $state after switching to react router
export class AlertsView extends React.Component {
  constructor(props) {
    super(props);
    this.validated = this.props.validated;
    this.state = {
      status: this.getDefaultStatus(),
      framework: getFrameworkData(this.validated),
      page: this.validated.page ? parseInt(this.validated.page) : 1,
    };
  }
  // TODO need to add alert validation to Validation component
  // if ($stateParams.id) {
  //   $scope.alertId = $stateParams.id;
  //   getAlertSummary($stateParams.id).then(
  //       function (data) {
  //           addAlertSummaries([data], null);
  //       });
  componentDidMount() {

  }
    // getAlertSummaries({
    //     statusFilter: $scope.filterOptions.status.id,
    //     frameworkFilter: $scope.filterOptions.framework.id,
    //     page: $scope.filterOptions.page,
    // }).then(
    //     function (data) {
    //         addAlertSummaries(data.results, data.next);
    //         $scope.alertSummaryCurrentPage = $scope.filterOptions.page;
    //         $scope.alertSummaryCount = data.count;
    // });

  getDefaultStatus = () => {
    const { validated } = this.props;
    const statusParam = convertParams(validated, 'status');
    if (!statusParam) {
      return Object.keys(alertSummaryStatus)[1];
    }
    return getStatus(parseInt(validated.status, 10));
  };

  updateFramework = selection => {
    const { frameworks, updateParams } = this.props.validated;
    const framework = frameworks.find(item => item.name === selection);

    updateParams({ framework: framework.id });
    // TODO fetch new data
    this.setState({ framework });
  };

  updateStatus = status => {
    const statusId = alertSummaryStatus[status];
    this.props.validated.updateParams({ status: statusId });
    // TODO fetch new data, use statusId as param
    this.setState({ status });
  }

  render() {
    const { user, validated } = this.props;
    const { framework, status } = this.state;
    const { frameworks } = validated;

    const frameworkNames =
    frameworks && frameworks.length ? frameworks.map(item => item.name) : [];

    const alertDropdowns = [
      {
        options: Object.keys(alertSummaryStatus),
        selectedItem: status,
        updateData: this.updateStatus,
      },
      {
        options: frameworkNames,
        selectedItem: framework.name,
        updateData: this.updateFramework,
      },
    ];

    return (
      <Container fluid className="max-width-default">
        {!user.isStaff && (
          <Alert color="info">
            You must be logged into perfherder/treeherder and be a sheriff to
            make changes
          </Alert>
        )}
        <AlertsViewControls {...this.props} dropdownOptions={alertDropdowns} />
      </Container>
    );
  }
}

AlertsView.propTypes = {
  $stateParams: PropTypes.shape({}),
  $state: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  validated: PropTypes.shape({}).isRequired,
};

AlertsView.defaultProps = {
  $stateParams: null,
  $state: null,
};

const alertsView = withValidation(new Set([]), false)(AlertsView);

perf.component(
  'alertsView',
  react2angular(alertsView, ['user'], ['$stateParams', '$state']),
);

export default alertsView;
