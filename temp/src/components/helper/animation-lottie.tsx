import Lottie, { LottieComponentProps } from "lottie-react";

type AnimationLottieProps = {
  animationPath: LottieComponentProps["animationData"];
};

const AnimationLottie = ({ animationPath }: AnimationLottieProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: "95%",
    },
  };

  return <Lottie {...defaultOptions} />;
};

export default AnimationLottie;
