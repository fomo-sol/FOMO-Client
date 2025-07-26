export default function InputField({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  onKeyDown,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      onKeyDown={onKeyDown}
      className="w-full h-10 rounded-[15px] text-sm font-thin bg-white px-4 outline-none
      text-[#040816]"
    />
  );
}
