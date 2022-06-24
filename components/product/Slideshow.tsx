import Image from "next/image";
import React, { FC } from "react";
import { Slide } from "react-slideshow-image";
interface Props {
  images: string[];
}

import "react-slideshow-image/dist/styles.css";

export const Slideshow: FC<Props> = ({ images }) => {
  return (
    <div className="slide-container">
      <Slide easing="ease" autoplay={false} indicators>
        {images.map((im) => (
          <div className="each-slide" key={im}>
            <div
              style={{
                backgroundImage: `url('${im}')`,
                height: "80vh",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
        ))}
      </Slide>
    </div>
  );
};
