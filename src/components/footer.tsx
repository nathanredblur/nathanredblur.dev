import { CgGitFork } from "react-icons/cg";
import { IoStar } from "react-icons/io5";
import { personalData } from "@/utils/data/personal-data";

const Footer = () => {
  return (
    <div className="relative border-t bg-[#0d1224] border-[#353951] text-white">
      <div className="mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] py-6 lg:py-10">
        <div className="flex justify-center -z-40">
          <div className="absolute top-0 h-[1px] w-1/2  bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">
            © Developer Portfolio by{" "}
            <a
              target="_blank"
              href={personalData.domain}
              className="text-cyan-400"
            >
              {personalData.name}
            </a>
          </p>
          <div className="flex items-center gap-5">
            <a
              target="_blank"
              href={personalData.repo}
              className="flex items-center gap-2 uppercase hover:text-cyan-400"
            >
              <IoStar />
              <span>Star</span>
            </a>
            <a
              target="_blank"
              href={`${personalData.repo}/fork`}
              className="flex items-center gap-2 uppercase hover:text-cyan-400"
            >
              <CgGitFork />
              <span>Fork</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
