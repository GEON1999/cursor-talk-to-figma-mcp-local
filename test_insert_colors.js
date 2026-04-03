import WebSocket from "ws";

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Number((parseInt(result[1], 16) / 255).toFixed(3)),
    g: Number((parseInt(result[2], 16) / 255).toFixed(3)),
    b: Number((parseInt(result[3], 16) / 255).toFixed(3))
  } : null;
};

const pinkColors = [
  { name: "color/pink/50", hex: "#FFEFF3" },
  { name: "color/pink/100", hex: "#FFD6DE" },
  { name: "color/pink/200", hex: "#FFBACA" },
  { name: "color/pink/300", hex: "#FF96AE" },
  { name: "color/pink/400", hex: "#FF7F9D" },
  { name: "color/pink/500", hex: "#F37091" },
  { name: "color/pink/600", hex: "#E54C75" },
  { name: "color/pink/700", hex: "#C9365E" },
  { name: "color/pink/800", hex: "#A1244B" },
  { name: "color/pink/900", hex: "#7A1637" }
];

const primaryColors = [
  { name: "color/primary/50", hex: "#F3EDF5" },
  { name: "color/primary/100", hex: "#DEBFE9" },
  { name: "color/primary/200", hex: "#CA99DC" },
  { name: "color/primary/300", hex: "#B672CF" },
  { name: "color/primary/400", hex: "#A34CC2" },
  { name: "color/primary/500", hex: "#7C00A9" },
  { name: "color/primary/600", hex: "#69008F" },
  { name: "color/primary/700", hex: "#560076" },
  { name: "color/primary/800", hex: "#44005C" }
];

const allVariables = [...pinkColors, ...primaryColors].map(c => ({
  name: c.name,
  color: {
    r: hexToRgb(c.hex).r,
    g: hexToRgb(c.hex).g,
    b: hexToRgb(c.hex).b,
    a: 1
  }
}));

console.log("변환된 Color 데이터:", allVariables);

const ws = new WebSocket("ws://localhost:3055");

ws.on("open", () => {
  console.log("WebSocket 연결 성공. Figma 채널 입장 중...");
  ws.send(JSON.stringify({ type: "join", channel: "figma-default" }));
  
  ws.on("message", (data) => {
    console.log("플러그인 응답:", data.toString());
  });

  setTimeout(() => {
    console.log("메시지 전송: create_multiple_color_variables");
    ws.send(JSON.stringify({
      type: "message",
      channel: "figma-default",
      message: {
        id: "test_" + Date.now(),
        command: "create_multiple_color_variables",
        params: {
          collectionName: "쁘띠 테마 (Petit Theme)",
          variables: allVariables
        }
      }
    }));
    
    // 메시지 처리 후 종료 대기
    setTimeout(() => {
      console.log("완료. 스크립트 종료.");
      process.exit(0);
    }, 2000);
  }, 1000);
});

ws.on("error", (error) => {
  console.error("웹소켓 에러 발생: ", error.message);
  process.exit(1);
});
