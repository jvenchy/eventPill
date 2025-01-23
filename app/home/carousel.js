// carousel.js

/**
 * Custom error class for carousel-related errors.
 * @param {string} message - The error message.
 */
function CarouselError(message) {
  this.name = 'CarouselError';
  this.message = message;
  this.stack = (new Error()).stack;
}
CarouselError.prototype = Object.create(Error.prototype);
CarouselError.prototype.constructor = CarouselError;

const React = require('react');
import useEmblaCarousel from 'embla-carousel-react';
const { ArrowLeft, ArrowRight } = require('lucide-react');
import { Button } from './button';

/**
 * Carousel component props.
 * @typedef {Object} CarouselProps
 * @property {Object} [opts] - Carousel options.
 * @property {Array} [plugins] - Carousel plugins.
 * @property {string} [orientation] - Orientation of the carousel ('horizontal' or 'vertical').
 * @property {function} [setApi] - Function to set the carousel API.
 */

/**
 * Carousel context props.
 * @typedef {Object} CarouselContextProps
 * @property {Object} carouselRef - Reference to the carousel.
 * @property {Object} api - Carousel API.
 * @property {function} scrollPrev - Function to scroll to the previous item.
 * @property {function} scrollNext - Function to scroll to the next item.
 * @property {boolean} canScrollPrev - Whether it is possible to scroll to the previous item.
 * @property {boolean} canScrollNext - Whether it is possible to scroll to the next item.
 * @property {Object} opts - Carousel options.
 * @property {string} orientation - Orientation of the carousel.
 */

const CarouselContext = React.createContext(null);

/**
 * Hook to use the carousel context.
 * @throws {CarouselError} If used outside of a Carousel component.
 * @returns {CarouselContextProps} The carousel context.
 */
function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new CarouselError('useCarousel must be used within a <Carousel />');
  }
  return context;
}

/**
 * Carousel component.
 * @param {Object} props - Component props.
 * @param {string} [props.orientation='horizontal'] - Orientation of the carousel.
 * @param {Object} [props.opts] - Carousel options.
 * @param {function} [props.setApi] - Function to set the carousel API.
 * @param {Array} [props.plugins] - Carousel plugins.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {Object} props.ref - Reference to the component.
 * @returns {React.ReactElement} The carousel component.
 */
const Carousel = React.forwardRef((props, ref) => {
  const {
    orientation = 'horizontal',
    opts,
    setApi,
    plugins,
    className,
    children,
    ...otherProps
  } = props;

  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === 'horizontal' ? 'x' : 'y',
  }, plugins);

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api) => {
    if (!api) {
      return;
    }

    try {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    } catch (error) {
      throw new CarouselError('Error updating scroll state: ' + error.message);
    }
  }, []);

  const scrollPrev = React.useCallback(() => {
    try {
      if (api) {
        api.scrollPrev();
      } else {
        throw new CarouselError('Carousel API is not available');
      }
    } catch (error) {
      throw new CarouselError('Error scrolling to previous item: ' + error.message);
    }
  }, [api]);

  const scrollNext = React.useCallback(() => {
    try {
      if (api) {
        api.scrollNext();
      } else {
        throw new CarouselError('Carousel API is not available');
      }
    } catch (error) {
      throw new CarouselError('Error scrolling to next item: ' + error.message);
    }
  }, [api]);

  const handleKeyDown = React.useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollNext();
    }
  }, [scrollPrev, scrollNext]);

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    try {
      setApi(api);
    } catch (error) {
      throw new CarouselError('Error setting API: ' + error.message);
    }
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      try {
        if (api) {
          api.off('select', onSelect);
          api.off('reInit', onSelect);
        }
      } catch (error) {
        throw new CarouselError('Error removing event listeners: ' + error.message);
      }
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts && opts.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={`relative ${className || ''}`}
        role="region"
        aria-roledescription="carousel"
        {...otherProps}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = 'Carousel';

/**
 * Carousel content component.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {Object} props.ref - Reference to the component.
 * @returns {React.ReactElement} The carousel content component.
 */
const CarouselContent = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={`flex ${orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col'} ${className || ''}`}
        {...otherProps}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

/**
 * Carousel item component.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - Child elements.
 * @param {Object} props.ref - Reference to the component.
 * @returns {React.ReactElement} The carousel item component.
 */
const CarouselItem = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={`min-w-0 shrink-0 grow-0 basis-full ${orientation === 'horizontal' ? 'pl-4' : 'pt-4'} ${className || ''}`}
      {...otherProps}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

/**
 * Carousel previous button component.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {string} [props.variant='outline'] - Button variant.
 * @param {string} [props.size='icon'] - Button size.
 * @param {Object} props.ref - Reference to the component.
 * @returns {React.ReactElement} The carousel previous button component.
 */
const CarouselPrevious = React.forwardRef((props, ref) => {
  const { className, variant = 'outline', size = 'icon', ...otherProps } = props;
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={`absolute h-8 w-8 rounded-full ${
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90'
      } ${className || ''}`}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...otherProps}
    >
      <ArrowLeft className="h-8 w-8" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

/**
 * Carousel next button component.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {string} [props.variant='outline'] - Button variant.
 * @param {string} [props.size='icon'] - Button size.
 * @param {Object} props.ref - Reference to the component.
 * @returns {React.ReactElement} The carousel next button component.
 */
const CarouselNext = React.forwardRef((props, ref) => {
  const { className, variant = 'outline', size = 'icon', ...otherProps } = props;
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={`absolute h-8 w-8 rounded-full ${
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90'
      } ${className || ''}`}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...otherProps}
    >
      <ArrowRight className="h-8 w-8" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = 'CarouselNext';

module.exports = {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
