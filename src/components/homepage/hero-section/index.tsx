import WindowBox from "@/components/WindowBox";
import { personalData } from "@/utils/data/personal-data";
import { skillsData, softSkillsData } from "@/utils/data/skills";
import { keys } from "@/utils/type-safe";
import { BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { MdDownload } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <img
        src="/hero.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute -top-[98px] -z-10"
      />

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <div className="flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl leading-10 text-white lg:text-[2.6rem] lg:leading-[3.5rem]">
            This is
            <span className="font-semibold text-pink-500">
              {" "}
              {personalData.name}
            </span>
            ,
            <br />
            <span className="text-cyan-400">{personalData.designation}</span>.
          </h1>

          <div className="my-12 flex items-center gap-5">
            {keys(personalData.social).map((key) => {
              if (personalData.social[key] === "") return null;
              return (
                <a
                  key={key}
                  href={personalData.social[key]}
                  target="_blank"
                  className="transition-all text-pink-500 hover:scale-125 duration-300"
                >
                  {key === "github" && <BsGithub size={30} />}
                  {key === "linkedIn" && <BsLinkedin size={30} />}
                  {key === "facebook" && <FaFacebook size={30} />}
                  {key === "leetcode" && <SiLeetcode size={30} />}
                  {key === "twitter" && <BsTwitterX size={30} />}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={personalData.social.linkedIn}
              target="_blank"
              className="bg-gradient-to-r to-pink-500 from-violet-600 p-[1px] rounded-full transition-all duration-300 hover:from-pink-500 hover:to-violet-600"
            >
              <button className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0d1224] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#ffff] no-underline transition-all duration-200 ease-out  md:font-semibold flex items-center gap-1 hover:gap-3">
                <span>Contact me</span>
                <RiContactsFill size={16} />
              </button>
            </a>

            {personalData.resume && (
              <a
                className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
                role="button"
                target="_blank"
                href={personalData.resume}
              >
                <span>Get Resume</span>
                <MdDownload size={16} />
              </a>
            )}
          </div>
        </div>
        <WindowBox>
          <code className="font-mono text-xs md:text-sm lg:text-base">
            <div className="blink">
              <span className="mr-2 text-pink-500">const</span>
              <span className="mr-2 text-white">coder</span>
              <span className="mr-2 text-pink-500">=</span>
              <span className="text-gray-400">{"{"}</span>
            </div>
            <div>
              <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
              <span className="text-gray-400">{`'`}</span>
              <span className="text-amber-300">{personalData.name}</span>
              <span className="text-gray-400">{`',`}</span>
            </div>
            <div className="ml-4 lg:ml-8 mr-2">
              <span className=" text-white">skills:</span>
              <div className="ml-4 lg:ml-8 mr-2">
                <span className="text-gray-400">{`['`}</span>
                {skillsData.map((skill, index) => (
                  <span key={index}>
                    <span className="text-amber-300">{skill}</span>
                    {index < skillsData.length - 1 && (
                      <span className="text-gray-400">{"', '"}</span>
                    )}
                  </span>
                ))}
                <span className="text-gray-400">{"'],"}</span>
              </div>
            </div>
            <div className="ml-4 lg:ml-8 mr-2">
              <span className=" text-white">softSkills:</span>
              <div className="ml-4 lg:ml-8 mr-2">
                <span className="text-gray-400">{`['`}</span>
                {softSkillsData.map((skill, index) => (
                  <span key={index}>
                    <span className="text-amber-300">{skill}</span>
                    {index < softSkillsData.length - 1 && (
                      <span className="text-gray-400">{"', '"}</span>
                    )}
                  </span>
                ))}
                <span className="text-gray-400">{"'],"}</span>
              </div>
            </div>
            <div>
              <span className="ml-4 lg:ml-8 mr-2 text-white">hardWorker:</span>
              <span className="text-orange-400">true</span>
              <span className="text-gray-400">,</span>
            </div>
            <div>
              <span className="ml-4 lg:ml-8 mr-2 text-white">
                quickLearner:
              </span>
              <span className="text-orange-400">true</span>
              <span className="text-gray-400">,</span>
            </div>
            <div>
              <span className="ml-4 lg:ml-8 mr-2 text-white">
                problemSolver:
              </span>
              <span className="text-orange-400">true</span>
              <span className="text-gray-400">,</span>
            </div>
          </code>
        </WindowBox>
      </div>
    </section>
  );
}

export default HeroSection;
