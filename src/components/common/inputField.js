export default function InputField({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full h-10 rounded-full bg-white px-4 outline-none
      text-[#040816]"
    />
  );
}