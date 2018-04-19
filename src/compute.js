// Compute what scrolling needs to be done on required scrolling boxes for target to be in view
const isElement = el => el != null && typeof el == 'object' && el.nodeType === 1
/**
 * indicates if an element has scrollable space in the provided axis
 */
function hasScrollableSpace(el, axis) {
  if (axis === 'Y') {
    return el.clientHeight < el.scrollHeight
  }
  if (axis === 'X') {
    return el.clientWidth < el.scrollWidth
  }
  return false
}
/**
 * indicates if an element has a scrollable overflow property in the axis
 * @method canOverflow
 * @param {Node} el
 * @param {String} axis
 * @returns {Boolean}
 */
function canOverflow(el, axis) {
  var overflowValue = getComputedStyle(el, null)['overflow' + axis]
  return overflowValue === 'auto' || overflowValue === 'scroll'
}
/**
 * indicates if an element can be scrolled in either axis
 * @method isScrollable
 * @param {Node} el
 * @param {String} axis
 * @returns {Boolean}
 */
function isScrollable(el) {
  var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y')
  var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X')
  return isScrollableY || isScrollableX
}
export const compute = (maybeElement, options = {}) => {
  const { scrollMode = 'always', block = 'center', boundary } = options
  if (!isElement(maybeElement)) {
    throw new Error('Element is required in scrollIntoViewIfNeeded')
  }
  let target = maybeElement
  let targetRect = target.getBoundingClientRect()
  // Collect parents
  const frames = []
  let parent
  while (isElement((parent = target.parentNode)) && target !== boundary) {
    if (isScrollable(parent)) {
      frames.push(parent)
    }
    // next tick
    target = parent
  }
  // These values mutate as we loop through and generate scroll coordinates
  let offsetTop = 0
  let targetBlock
  let targetInline
  // Collect new scroll positions
  return frames.map(frame => {
    const frameRect = frame.getBoundingClientRect()
    // @TODO fix hardcoding of block => top/Y
    console.warn(
      'test',
      frame,
      frame.scrollTop,
      targetRect.top,
      frameRect.top,
      frame.scrollTop + targetRect.top - frameRect.top
    )
    let blockScroll
    // @TODO temp, need to follow steps outlined in spec
    if (true) {
      blockScroll = frame.scrollTop + targetRect.top - frameRect.top
    }
    // @TODO fix the if else pyramid nightmare
    if (block === 'start') {
      if (!targetBlock) {
        targetBlock = targetRect.top
      }
      if (document.documentElement === frame) {
        blockScroll = frame.scrollTop + targetBlock
      } else {
        blockScroll = frame.scrollTop + targetBlock - frameRect.top
        targetBlock -= blockScroll - frame.scrollTop
      }
    }
    if (block === 'end') {
      if (!targetBlock) {
        targetBlock = targetRect.bottom
      }
      if (document.documentElement === frame) {
        blockScroll = frame.scrollTop + targetBlock - targetRect.height
      } else {
        let offset = 0
        blockScroll = frame.scrollTop + targetBlock - frameRect.bottom
        // element needs to scroll from the top
        if (frameRect.bottom > targetBlock) {
          // prevent negative scrollTop values
          offset -= Math.min(frameRect.bottom - targetBlock, frame.scrollTop)
          console.error(
            'YES',
            frame.scrollTop + offset,
            offset,
            targetBlock - frameRect.bottom,
            frame.scrollTop,
            frame.scrollHeight
          )
          blockScroll = frame.scrollTop + offset
          targetBlock += frame.scrollTop - blockScroll
        }
        if (offset < 0) {
          console.log(
            targetBlock,
            frameRect.bottom,
            'negative offset',
            offset,
            'top',
            frame.scrollTop,
            'height',
            frame.scrollHeight,
            'final',
            frame.scrollTop - blockScroll
          )
          targetBlock += frame.scrollTop - blockScroll
        } else {
          console.log(
            'positive offset',
            offset,
            'top',
            frame.scrollTop,
            'height',
            frame.scrollHeight,
            'final'
          )
          targetBlock += frame.scrollTop - blockScroll
        }
      }
    }
    // @TODO fix hardcoding of inline => left/X
    const inlineScroll = frame.scrollLeft + targetRect.left - frameRect.left
    return [frame, blockScroll, inlineScroll]
  })
}