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

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const alertRef = useRef(null);
  const mypageRef = useRef(null);
  const searchRef = useRef(null);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [favoriteSymbols, setFavoriteSymbols] = useState([]);
  const [hover, setHover] = useState(null);

  const handleRequireLogin = () => {
    if (window.confirm("로그인이 필요합니다. 로그인하시겠습니까?")) {
      setShowLoginModal(true);
    }
  };

  // isLoggedIn이 변경될 때만 로그 출력
  useEffect(() => {
    console.log("[Navbar] isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFavoriteSymbols(data.data.map((item) => item.symbol));
        }
      })
      .catch(console.error);
  }, []);

  const toggleFavorite = async (item) => {
    // 로그인 체크
    if (!isLoggedIn) {
      handleRequireLogin();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;
    const isFavorite = favoriteSymbols.includes(item.symbol);

    try {
      const method = isFavorite ? "DELETE" : "POST";
      console.log("⭐️ toggleFavorite item:", item);

      const bodyData = isFavorite
        ? { stock_id: item.id } // DELETE: 객체 그대로
        : [{ stock_id: item.id }]; // POST: 배열로 감싸야 함

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${userId}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) throw new Error("API 응답 실패");

      // 상태 업데이트
      setFavoriteSymbols((prev) =>
        isFavorite
          ? prev.filter((s) => s !== item.symbol)
          : [...prev, item.symbol]
      );

      alert(
        isFavorite
          ? "관심 목록에서 제거되었습니다"
          : "관심 목록에 추가되었습니다"
      );
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
      alert("관심 종목 변경 실패");
    }
  };

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

  // 모달 간 전환 함수들
  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const spanRef = useRef(null); // 보여지는 실제 span
  const measureRef = useRef(null); // 크기 측정용 span
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (measureRef.current && spanRef.current) {
        const fullWidth = measureRef.current.scrollWidth;
        const containerWidth = spanRef.current.clientWidth;
        setIsOverflow(fullWidth > containerWidth);
      }
    };

    // 약간 delay 주거나 RAF 사용
    const raf = requestAnimationFrame(checkOverflow);
    return () => cancelAnimationFrame(raf);
  }, []);

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
                style={{ minWidth: "12.5rem", maxWidth: "200px" }}
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
                    filteredCompanies.slice(0, 25).map((company) => {
                      const isFavorite = favoriteSymbols.includes(
                        company.symbol
                      );
                      return (
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
                          {/* 별표 있어서 관심종목 추가할 수 있게 */}
                          {/* 로그인 되야 버튼 보이도록 */}
                          {isLoggedIn && (
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                // 관심종목 추가 로직
                                console.log(
                                  `Add ${company.symbol} to favorites (not implemented)`
                                );
                              }}
                            >
                              <div
                                className="w-4 h-4 cursor-pointer bg-contain bg-no-repeat bg-center"
                                style={{
                                  backgroundImage: `url(${
                                    hover === company.symbol
                                      ? isFavorite
                                        ? "/star-off.png"
                                        : "/star-on.png"
                                      : isFavorite
                                      ? "/star-on.png"
                                      : "/star-off.png"
                                  })`,
                                }}
                                onMouseEnter={() => setHover(company.symbol)}
                                onMouseLeave={() => setHover(null)}
                                onClick={() => {
                                  if (!isLoggedIn) {
                                    handleRequireLogin();
                                    return;
                                  }
                                  const message = isFavorite
                                    ? "정말 관심종목에서 삭제하시겠습니까?"
                                    : "관심종목에 추가하시겠습니까?";
                                  if (window.confirm(message))
                                    toggleFavorite(company);
                                }}
                                title={
                                  isFavorite ? "관심종목 삭제" : "관심종목 추가"
                                }
                              />{" "}
                            </button>
                          )}{" "}
                        </div>
                      );
                    })
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
              <Image src="/icon_alert.svg" alt="Alert" width={22} height={22} />
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
