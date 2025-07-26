"use client";
import Link from "next/link";
import Image from "next/image";
import NotificationPopup from "./common/NotificationPopup";
import MyPageModal from "./common/MyPageModal";
import LoginModal from "./common/LoginModal";
import SignupModal from "./common/SignupModal";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/utils/useAuth";
import { requestFcmToken, handleForegroundMessage } from "@/services/fcm-service";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const alertRef = useRef(null);
  const mypageRef = useRef(null);
  const searchRef = useRef(null);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // isLoggedIn이 변경될 때만 로그 출력
  useEffect(() => {
    console.log("[Navbar] isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  // 로그인 상태에 따라 알림 개수 가져오기 및 FCM 설정
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotificationCount();
      
      // FCM 토큰 요청 및 포그라운드 메시지 핸들러 설정
      requestFcmToken();
      handleForegroundMessage((payload) => {
        console.log("📩 Navbar에서 FCM 메시지 수신:", payload);
        // 새 알림이 오면 알림 개수 업데이트
        fetchNotificationCount();
      });
      
      // 페이지가 포커스될 때만 업데이트
      const handleFocus = () => {
        fetchNotificationCount();
      };
      
      // 페이지 가시성이 변경될 때 업데이트
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchNotificationCount();
        }
      };
      
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      setNotificationCount(0);
    }
  }, [isLoggedIn]);

  // companylogo.json 데이터 로드
  useEffect(() => {
    fetch("/companylogo.json")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setFilteredCompanies(data);
      })
      .catch((err) => console.error("Failed to load companies:", err));
  }, []);

  // 검색어 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.name_kr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertRef.current && !alertRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (mypageRef.current && !mypageRef.current.contains(e.target)) {
        setShowMyPageModal(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCompanyClick = (symbol) => {
    router.push(`/earning/${symbol}`);
    setShowSearchDropdown(false);
    setSearchTerm("");
  };

  // 로그인 필요 시 모달 표시
  const handleLoginRequired = () => {
    setShowLoginModal(true);
  };

  // 알림 개수 가져오기
  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.sub || payload.id;

      const resCompany = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/companies`
      );
      const jsonCompany = await resCompany.json();
      const companyMap = {};
      jsonCompany.data.forEach((c) => {
        companyMap[c.id.toString()] = {
          name_kr: c.name_kr,
          logo: c.logo,
        };
      });

      const resAlert = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications?filter=all&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonAlert = await resAlert.json();

      if (jsonAlert.success) {
        const mapped = jsonAlert.data.map((item) => {
          const status = item.status || "";
          const alertContent = item.alert_content || "";

          const stockId = item.stock_id?.toString();
          const company = companyMap[stockId];

          const title = status.includes("fomc")
            ? "FOMC"
            : company?.name_kr || "FOMC";

          const iconSrc = status.includes("fomc")
            ? "/fomc.png"
            : company?.logo || "/fomc.png";

          return {
            id: item.id,
            icon: iconSrc,
            title,
            time: item.created_at
              ? formatKoreanTime(item.created_at)
              : "시간 없음",
            description: alertContent,
          };
        });

        const read = getReadNotifications();
        const unreadOnly = mapped.filter((n) => !read.includes(n.id));
        setNotificationCount(unreadOnly.length);
      }
    } catch (err) {
      console.error("❌ 알림 개수 로딩 실패:", err);
    }
  };

  // 읽은 알림 가져오기
  const getReadNotifications = () => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("readNotifications") || "[]");
    } catch {
      return [];
    }
  };

  // 시간 포맷팅 함수
  const formatKoreanTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "오후" : "오전";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    const dayPrefix = isToday ? "오늘" : `${month}월 ${day}일`;
    return `${dayPrefix} ${ampm} ${hour12}:${minute}`;
  };

  // 모달 간 전환 함수들
  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <nav
        className="text-white text-base flex items-center justify-between px-6 md:px-12 lg:px-24 py-7 gap-4"
        style={{ backgroundColor: "#040816" }}
      >
        <Link href="/" className="font-bold text-3xl">
          FOMO
        </Link>
        <div className="flex items-center gap-6 md:gap-9 whitespace-nowrap min-w-0">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative flex items-center" ref={searchRef}>
              <img
                src="/icon_search.svg"
                alt="Search_icon"
                width={16}
                height={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer"
              />
              <input
                className="bg-white text-[#040816] rounded-2xl focus:outline-none text-center text-sm pl-8 pr-4 py-1 w-32 md:w-40"
                style={{ minWidth: "100px", maxWidth: "200px" }}
                placeholder="종목 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onMouseEnter={() => setShowSearchDropdown(true)}
                onMouseLeave={() => {
                  if (!searchTerm.trim()) {
                    setShowSearchDropdown(false);
                  }
                }}
              />

              {/* 검색 드롭다운 */}
              {showSearchDropdown && (
                <div
                  className="absolute top-full left-0 right-0 mt-0 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                  onMouseEnter={() => setShowSearchDropdown(true)}
                  onMouseLeave={() => {
                    if (!searchTerm.trim()) {
                      setShowSearchDropdown(false);
                    }
                  }}
                >
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.slice(0, 25).map((company) => (
                      <div
                        key={company.id}
                        onClick={() => handleCompanyClick(company.symbol)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-6 h-6 rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {company.name_kr}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {company.symbol}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link
              href="/fomc"
              className="text-base font-medium"
              style={{ fontSize: "20px" }}
            >
              FOMC
            </Link>
            <div className="flex items-center gap-6 md:gap-9">
              <Link
                href="/earning"
                className="text-base font-medium"
                style={{ fontSize: "18px" }}
              >
                실적발표
              </Link>
              <Link href="/calendar">
                <Image
                  src="/icon_calendar.svg"
                  alt="Calendar_page"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>

          <div
            className="relative flex items-center justify-center"
            ref={alertRef}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log(
                  "[Navbar] Alert button clicked, isLoggedIn:",
                  isLoggedIn
                );

                if (!isLoggedIn) {
                  if (
                    window.confirm("로그인이 필요합니다. 로그인하시겠습니까?")
                  ) {
                    handleLoginRequired();
                  }
                  return;
                }
                setShowNotifications((prev) => {
                  console.log("알림창 상태:", !prev);
                  return !prev;
                });
              }}
              className="flex items-center cursor-pointer justify-center"
            >
              <Image 
                src={notificationCount > 0 ? "/icon_alert2.svg" : "/icon_alert.svg"} 
                alt="Alert" 
                width={25.5} 
                height={25.5} 
              />
            </button>

            {showNotifications && (
              <div className="absolute top-[calc(100%+10px)] right-0 z-50">
                <NotificationPopup
                  onClose={() => setShowNotifications(false)}
                />
              </div>
            )}
          </div>

          {/* 마이페이지 */}
          <div className="relative" ref={mypageRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isLoggedIn) {
                  setShowMyPageModal((prev) => !prev);
                } else {
                  handleLoginRequired();
                }
              }}
              className="flex items-center justify-center cursor-pointer"
            >
              <Image
                src="/icon_mypage.svg"
                alt="My_page"
                width={32}
                height={32}
              />
            </button>

            {isLoggedIn && showMyPageModal && (
              <MyPageModal onClose={() => setShowMyPageModal(false)} />
            )}
          </div>
        </div>
      </nav>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSwitchToSignup={handleSwitchToSignup}
        />
      )}

      {/* 회원가입 모달 */}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </>
  );
}
