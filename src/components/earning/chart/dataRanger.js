"use client";

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }) {
    // YYYYMMDD ↔︎ YYYY-MM-DD 변환 함수 (필요시 내부 또는 외부에서 구현)
    const toInputDate = (yyyymmdd) =>
        `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
    const toApiDate = (inputDate) => inputDate.replace(/-/g, "");

    return (
        <div className="mb-6 flex gap-4 items-center">
            <label>
                시작일:{" "}
                <input
                    type="date"
                    value={toInputDate(startDate)}
                    max={toInputDate(endDate)}
                    onChange={(e) => onStartChange(toApiDate(e.target.value))}
                    className="border px-2 py-1 rounded"
                />
            </label>

            <label>
                종료일:{" "}
                <input
                    type="date"
                    value={toInputDate(endDate)}
                    min={toInputDate(startDate)}
                    onChange={(e) => onEndChange(toApiDate(e.target.value))}
                    className="border px-2 py-1 rounded"
                />
            </label>
        </div>
    );
}
