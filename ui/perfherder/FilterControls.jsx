import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Container,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
} from 'reactstrap';

import SimpleTooltip from '../shared/SimpleTooltip';
import DropdownMenuItems from '../shared/DropdownMenuItems';

import InputFilter from './InputFilter';

const FilterControls = ({
  dropdownOptions,
  filterOptions,
  updateFilterText,
  updateFilter,
}) => {
  const createButton = filter => (
    <Button
      color="info"
      outline
      onClick={() => updateFilter(filter.stateName)}
      active={filter.state}
    >
      {filter.text}
    </Button>
  );
  return (
    <Container fluid className="my-3 px-0">
      {dropdownOptions.length > 0 && (
        <Row className="p-3 justify-content-left">
          {dropdownOptions.map(dropdown => (
            <Col
              sm="auto"
              className="py-0 pl-0 pr-3"
              key={dropdown.selectedItem}
            >
              <UncontrolledDropdown className="mr-0 text-nowrap">
                <DropdownToggle caret>{dropdown.selectedItem}</DropdownToggle>
                <DropdownMenuItems
                  options={dropdown.options}
                  selectedItem={dropdown.selectedItem}
                  updateData={dropdown.updateData}
                />
              </UncontrolledDropdown>
            </Col>
          ))}
        </Row>
      )}
      <Row className="pb-3 pl-3 justify-content-left">
        <Col className="py-2 pl-0 pr-2 col-3">
          <InputFilter updateFilterText={updateFilterText} />
        </Col>
        {filterOptions.length > 0 &&
          filterOptions.map(filter => (
            <Col sm="auto" className="p-2" key={filter.stateName}>
              {filter.tooltipText ? (
                <SimpleTooltip
                  text={createButton(filter)}
                  tooltipText={filter.tooltipText}
                />
              ) : (
                createButton(filter)
              )}
            </Col>
          ))}
      </Row>
    </Container>
  );
};

FilterControls.propTypes = {
  dropdownOptions: PropTypes.arrayOf(PropTypes.shape({})),
  filterOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateFilter: PropTypes.func.isRequired,
  updateFilterText: PropTypes.func.isRequired,
};

FilterControls.defaultProps = {
  dropdownOptions: null,
};

export default FilterControls;
