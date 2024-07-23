import { LottieComponentProps, useLottie } from "lottie-react";

type AnimationLottieProps = {
  animationPath: LottieComponentProps["animationData"];
};

const style = {
  width: "95%",
};

const AnimationLottie = ({ animationPath }: AnimationLottieProps) => {
  const options = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
  };

  const { View } = useLottie(options, style);

  return View;
};

export default AnimationLottie;
