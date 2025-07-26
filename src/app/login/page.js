"use client";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/common/LoginModal";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    router.push("/");
  };

  return (
    <>
      {show && (
        <LoginModal
          onClose={handleClose}
          onSwitchToSignup={() => {
            setShow(false);
            router.push("/signup");
          }}
        />
      )}
    </>
  );
}
