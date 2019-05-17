import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row,
} from 'reactstrap';
import debounce from 'lodash/debounce';

export default class BugModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.defaultValue,
      inputValue: '',
      invalidInput: false,
      validated: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dropdownList !== this.props.dropdownList) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selectedValue: this.props.dropdownList[0].text });
    }
  }

  // eslint-disable-next-line react/sort-comp
  validateInput = debounce(() => {
    const { inputValue } = this.state;
    const regex = /^[1-9]+[0-9]*$/;
    const updates = { validated: true, invalidInput: false };

    if (!inputValue.length) {
      return;
    }
    if (!inputValue.match(regex)) {
      updates.invalidInput = true;
    }

    this.setState(updates);
  }, 1000);

  updateInput = event => {
    this.setState(
      { inputValue: event.target.value, validated: false },
      this.validateInput,
    );
  };

  render() {
    const {
      showModal,
      toggle,
      updateAndClose,
      dropdownOption,
      header,
      title,
    } = this.props;

    const { inputValue, invalidInput, validated, selectedValue } = this.state;

    return (
      <Modal isOpen={showModal}>
        <ModalHeader toggle={toggle}>{header}</ModalHeader>
        <Form>
          <ModalBody>
            <FormGroup>
              <Row>
                <Col>
                  <Label for="taskId">{title}</Label>
                  <Input
                    value={inputValue}
                    onChange={this.updateInput}
                    name="taskId"
                    placeholder="123456"
                  />
                </Col>
                {dropdownOption(selectedValue)}
              </Row>
              <Row>
                <Col>
                  {invalidInput && validated && (
                    <p className="text-danger pt-2 text-wrap">
                      Input should only contain numbers and not start with 0
                    </p>
                  )}
                </Col>
              </Row>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={event =>
                updateAndClose(event, inputValue, selectedValue)
              }
              disabled={invalidInput || !inputValue.length || !validated}
              type="submit"
            >
              Assign
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

BugModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  dropdownList: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      id: PropTypes.number,
    }),
  ),
  alertSummary: PropTypes.shape({}).isRequired,
  updateAndClose: PropTypes.func.isRequired,
  dropdownOption: PropTypes.func,
  defaultValue: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

BugModal.defaultProps = {
  dropdownList: [],
  dropdownOption: null,
};
