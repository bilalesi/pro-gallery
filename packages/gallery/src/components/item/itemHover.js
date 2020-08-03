import React from 'react';
import {GALLERY_CONSTS, utils} from 'pro-gallery-lib';
import { GalleryComponent } from '../galleryComponent';

export default class ItemHover extends GalleryComponent {
  getHoverClass() {
    const { styleParams, forceShowHover } = this.props;
    const hoverClass = ['gallery-item-hover'];

    hoverClass.push(
      'fullscreen-' + (styleParams.fullscreen ? 'enabled' : 'disabled'),
    );

    if (utils.isUndefined(styleParams.itemOpacity)) {
      //if gallery was just added to the page, and it's settings were never opened,
      //the styles of opacity and background were not set (are undefined),
      //so we are using the default background & opacity (is scss under .gallery-item-hover.default)
      hoverClass.push('default');
    }

    if (forceShowHover) {
      //in mobile, when item is hovered (tapped, with all the right configurations), forceShowHover is true
      hoverClass.push('force-hover');
    } else if (utils.isMobile()) {
      hoverClass.push('hide-hover');
    }

    return hoverClass.join(' ');
  }

  render() {
    const {
      imageDimensions,
      actions,
      idx,
      itemWasHovered,
      renderCustomInfo,
      styleParams,
    } = this.props;
    const hoverClass = this.getHoverClass();
    const { marginLeft, marginTop, width, height, ...restOfDimensions } =
      imageDimensions || {};
    //width and height will be taken from the gallery.scss and not be inline

    const { hoveringBehaviour, overlayAnimation } = styleParams;
    const { APPEARS } = GALLERY_CONSTS.infoBehaviourOnHover;
    const { NO_EFFECT } = GALLERY_CONSTS.overlayAnimations;
    //when there is a specific overlayAnimation, to support the animation we render the itemHover before any hover activity (see 'shouldHover()' in itemView).
    //so in this specific case, the itemHover exists right away, but we do'nt want to render yet the hover-inner,
    //the hover-inner will be rendered only after (at) the first hover an on, and not before.
    const shouldRenderHoverInnerIfExist = hoveringBehaviour === APPEARS && overlayAnimation !== NO_EFFECT ? itemWasHovered : true;

    return (
      <div
        className={hoverClass}
        key={'item-hover-' + idx}
        data-hook={'item-hover-' + idx}
        aria-hidden={true}
        style={imageDimensions && imageDimensions.borderRadius ? {borderRadius: imageDimensions.borderRadius} : {}}
      >
        <div
          style={{height: '100%'}}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
        >
          {shouldRenderHoverInnerIfExist && renderCustomInfo ? (
            <div className="gallery-item-hover-inner">
              {renderCustomInfo()}
            </div>) : null}
        </div>
      </div>
    );
  }
}
