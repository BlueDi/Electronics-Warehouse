import React, { Component } from 'react';
import {
  Button,
  TextArea,
  Divider,
  Grid,
  Header,
  Message,
  Form
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

var replaceNL = function(text) {
  if (text) {
    return text.replace('\r\n\r\n', '<br/>').replace('\n\n', '<br/>');
  }
  return '';
};

/**
 * Default Editor type
 * By default, the editor has both code an preview views
 */
const defaultState = {
  canvasType: 'code',
  displayOnly: false
};

/**
 * This represents an HTML editor
 * It supports both code edition and preview
 *
 * Props received:
 * - canvasType: Indicates the default HTML canvas, "code"  or "preview"
 * - displayOnly: If desired, it can only allow html display, and no edition, by passing "displayOnly" prop with true value
 * - value: Value being displayed on the editor
 * - onChange: Event announcing the HTML code has been changed
 * - onSave: Event announcing the HTML code has been saved
 * - onReset: Event announcing the HTML code should be resetted (if undefined no button will appear)
 * - width: canvas width (default is 700)
 * - height: canvas height (default is 400)
 */
class HTMLEditor extends Component {
  constructor(props) {
    super(props);
    let canvasType;

    if (props.displayOnly) {
      canvasType = 'preview';
    } else if (props.canvasType === 'code' || props.canvasType === 'preview') {
      canvasType = props.canvasType;
    } else {
      canvasType = defaultState.canvasType;
    }

    this.state = {
      displayOnly: this.props.displayOnly,
      canvasType: canvasType,
      header: this.props.header,
      value: this.props.value,
      onChange: this.props.onChange,
      onSave: this.props.onSave,
      onReset: this.props.onReset,
      height: props.height ? parseInt(props.height) : 400,
      width: props.width ? parseInt(props.width) : 700
    };
  }

  setCanvasCode() {
    this.setState({ canvasType: 'code' });
  }

  setCanvasPreview() {
    this.setState({ canvasType: 'preview' });
  }

  renderHeader() {
    let writing = this.state.canvasType === 'code',
      previewing = this.state.canvasType === 'preview';
    let name = (
      <Grid.Column>
        <Header as="h2" content={this.state.header} />
      </Grid.Column>
    );
    let buttons = (
      <Grid.Column>
        <Button.Group floated="right">
          <Button
            labelPosition="left"
            toggle
            active={writing}
            icon="edit"
            size="medium"
            content={writing ? 'Writing...' : 'Write'}
            onClick={this.setCanvasCode.bind(this)}
          />
          <Button
            labelPosition="right"
            toggle
            active={previewing}
            icon="eye"
            size="medium"
            content={previewing ? 'Previewing...' : 'Preview'}
            onClick={this.setCanvasPreview.bind(this)}
          />
        </Button.Group>
      </Grid.Column>
    );

    return (
      <Grid>
        <Grid.Row columns={2}>
          {name}
          {!this.state.displayOnly && buttons}
        </Grid.Row>
      </Grid>
    );
  }

  renderFooter() {
    return (
      <React.Fragment>
        <Divider clearing />
        {this.state.onSave && (
          <Button
            floated="left"
            icon="save"
            content="Save"
            onClick={this.state.onSave}
          />
        )}
        {this.state.onReset && (
          <Button
            floated="right"
            icon="undo"
            content="Reset"
            onClick={this.state.onReset}
          />
        )}
      </React.Fragment>
    );
  }

  /**
   * Returns the preview content
   * Uses an HTML parser module, to convert the input to HTML
   */
  getHTMLPreview() {
    return (
      <Message fluid content={ReactHtmlParser(replaceNL(this.props.value))} />
    );
  }

  /**
   * Returns the text area where the user can introduce the code he wants to be converted to HTML
   */
  getHTMLCodeEditor() {
    return (
      <Form>
        <TextArea
          fluid
          className={this.props.className}
          style={{
            minHeight: 80,
            overflowY: 'scroll',
            fontSize: '12px'
          }}
          placeholder="Write something"
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </Form>
    );
  }

  /**
   * Renders the HTML editor according to the currently selected mode ("code" or "preview")
   * Also decides if the buttons should be rendered
   * There's the possibily to have the editor only in preview mode, in that case, no buttons are required
   */
  render() {
    return (
      <React.Fragment>
        {this.renderHeader()}
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
        {this.state.canvasType === 'code' && this.getHTMLCodeEditor()}
        {this.state.canvasType === 'preview' && this.getHTMLPreview()}
        {!this.state.displayOnly && this.renderFooter()}
      </React.Fragment>
    );
  }
}

export default HTMLEditor;
