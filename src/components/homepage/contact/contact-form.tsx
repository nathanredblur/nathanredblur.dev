import { useState, ChangeEvent } from "react";
import { FaArrowUp } from "react-icons/fa6";

type Message = {
  text: string;
  from: "user" | "bot";
};

const countLines = (text: string) => {
  const lines = text.split("\n");
  return lines.length;
};

const maxRows = 4;

function ContactForm() {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! How can I help you?",
      from: "bot",
    },
  ]);

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const lines = countLines(e.target.value);
    setRows(lines < maxRows ? lines : maxRows);
  };

  const sendMessage = async () => {
    if (!input) return;

    const newMessage: Message = {
      text: input,
      from: "user",
    };
    setMessages([...messages, newMessage]);

    // try {
    //   const res = await fetch()

    //   if (res.status === 200) {
    //     toast.success("Message sent successfully!");
    //     setInput({
    //       name: "",
    //       email: "",
    //       message: "",
    //     });
    //   }
    // } catch (error) {
    //   toast.error(error?.text || error);
    // }
  };

  return (
    <div className="">
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
        Contact with me
      </p>
      <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
        <p className="text-sm text-[#d3d8e8]">
          {
            "I'm a AI chatbot, I can solve any question about me, my projects, my skills, my experience, etc. Feel free to ask me anything!"
          }
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[#16f2b3] font-semibold">Messages</p>
            <div className="flex flex-col gap-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1 ${
                    msg.from === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <p
                    className={`p-2 rounded-lg text-sm ${
                      msg.from === "user"
                        ? "bg-[#1a1443]"
                        : "bg-[#0a0d37] border border-[#16f2b3]"
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 bg-[#10172d] border border-[#353a52]">
            <div className="flex items-end gap-1.5 md:gap-3.5">
              <div className="flex min-w-0 flex-1 flex-col pl-3.5">
                <textarea
                  className="m-0 px-0 py-1 resize-none border-0 bg-transparent outline-none focus:ring-0 focus-visible:ring-0"
                  placeholder="Message to virtual me"
                  tabIndex={0}
                  dir="auto"
                  rows={1}
                  style={{
                    height: rows * 24 + 10,
                    overflowY: rows < maxRows ? "hidden" : "auto",
                  }}
                  spellCheck="false"
                  onChange={onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                ></textarea>
              </div>
              <button
                disabled={input.length === 0}
                className="mb-1 me-1 h-8 w-8 flex items-center justify-center rounded-full bg-violet-600 text-white transition-colors hover:opacity-70 disabled:bg-none  disabled:bg-[#D7D7D7] disabled:text-[#f4f4f4] disabled:hover:opacity-100 "
                onClick={sendMessage}
              >
                <FaArrowUp color="#fff" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
