type Props = {
  title?: string;
  onClickClose?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
  className?: string;
};

const WindowBox = ({ title, onClickClose, children, className }: Props) => {
  return (
    <div
      className={`flex flex-col w-full relative border rounded-lg border-[#1b2c68a0] bg-gradient-to-r from-[#0d1224] to-[#0a0d37] ${className}`}
    >
      <div className="flex flex-row">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
        <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
      </div>
      <div className="px-4 lg:px-8 py-3 lg:py-5 relative">
        <div
          className="flex flex-row space-x-1 lg:space-x-2 absolute top-1/2 -translate-y-1/2"
          onClick={onClickClose}
        >
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-red-400"></div>
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-orange-400"></div>
          <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-200"></div>
        </div>
        <p className="text-center ml-3 text-[#16f2b3] text-base lg:text-xl">
          {title}
        </p>
      </div>
      <div className="overflow-hidden border-t-[2px] border-indigo-900 px-4 lg:px-8 py-4 lg:py-8 flex-1">
        {children}
      </div>
    </div>
  );
};

export default WindowBox;
