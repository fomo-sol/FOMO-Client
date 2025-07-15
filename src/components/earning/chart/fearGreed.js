"use client";

import React, { useEffect, useState } from "react";

// 감정 구간
const SECTIONS = [
    { label: "EXTREME FEAR", start: 0, end: 20 },
    { label: "FEAR", start: 20, end: 40 },
    { label: "NEUTRAL", start: 40, end: 60 },
    { label: "GREED", start: 60, end: 80 },
    { label: "EXTREME GREED", start: 80, end: 100 },
];

const DEG_PER_SCORE = 180 / 100;
const CENTER_X = 100;
const CENTER_Y = 100;
const RADIUS = 80;

// 각도 → 좌표
function polarToCartesian(cx, cy, r, angle) {
    const radians = (angle + 180) * (Math.PI / 180);
    return {
        x: cx + r * Math.cos(radians),
        y: cy + r * Math.sin(radians),
    };
}

// 아크 생성
function createArcPath(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
        `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
        `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
    ].join(" ");
}

export default function FearGreedGauge() {
    const [score, setScore] = useState(50);
    const [rating, setRating] = useState("neutral");

    useEffect(() => {
        fetch("https://production.dataviz.cnn.io/index/fearandgreed/graphdata")
            .then((res) => res.json())
            .then((data) => {
                setScore(data.fear_and_greed.score);
                setRating(data.fear_and_greed.rating);
            })
            .catch((err) => {
                console.error("Error fetching FNG:", err);
                setScore(50);
                setRating("neutral");
            });
    }, []);

    const scoreAngle = score * DEG_PER_SCORE;
    const roundedScore = Math.round(score);
    const scoreText = roundedScore.toString().slice(0, 3); // 최대 3자리로 제한

    return (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: "1rem" }}>
            <svg viewBox="0 0 200 200" width="100%" height="auto">
                {/* 구간 아크 */}
                {SECTIONS.map((section) => {
                    const start = section.start * DEG_PER_SCORE;
                    const end = section.end * DEG_PER_SCORE;
                    const path = createArcPath(CENTER_X, CENTER_Y, RADIUS, start, end);
                    const isActive = section.label === rating.toUpperCase();
                    return (
                        <path
                            key={section.label}
                            d={path}
                            stroke={isActive ? "#91E1C6" : "#eee"}
                            strokeWidth="18"
                            fill="none"
                        />
                    );
                })}

                {/* 눈금선 */}
                {Array.from({ length: 21 }).map((_, i) => {
                    const angle = i * 9;
                    const outer = polarToCartesian(CENTER_X, CENTER_Y, RADIUS + 5, angle);
                    const inner = polarToCartesian(CENTER_X, CENTER_Y, RADIUS, angle);
                    return (
                        <line
                            key={i}
                            x1={inner.x.toFixed(2)}
                            y1={inner.y.toFixed(2)}
                            x2={outer.x.toFixed(2)}
                            y2={outer.y.toFixed(2)}
                            stroke="#aaa"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* 바늘 */}
                <line
                    x1={CENTER_X}
                    y1={CENTER_Y}
                    x2={polarToCartesian(CENTER_X, CENTER_Y, RADIUS - 15, scoreAngle).x.toFixed(2)}
                    y2={polarToCartesian(CENTER_X, CENTER_Y, RADIUS - 15, scoreAngle).y.toFixed(2)}
                    stroke="#222"
                    strokeWidth="3"
                    color="#91E1C6"
                />

                {/* 중심 원 */}
                <circle cx={CENTER_X} cy={CENTER_Y} r="4" fill="#222" />

                {/* 점수 텍스트 (중앙, 반원 내부) */}
                <text
                    x={CENTER_X}
                    y={CENTER_Y + 10}
                    textAnchor="middle"
                    fontSize="36"
                    fontWeight="bold"
                    fill="#111"
                >
                    {scoreText}
                </text>

                {/* 레이블 */}
                {SECTIONS.map((section) => {
                    const midAngle = ((section.start + section.end) / 2) * DEG_PER_SCORE;
                    const pos = polarToCartesian(CENTER_X, CENTER_Y, RADIUS - 22, midAngle);
                    return (
                        <text
                            key={section.label}
                            x={pos.x.toFixed(2)}
                            y={pos.y.toFixed(2)}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#555"
                        >
                            {section.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
