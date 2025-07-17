export default function InputField({ type = "text", placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full h-10 rounded-full bg-white px-4 outline-none
      text-[#040816]"
    />
  );
}
