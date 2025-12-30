import { personalData } from "@/utils/data/personal-data";
import { BiLogoLinkedin } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { FaCalendar, FaStackOverflow } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub, IoMdCall } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";
import ContactForm from "./contact-form";
import { useState } from "react";
import Modal from "@/components/Modal";

function ContactSection() {
  const [calendarModal, setCalendarModal] = useState(false);

  return (
    <div id="contact" className="my-12 lg:my-16 relative mt-24 text-white">
      <div className="hidden lg:flex flex-col items-center absolute top-24 -right-8">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          CONTACT
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <ContactForm />
        <div className="lg:w-3/4 ">
          <div className="flex flex-col gap-5 lg:gap-9">
            <p className="text-sm md:text-xl flex items-center gap-3">
              <MdAlternateEmail
                className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                size={36}
              />
              <span>{personalData.email}</span>
            </p>
            {personalData.phone && (
              <p className="text-sm md:text-xl flex items-center gap-3">
                <IoMdCall
                  className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={36}
                />
                <span>{personalData.phone}</span>
              </p>
            )}
            {personalData.address && (
              <p className="text-sm md:text-xl flex items-center gap-3">
                <CiLocationOn
                  className="bg-[#8b98a5] p-2 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={36}
                />
                <span>{personalData.address}</span>
              </p>
            )}
          </div>
          <div className="mt-8 lg:mt-16 flex items-center gap-5 lg:gap-10">
            {personalData.social.github && (
              <a target="_blank" href={personalData.social.github}>
                <IoLogoGithub
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </a>
            )}
            {personalData.social.linkedIn && (
              <a target="_blank" href={personalData.social.linkedIn}>
                <BiLogoLinkedin
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </a>
            )}
            {personalData.social.twitter && (
              <a target="_blank" href={personalData.social.twitter}>
                <FaXTwitter
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </a>
            )}
            {personalData.social.stackOverflow && (
              <a target="_blank" href={personalData.social.stackOverflow}>
                <FaStackOverflow
                  className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                  size={48}
                />
              </a>
            )}
            {personalData.social.calendar && (
              <>
                <a target="_blank" onClick={() => setCalendarModal(true)}>
                  <FaCalendar
                    className="bg-[#8b98a5] p-3 rounded-full hover:bg-[#16f2b3] hover:scale-110 transition-all duration-300 text-gray-800 cursor-pointer"
                    size={48}
                  />
                </a>
                <Modal
                  isOpen={calendarModal}
                  onRequestClose={(status) => setCalendarModal(status)}
                >
                  <iframe
                    src={personalData.social.calendar}
                    className="w-full h-full bg-white"
                  ></iframe>
                </Modal>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactSection;
