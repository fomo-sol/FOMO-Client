"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/common/inputField";
import { registerUser } from "@/services/user-service";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    passwd: "",
  });

  const handleChange = (e) => {
    const { placeholder, value } = e.target;
    const key =
        placeholder === "User name"
            ? "username"
            : placeholder === "Email"
                ? "email"
                : "passwd";

    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = async () => {
    try {
      const res = await registerUser(formData);
      console.log("회원가입 성공:", res);
      router.push("/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
    }
  };

  return (
      <div className="grid place-items-center pt-32 px-4">
        <div className="w-[470px] h-[361px] bg-[#EAEAEA] rounded-[5px] shadow-md flex flex-col items-center justify-center space-y-5">
          <h2 className="text-[#353535] text-[25px] font-medium font-[Pretendard] text-center">
            회원가입
          </h2>

          <div className="w-full max-w-[340px] space-y-3">
            <InputField
                type="text"
                placeholder="User name"
                value={formData.username}
                onChange={handleChange}
            />
            <InputField
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
            <InputField
                type="password"
                placeholder="Password"
                value={formData.passwd}
                onChange={handleChange}
            />
          </div>

          <button
              onClick={handleSignup}
              className="w-[338px] h-[52px] rounded-full bg-[#171717] text-white font-semibold"
          >
            회원가입
          </button>
        </div>
      </div>
  );
}
