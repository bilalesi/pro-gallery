import LAYOUTS from '../../common/constants/layout';

export const fixedStyles = {
  galleryLayout: LAYOUTS.EMPTY,
}

export const createStyles = styles => {
  return {
    ...styles,
    ...fixedStyles,
    gallerySize: styles.modifiedGallerySize ? styles.gallerySize : Math.round(styles.gallerySize * 9 + 100),
    modifiedGallerySize: true
  }
}

