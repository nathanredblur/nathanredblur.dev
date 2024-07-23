import { useState } from "react";
import { experiences } from "@/utils/data/experience";
import AnimationLottie from "@components/AnimationLottie";
import GlowCard from "@components/GlowCard";
import lottieAnimation from "@/assets/lottie/code.json";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaReact, FaUserTie } from "react-icons/fa";

function Experience() {
  const [collapsStatus, setCollapsStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const handleCollapse = (identifier: string) => {
    setCollapsStatus((prev) => ({
      ...prev,
      [identifier]: !prev[identifier],
    }));
  };

  return (
    <div
      id="experience"
      className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]"
    >
      <img
        src="/section.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-3xl rounded-md">
            Experiences
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex justify-center items-start">
            <div className="w-full h-full">
              <AnimationLottie animationPath={lottieAnimation} />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              {experiences.map((experience) => {
                const id = `experience-${experience.company.split(" ")[0]}`;
                const isOpen = collapsStatus[id];
                let IconType;
                if (experience.type === "React") {
                  IconType = FaReact;
                } else if (experience.type === "Manager") {
                  IconType = FaUserTie;
                } else {
                  IconType = BsPersonWorkspace;
                }

                return (
                  <GlowCard
                    key={experience.company}
                    identifier={id}
                    onClick={() => handleCollapse(id)}
                  >
                    <div className="p-3 relative overflow-hidden">
                      <img
                        src="/blur-23.svg"
                        alt="Hero"
                        width={1080}
                        height={200}
                        className="absolute bottom-0 opacity-80"
                      />
                      <div className="flex justify-end">
                        <p className="text-xs sm:text-sm text-cyan-400">
                          {experience.duration}
                        </p>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-x-8">
                          <div className="text-violet-500  transition-all duration-300 hover:scale-125">
                            <IconType size={36} />
                          </div>
                          <div>
                            <p className="text-base sm:text-xl mb-2 font-medium text-pink-500">
                              {experience.title}
                            </p>
                            <p className="text-sm sm:text-base font-bold">
                              {experience.company}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-x-8 collaps ${
                            isOpen ? "open" : ""
                          }`}
                        >
                          <div className={`text-sm sm:text-base pt-5`}>
                            {experience.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;
