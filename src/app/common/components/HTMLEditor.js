import React, { Component } from 'react';
import { Button, TextArea, Divider } from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

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

  setCodeCanvas() {
    this.setState({
      canvasType: 'code'
    });
  }

  setPreviewCanvas() {
    this.setState({
      canvasType: 'preview'
    });
  }

  getCanvasButtons() {
    return (
      <div>
        <Button.Group basic>
          <Button compact size="mini" onClick={this.setCodeCanvas}>
            Write
          </Button>
          <Button compact size="mini" onClick={this.setPreviewCanvas}>
            Preview
          </Button>
        </Button.Group>
        <Divider style={{ marginTop: 1, marginBottom: 1 }} />
      </div>
    );
  }

  getHTMLPreview() {
    return (
      <div
        style={{
          backgroundColor: '#ebebe4',
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

  render() {
    return (
      <div>
        {!this.state.displayOnly && this.getCanvasButtons()}

        {this.state.canvasType === 'code' && this.getHTMLCodeEditor()}
        {this.state.canvasType === 'preview' && this.getHTMLPreview()}
      </div>
    );
  }
}

export default HTMLEditor;
