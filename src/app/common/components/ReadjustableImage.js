import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';

/**
 * Creates an image that can be resized to fit given dimensions
 * While the image is being resized, the user cannot see it
 * This improves user experience, because we don't see a gigantic image in one frame, and the resized image in the next
 * The user only sees the final result
 *
 * Props:
 * {maxHeight} and {maxWidth} - image maximum allowed dimensions
 */
class ReadjustableImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: '',
      height: '',
      resized: false
    };
  }

  /**
   * Event handler called when the image is loaded
   * Here is where we can access image information regarding its original dimensions
   *
   * @param {image} image being rendered. We can access its dimensions with "offsetWidth" and "offsetHeight" attributes
   */
  handleImageLoaded = ({ target: image }) => {
    let imageWidth = image.offsetWidth;
    let imageHeight = image.offsetHeight;
    let AR = imageWidth / imageHeight;

    //resize image if surpasses dimension limits
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
      resized: true
    });
  };

  /**
   * load the image inside a div with the maximum dimensions received as props
   * so that the image assumes the div size and not its natural dimensions
   */
  nonResizedImage() {
    return (
      <div style={{ width: this.props.maxWidth, height: this.props.maxHeight }}>
        <Image src={this.props.src} onLoad={this.handleImageLoaded} />
      </div>
    );
  }

  /**
   * Render the image freely, without being inside a div.
   * Its dimensions must been restrained.
   */
  resizedImage() {
    return (
      <Image
        src={this.props.src}
        onLoad={this.handleImageLoaded}
        style={{ width: this.state.width, height: this.state.height }}
      />
    );
  }

  /**
   * Render the image according to the resizing phase
   */
  render() {
    return this.state.resized ? this.resizedImage() : this.nonResizedImage();
  }
}

export default ReadjustableImage;
