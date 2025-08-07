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
  const [steps, setSteps] = useState(step);
  const [pictureWidth, setPictureWidth] = useState(itemWidth);
  const [sizeFrame, setSizeFrame] = useState(frameSize);
  const [durationOfAnimation, setDurationOfAnimation] =
    useState(animationDuration);
  const [infiniteCarousel, setInfiniteCarousel] = useState(infinite);
  const [transitionAnimation, setTransitionAnimation] = useState(true);

  const [, setMoveIndex] = useState(0);
  const [moveAmount, setMoveAmount] = useState(0);

  const getNext = () => {
    const reminder = images.length % steps;

    setMoveIndex(prevIndex => {
      const nextIndex = prevIndex + steps;

      if (infiniteCarousel) {
        setMoveAmount(pictureWidth * steps);

        const lastPart = items.slice(0, steps);

        setTimeout(() => {
          setItems([
            ...items.slice(steps, steps + steps),
            ...items.slice(steps),
          ]);
        }, durationOfAnimation);

        setTimeout(() => {
          setTransitionAnimation(false);
          setMoveAmount(0);
        }, durationOfAnimation * 1.2);

        setTimeout(() => {
          setItems([...items.slice(steps), ...lastPart]);
          setTransitionAnimation(true);
        }, durationOfAnimation * 1.3);
      } else {
        if (prevIndex >= images.length - reminder) {
          return prevIndex;
        }

        if (nextIndex === images.length - reminder) {
          const lastShown =
            Math.max(steps, sizeFrame) - Math.min(steps, sizeFrame);
          setMoveAmount(pictureWidth * (reminder + lastShown) + moveAmount);
        } else {
          setMoveAmount(pictureWidth * nextIndex);
        }
      }

      return nextIndex;
    });
  };

  const goPrev = () => {
    const reminder = images.length % steps;

    setMoveIndex(prevIndex => {
      const previousIndex = prevIndex - steps;

      if (infiniteCarousel) {
        setTransitionAnimation(false);
        setMoveAmount(pictureWidth * steps);
        setItems([
          ...items.slice(items.length - steps),
          ...items.slice(0, items.length - steps),
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
            Math.max(steps, sizeFrame) - Math.min(steps, sizeFrame);
          setMoveAmount(pictureWidth * lastShown);
        } else {
          setMoveAmount(pictureWidth * (previousIndex - steps + reminder));
        }
      }

      return previousIndex;
    });
  };

  return (
    <>
      <label htmlFor="itemId">
        Picture Width:
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPictureWidth(parseInt(e.target.value));
          }}
          id="itemId"
          type="number"
          name="pictureWidth"
          value={pictureWidth}
        />
      </label>
      <label htmlFor="stepId">
        Steps:
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSteps(parseInt(e.target.value));
          }}
          id="stepId"
          type="number"
          name="steps"
          value={steps}
        />
      </label>
      <label htmlFor="frameId">
        FrameSize:
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSizeFrame(parseInt(e.target.value));
          }}
          id="frameId"
          type="number"
          name="frameSize"
          value={sizeFrame}
        />
      </label>
      <label htmlFor="durationId">
        Animation Duration:
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDurationOfAnimation(parseInt(e.target.value));
          }}
          id="durationId"
          type="number"
          name="animationDuration"
          value={durationOfAnimation}
        />
      </label>
      <label htmlFor="infinite">
        Infinite carousel:
        <select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setInfiniteCarousel(e.target.value === 'true');
          }}
          name="infinite"
          id="infinite"
          value={infiniteCarousel ? 'true' : 'false'}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        {/* <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDurationOfAnimation(parseInt(e.target.value));
          }}
          id="infinite"
          type="number"
          name="animationDuration"
          value={durationOfAnimation}
        /> */}
      </label>
      <div className="Carousel">
        <div className="Carousel__list">
          <button
            onClick={() => {
              goPrev();
            }}
            className="prev"
            type="button"
          ></button>
          <ul
            className="Carousel__wrapper"
            style={{
              width: `${sizeFrame * pictureWidth}px`,
              overflow: 'hidden',
            }}
          >
            {items.map((img, i) => {
              return (
                <li key={i}>
                  <img
                    width={pictureWidth}
                    style={{
                      transform: `translate(-${moveAmount}px)`,
                      transition: transitionAnimation
                        ? `transform ${durationOfAnimation / 1000}s linear`
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
            className="next"
            type="button"
          ></button>
        </div>
      </div>
    </>
  );
};

export default Carousel;
