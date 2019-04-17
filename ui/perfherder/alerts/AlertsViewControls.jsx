import React from 'react';
import PropTypes from 'prop-types';
// import { Col, Row, Container, Button } from 'reactstrap';

// import SimpleTooltip from '../../shared/SimpleTooltip';
import FilterControls from '../FilterControls';
import { convertParams } from '../helpers';
import { alertSummaryStatus } from '../constants';

export default class AlertsViewControls extends React.Component {
  constructor(props) {
    super(props);
    this.validated = this.props.validated;
    this.state = {
      hideImprovements: convertParams(this.validated, 'hideImprovements'),
      hideDownstream: convertParams(this.validated, 'hideDwnToInv'),
      // filterText: '',
    };
  }

  // componentDidMount() {
  //   this.updateFilteredResults();
  // }

  // componentDidUpdate(prevProps) {
  //   const { compareResults } = this.props;
  //   if (prevProps.compareResults !== compareResults) {
  //     this.updateFilteredResults();
  //   }
  // }

  // updateFilterText = filterText => {
  //   this.setState({ filterText }, () => this.updateFilteredResults());
  // };

  // filterResult = (testName, result) => {
  //   const {
  //     filterText,
  //     showImportant,
  //     hideUncertain,
  //     showNoise,
  //     hideUncomparable,
  //   } = this.state;

  //   const matchesFilters =
  //     (!showImportant || result.isMeaningful) &&
  //     (!hideUncomparable || 'newIsBetter' in result) &&
  //     (!hideUncertain || result.isConfident) &&
  //     (!showNoise || result.isNoiseMetric);

  //   if (!filterText) return matchesFilters;

  //   const words = filterText
  //     .split(' ')
  //     .map(word => `(?=.*${word})`)
  //     .join('');
  //   const regex = RegExp(words, 'gi');
  //   const text = `${testName} ${result.name}`;

  //   // searching with filter input and one or more metricFilter buttons on
  //   // will produce different results compared to when all filters are off
  //   return regex.test(text) && matchesFilters;
  // };

  // updateFilteredResults = () => {
  //   const {
  //     filterText,
  //     hideUncomparable,
  //     showImportant,
  //     hideUncertain,
  //     showNoise,
  //   } = this.state;

  //   const { compareResults } = this.props;

  //   if (
  //     !filterText &&
  //     !hideUncomparable &&
  //     !showImportant &&
  //     !hideUncertain &&
  //     !showNoise
  //   ) {
  //     return this.setState({ results: compareResults });
  //   }

  //   const filteredResults = new Map(compareResults);

  //   for (const [testName, values] of filteredResults) {
  //     const filteredValues = values.filter(result =>
  //       this.filterResult(testName, result),
  //     );

  //     if (filteredValues.length) {
  //       filteredResults.set(testName, filteredValues);
  //     } else {
  //       filteredResults.delete(testName);
  //     }
  //   }
  //   this.setState({ results: filteredResults });
  // };

  updateFilter = filter => {
    this.setState(
      prevState => ({ [filter]: !prevState[filter] }),
      () => this.updateFilteredResults(),
    );
  };

  render() {
    const { hideImprovements, hideDownstream } = this.state;
    const { dropdownOptions } = this.props;
    const alertFilters = [
      {
        text: 'Hide improvements',
        state: hideImprovements,
        stateName: 'hideImprovements',
      },
      {
        text: 'Hide downstream / reassigned to / invalid',
        state: hideDownstream,
        stateName: 'hideDownstream',
      },
    ];

    return (
      <FilterControls
        dropdownOptions={dropdownOptions}
        filterOptions={alertFilters}
        updateFilter={() => {}}
        updateFilterText={() => {}}
      />
    );
  }
}

AlertsViewControls.propTypes = {
  validated: PropTypes.shape({}).isRequired,
};
