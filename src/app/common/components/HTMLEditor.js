import React, { Component } from 'react';
import { Button, TextArea, Divider } from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

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
 * - width: canvas width (default is 700)
 * - height: canvas height (default is 400)
 */
class HTMLEditor extends Component {
  constructor(props) {
    super(props);

    let height = 400;
    if (props.height) {
      height = parseInt(props.height);
    }

    let width = 700;
    if (props.width) {
      width = parseInt(props.width);
    }

    let displayOnly = props.displayOnly;
    let canvasType;

    if (displayOnly) {
      canvasType = 'preview';
    } else if (props.canvasType === 'code' || props.canvasType === 'preview') {
      canvasType = props.canvasType;
    } else {
      canvasType = defaultState.canvasType;
    }

    this.state = {
      displayOnly: displayOnly,
      canvasType: canvasType,
      height: height,
      width: width
    };

    this.setCodeCanvas = this.setCodeCanvas.bind(this);
    this.setPreviewCanvas = this.setPreviewCanvas.bind(this);
  }

  /**
   * Changes the editor view to "code" mode
   */
  setCodeCanvas() {
    this.setState({
      canvasType: 'code'
    });
  }

  /**
   * Changes the editor view to "preview" mode
   */
  setPreviewCanvas() {
    this.setState({
      canvasType: 'preview'
    });
  }

  /**
   * Gives the code and preview buttons
   * The button corresponding to the currently selected mode is highlighted
   */
  getCanvasButtons() {
    let writeActive = this.state.canvasType === 'code';
    let previewActive = this.state.canvasType === 'preview';

    return (
      <React.Fragment>
        <Button.Group basic>
          <Button
            compact
            size="mini"
            active={writeActive}
            onClick={this.setCodeCanvas}
            content="Write"
          />
          <Button
            compact
            size="mini"
            active={previewActive}
            onClick={this.setPreviewCanvas}
            content="Preview"
          />
        </Button.Group>
        <Divider
          style={{ marginTop: 1, marginBottom: 1, width: this.state.width }}
        />
      </React.Fragment>
    );
  }

  /**
   * Returns the preview content
   * Uses an HTML parser module, to convert the input to HTML
   */
  getHTMLPreview() {
    return (
      <div
        style={{
          backgroundColor: '#ebebe4',
          marginBottom: 4,
          height: this.state.height,
          width: this.state.width,
          overflowY: 'scroll',
          fontSize: '12px'
        }}
      >
        {ReactHtmlParser(this.props.value)}
      </div>
    );
  }

  /**
   * Returns the text area where the user can introduce the code he wants to be converted to HTML
   */
  getHTMLCodeEditor() {
    return (
      <TextArea
        className={this.props.className}
        style={{
          height: this.state.height,
          width: this.state.width,
          overflowY: 'scroll',
          fontSize: '12px'
        }}
        placeholder="Add a comment"
        onChange={this.props.onChange}
        value={this.props.value}
      />
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
        {!this.state.displayOnly && this.getCanvasButtons()}

        {this.state.canvasType === 'code' && this.getHTMLCodeEditor()}
        {this.state.canvasType === 'preview' && this.getHTMLPreview()}
      </React.Fragment>
    );
  }
}

export default HTMLEditor;
