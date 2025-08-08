import React, { useState } from 'react';
import './Carousel.scss';

type Props = {
  images: string[];
  step: number;
  frameSize: number;
  itemWidth: number;
  animationDuration: number;
  infinite: boolean;
};

const Carousel: React.FC<Props> = ({
  images,
  step,
  frameSize,
  itemWidth,
  animationDuration,
  infinite,
}: Props) => {
  const [items, setItems] = useState(images);
  const [nextDisable, setNextDisable] = useState(false);
  const [prevDisable, setPrevDisable] = useState(false);
  const [transitionAnimation, setTransitionAnimation] = useState(true);

  const [, setMoveIndex] = useState(0);
  const [moveAmount, setMoveAmount] = useState(0);

  const getNext = () => {
    const reminder = images.length % step;

    setPrevDisable(false);

    setMoveIndex(prevIndex => {
      const nextIndex = prevIndex + step;

      if (infinite) {
        setMoveAmount(itemWidth * step);

        const lastPart = items.slice(0, step);

        setTimeout(() => {
          setItems([
            ...items.slice(step, step + step),
            ...items.slice(step),
          ]);
        }, animationDuration);

        setTimeout(() => {
          setTransitionAnimation(false);
          setMoveAmount(0);
        }, animationDuration * 1.2);

        setTimeout(() => {
          setItems([...items.slice(step), ...lastPart]);
          setTransitionAnimation(true);
        }, animationDuration * 1.3);
      } else {
        if (prevIndex >= images.length - reminder) {
          return prevIndex;
        }

        if (nextIndex === images.length - reminder) {
          const lastShown =
            Math.max(step, frameSize) - Math.min(step, frameSize);
          setMoveAmount(itemWidth * (reminder + lastShown) + moveAmount);
          setNextDisable(true);
        } else {
          setMoveAmount(itemWidth * nextIndex);
        }
      }

      return nextIndex;
    });
  };

  const goPrev = () => {
    const reminder = images.length % step;

    setNextDisable(false);

    setMoveIndex(prevIndex => {
      const previousIndex = prevIndex - step;

      if (infinite) {
        setTransitionAnimation(false);
        setMoveAmount(itemWidth * step);
        setItems([
          ...items.slice(items.length - step),
          ...items.slice(0, items.length - step),
        ]);
        setTimeout(() => {
          setTransitionAnimation(true);
          setMoveAmount(0);
        });
      } else {
        if (prevIndex === 0) {
          return prevIndex;
        }

        if (previousIndex === 0) {
          const lastShown =
            Math.max(step, frameSize) - Math.min(step, frameSize);
          setMoveAmount(itemWidth * lastShown);
          setPrevDisable(true);
        } else {
          setMoveAmount(itemWidth * (previousIndex - step + reminder));
        }
      }

      return previousIndex;
    });
  };

  return (
    <div className="Carousel">
      <div className="Carousel__list">
        <button
          onClick={() => {
            goPrev();
          }}
          className={`prev ${prevDisable ? 'disabled' : ''}`}
          type="button"
        ></button>
        <ul
          className="Carousel__wrapper"
          style={{
            width: `${frameSize * itemWidth}px`,
            overflow: 'hidden',
          }}
        >
          {items.map((img, i) => {
            return (
              <li key={i}>
                <img
                  width={itemWidth}
                  style={{
                    transform: `translate(-${moveAmount}px)`,
                    transition: transitionAnimation
                      ? `transform ${animationDuration / 1000}s linear`
                      : 'none',
                  }}
                  src={img}
                  alt={`${items.indexOf(img) + 1}`}
                  className="Carousel__img"
                />
              </li>
            );
          })}
        </ul>
        <button
          data-cy="next"
          onClick={() => {
            getNext();
          }}
          className={`next ${nextDisable ? 'disabled' : ''}`}
          type="button"
        ></button>
      </div>
    </div>
  );
};

export default Carousel;
