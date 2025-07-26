// calendar 화면에 필요한 함수

// 주간 날짜 계산 함수
export const getWeekDates = (date = new Date()) => {
  const current = new Date(date);
  const week = [];

  // 월요일부터 시작하도록 조정
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // 월요일이 1, 일요일이 0

  for (let i = 0; i < 5; i++) {
    // 월~금만
    const weekDay = new Date(current.setDate(diff + i));
    week.push(new Date(weekDay));
  }

  return week;
};

// 날짜 포맷팅 함수
export const formatDate = (date) => {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 간단한 날짜 포맷팅 함수 (M/D)
export const formatSimpleDate = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 오늘 날짜인지 확인하는 함수
export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// API용 날짜 포맷팅 (YYYYMMDD)
export const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

export const formatWeekRange = (weekDates) => {
  if (weekDates.length === 0) return "";
  const start = weekDates[0];
  const end = weekDates[weekDates.length - 1];
  return `${start.getMonth() + 1}/${start.getDate()} - ${
    end.getMonth() + 1
  }/${end.getDate()}`;
};

// 요일 한글 변환
export const getDayOfWeek = (date) => {
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  return days[date.getDay()];
};

// 백엔드 API에서 캘린더 데이터 가져오기
export const fetchCalendarData = async (weekDates) => {
  try {
    const startDate = formatDateForAPI(weekDates[0]);
    const endDate = formatDateForAPI(weekDates[weekDates.length - 1]);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/calendar/week?start=${startDate}&end=${endDate}`
    );
    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error("Failed to fetch calendar data");
    }
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return null;
  }
};

// API 데이터를 컴포넌트 형식으로 변환
export const transformCalendarData = (apiData, weekDates) => {
  if (!apiData) return [];

  return weekDates.map((date, index) => {
    // 한국 시간 기준 날짜
    const koreanDate = date;

    // 미국 시간 기준으로 하루 전 날짜로 API 키 생성
    const usDate = new Date(date);
    usDate.setDate(date.getDate() - 1);
    const dateKey = formatDateForAPI(usDate);

    // earnings 데이터에서 해당 날짜의 데이터 가져오기
    const dayEarnings = apiData.earnings[dateKey] || { before: [], after: [] };

    // before 데이터를 amc/bmo에 따라 분류
    const preMarket = dayEarnings.before.filter(
      (item) => item.fin_hour === "bmo"
    );
    const afterMarket = dayEarnings.before.filter(
      (item) => item.fin_hour === "amc"
    );

    // FOMC 이벤트 가져오기
    const fomcEvent = apiData.fomc[dateKey];
    const notices = fomcEvent
      ? [
          {
            id: `fomc-${dateKey}`,
            title: fomcEvent.event,
            time: `${fomcEvent.time} 예정`,
            type: "blue",
          },
        ]
      : null;

    return {
      dayOfWeek: getDayOfWeek(koreanDate),
      preMarketDate: formatSimpleDate(koreanDate),
      afterMarketDate: formatSimpleDate(koreanDate), // 한국 시간 기준
      isToday: isToday(koreanDate),
      preMarket: preMarket.map((item, i) => ({
        id: `${dateKey}-pre-${i}`,
        event: item.event,
        time: item.time,
        logo: item.logo,
        symbol: item.symbol,
      })),
      afterMarket: afterMarket.map((item, i) => ({
        id: `${dateKey}-after-${i}`,
        event: item.event,
        time: item.time,
        logo: item.logo,
        symbol: item.symbol,
      })),
      notices,
    };
  });
};

// 주간 이동 함수
export const getPreviousWeek = (currentWeek) => {
  const firstDay = new Date(currentWeek[0]);
  firstDay.setDate(firstDay.getDate() - 7);
  return getWeekDates(firstDay);
};

export const getNextWeek = (currentWeek) => {
  const firstDay = new Date(currentWeek[0]);
  firstDay.setDate(firstDay.getDate() + 7);
  return getWeekDates(firstDay);
};
