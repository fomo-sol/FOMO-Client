"use client";
import Link from "next/link";
import Image from "next/image";
import NotificationPopup from "./common/NotificationPopup";
import MyPageModal from "./common/MyPageModal";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../utils/useAuth";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const alertRef = useRef(null);
  const mypageRef = useRef(null);
  const searchRef = useRef(null);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  console.log("[Navbar] isLoggedIn:", isLoggedIn);

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

  return (
    <nav
      className="text-white text-lg items-center justify-between px-16 py-6 flex gap-4 border-b"
      style={{ backgroundColor: "#040816", borderBlockColor: "#282C34" }}
    >
      <Link href="/" className="font-bold text-2xl">
        FOMO
      </Link>
      <div className="flex items-center gap-10">
        <div className="relative" ref={searchRef}>
          <input
            className="bg-white text-[#040816] rounded-2xl focus:outline-none text-center"
            style={{ width: "170px", height: "30px" }}
            placeholder="종목 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
          />
          <img
            src="/icon_search.svg"
            alt="Search_icon"
            width={24}
            height={24}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          />

          {/* 검색 드롭다운 */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
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
        <Link href="/fomc">FOMC</Link>
        <Link href="/earning">실적발표</Link>
        <Link href="/calendar">
          <Image
            src="/icon_calendar.svg"
            alt="Calendar_page"
            width={24}
            height={24}
          />
        </Link>

        <div
          className="relative flex items-center justify-center"
          ref={alertRef}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoggedIn) {
                if (
                  window.confirm("로그인이 필요합니다. 로그인하시겠습니까?")
                ) {
                  router.push("/login");
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
            <Image src="/icon_alert.svg" alt="Alert" width={24} height={24} />
          </button>

          {showNotifications && (
            <div className="absolute top-[calc(100%+10px)] right-0 z-50">
              <NotificationPopup onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>

        {/* 알람이 있다면 이 아이콘으로 교체 */}
        {/* <Link href="/alert">
          <Image
            src="/icon_notification.svg"
            alt="Alert_page"
            width={24}
            height={24}
          />
        </Link> */}
        {/* 마이페이지 */}
        <div className="relative" ref={mypageRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isLoggedIn) {
                setShowMyPageModal((prev) => !prev);
              } else {
                router.push("/login");
              }
            }}
            className="flex items-center justify-center"
          >
            <Image
              src="/icon_mypage.svg"
              alt="My_page"
              width={24}
              height={24}
            />
          </button>

          {isLoggedIn && showMyPageModal && (
            <MyPageModal onClose={() => setShowMyPageModal(false)} />
          )}
        </div>
      </div>
    </nav>
  );
}
