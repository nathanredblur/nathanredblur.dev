import { personalData } from "@/utils/data/personal-data";

const AboutSection = () => (
  <div id="about" className="my-12 lg:my-16 relative">
    <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
      <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
        ABOUT ME
      </span>
      <span className="h-36 w-[2px] bg-[#1a1443]"></span>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <div className="order-2 lg:order-1">
        <p className="font-medium mb-5 text-cyan-400 text-xl uppercase">
          Who am I?
        </p>
        <div className="text-gray-200 text-sm lg:text-lg">
          {personalData.description.split("\n").map((desc, index) => (
            <p className="mb-5" key={index}>
              {desc}
              <br />
            </p>
          ))}
        </div>
      </div>
      <div className="flex justify-center order-1 lg:order-2 items-start">
        <img
          src={personalData.profile}
          width={280}
          height={280}
          alt={personalData.name}
          className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
        />
      </div>
    </div>
  </div>
);

export default AboutSection;
