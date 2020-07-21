import React from 'react';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { GalleryComponent } from '../galleryComponent';
import { isSEOMode, isPrerenderMode } from '../../common/window/viewModeWrapper';
import utils from '../../common/utils';

const BLURRY_IMAGE_REMOVAL_ANIMATION_DURATION = 1000;
export default class ImageItem extends GalleryComponent {
  constructor(props) {
    super(props);
    this.getImageContainer = this.getImageContainer.bind(this);
    this.getImageContainerClassNames = this.getImageContainerClassNames.bind(this);
    this.getImageElement = this.getImageElement.bind(this);

    this.state = {
      isHighResImageLoaded: false,
    }

    this.removeLowResImageTimeoutId = undefined;
    this.handleHighResImageLoad = this.handleHighResImageLoad.bind(this);
  }

  componentDidMount() {
    try {
      if (typeof this.props.actions.setItemLoaded === 'function') {
        this.props.actions.setItemLoaded();
      }
    } catch (e) {
      console.error(e);
    }
  }

  handleHighResImageLoad({ target }){
    this.props.actions.setItemLoaded();
    target.style.opacity = '1';
    this.removeLowResImageTimeoutId = setTimeout((() => {
      this.setState({ isHighResImageLoaded: true});
      this.removeLowResImageTimeoutId = undefined;
    }), BLURRY_IMAGE_REMOVAL_ANIMATION_DURATION);
  }

  componentWillUnmount(){
    if (this.removeLowResImageTimeoutId !== undefined) {
      clearTimeout(this.removeLowResImageTimeoutId);
    }
  }


  getImageContainerClassNames() {
    const {
      styleParams,
    } = this.props;

    const imageContainerClassNames = [
      'gallery-item-content',
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      styleParams.cubeImages && styleParams.cubeType === 'fit'
        ? 'grid-fit'
        : '',
      styleParams.imageLoadingMode === GALLERY_CONSTS.loadingMode.COLOR
        ? 'load-with-color'
        : '',
    ].join(' ');

    return imageContainerClassNames
  }

  getImageContainer(imageRenerer, classNames, extraNodes) {
    const {
      imageDimensions,
      id,
      actions,
    } = this.props;

    return (
      <div
        className={classNames}
        onTouchStart={actions.handleItemMouseDown}
        onTouchEnd={actions.handleItemMouseUp}
        key={'image_container-' + id}
        data-hook={'image-item'}
        style={imageDimensions.borderRadius ? {borderRadius: imageDimensions.borderRadius} : {}}
      >
        {imageRenerer()}
        {extraNodes}
      </div>
    );
  };

  getImageElement() {
      const {
      alt,
      imageDimensions,
      createUrl,
      id,
      settings,
      lazyLoad,
      styleParams,
    } = this.props;
    const { isHighResImageLoaded } = this.state;
    const imageProps =
      settings &&
        settings.imageProps &&
        typeof settings.imageProps === 'function'
        ? settings.imageProps(id)
        : {};

    const { marginLeft, marginTop, ...restOfDimensions } =
    imageDimensions || {};
    const useImageTag = lazyLoad === GALLERY_CONSTS.lazyLoad.NATIVE || isSEOMode();


    const image = () => {
      const imagesComponents =[]

      if (!isHighResImageLoaded){
        let preload = null;
        const preloadProps = {
          className: 'gallery-item-visible gallery-item gallery-item-preloaded',
          key: 'gallery-item-image-img-preload',
          'data-hook': 'gallery-item-image-img-preload',
          loading: "lazy",
          ...imageProps
        };
        const preloadStyles = isPrerenderMode() ? {
          width: '100%',
          height: '100%',
        } : {};
        switch (styleParams.imageLoadingMode) {
          case GALLERY_CONSTS.loadingMode.BLUR:
            const imageStyles = {
              ...restOfDimensions,
              backgroundSize: '0.3px',
              backgroundRepeat: 'repeat',
              transition: 'all 3s ease-in-out'
            };
            preload = <img
              alt=''
              key={'image_preload_blur-' + id}
              src={createUrl(GALLERY_CONSTS.urlSizes.RESIZED, isSEOMode() ? GALLERY_CONSTS.urlTypes.SEO : GALLERY_CONSTS.urlTypes.LOW_RES)}
              style={{...imageStyles, ...preloadStyles}}
              {...preloadProps}
            />
            break;
          case GALLERY_CONSTS.loadingMode.MAIN_COLOR:
            preload = <img
              alt=''
              key={'image_preload_main_color-' + id}
              src={createUrl(GALLERY_CONSTS.urlSizes.PIXEL, isSEOMode() ? GALLERY_CONSTS.urlTypes.SEO : GALLERY_CONSTS.urlTypes.LOW_RES)}
              style={{...restOfDimensions, ...preloadStyles}}
              {...preloadProps}
            />
            break;
        }

        imagesComponents.push(preload);
      }

      const shouldRenderHighResImages = !isPrerenderMode() && !utils.isSSR();
      if (shouldRenderHighResImages) {
        const highres = <img
          key={'image_highres-' + id}
          className={'gallery-item-visible gallery-item gallery-item-hidden gallery-item-preloaded'}
          data-hook='gallery-item-image-img'
          alt={alt ? alt : 'untitled image'}
          src={createUrl(GALLERY_CONSTS.urlSizes.RESIZED, isSEOMode() ? GALLERY_CONSTS.urlTypes.SEO : GALLERY_CONSTS.urlTypes.HIGH_RES)}
          loading="lazy"
          onLoad={this.handleHighResImageLoad}
          style={restOfDimensions}
          {...imageProps}
        />;

        imagesComponents.push(highres)
      }

      return imagesComponents;
    }

    const canvas = () => (
      <canvas
        key={
          (styleParams.cubeImages && styleParams.cubeType === 'fill'
            ? 'cubed-'
            : '') + 'image'
        }
        className={
          'gallery-item-visible gallery-item gallery-item-hidden gallery-item-preloaded'
        }
        data-hook='gallery-item-image-canvas'
        role="img"
        alt={alt ? alt : 'untitled image'}
        data-src={createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.HIGH_RES)}
        style={restOfDimensions}
        {...imageProps}
      />
    );

    return useImageTag ? image : canvas
  }

  render() {
    const imageRenderer = this.getImageElement();
    const imageContainerClassNames = this.getImageContainerClassNames();
    const renderedItem = this.getImageContainer(imageRenderer, imageContainerClassNames)
    return renderedItem;
  }
}
