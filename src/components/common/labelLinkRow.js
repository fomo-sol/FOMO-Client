export default function LabelLinkRow() {
  return (
    <div className="flex justify-between w-full max-w-[340px] text-xs font-lato text-[#353535]">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-[2px] bg-white border border-gray-400"
        />
        <span>Remember me</span>
      </label>
      <a
        href="#"
        className="text-[#063FA1] underline underline-offset-2 hover:text-blue-700"
      >
        Forgot Password
      </a>
    </div>
  );
}
