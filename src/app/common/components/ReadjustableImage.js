import React, { Component } from 'react';

class ReadjustableImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: '',
      height: '',
      readjusted: false
    };

    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  handleImageLoaded({ target: image }) {
    let imageWidth = image.offsetWidth;
    let imageHeight = image.offsetHeight;
    let AR = imageWidth / imageHeight;

    if (imageHeight > this.props.maxHeight) {
      imageHeight = this.props.maxHeight;
      imageWidth = imageHeight * AR;
    }
    if (imageWidth > this.props.maxWidth) {
      imageWidth = this.props.maxWidth;
      imageHeight = imageWidth / AR;
    }

    this.setState({
      width: imageWidth,
      height: imageHeight,
      readjusted: true
    });
  }

  render() {
    return (
      <img
        src={this.props.src}
        onLoad={this.handleImageLoaded}
        width={this.state.width}
        height={this.state.height}
      />
    );
  }
}

export default ReadjustableImage;
