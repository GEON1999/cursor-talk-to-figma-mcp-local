import WebSocket from 'ws';

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: Number((parseInt(result[1], 16) / 255).toFixed(3)),
    g: Number((parseInt(result[2], 16) / 255).toFixed(3)),
    b: Number((parseInt(result[3], 16) / 255).toFixed(3)),
    a: 1
  } : null;
};

const palettes = {
  White: "#FFFFFF",
  Black: "#000000",
  G50: "#FAFAFA",
  G100: "#F5F5F5",
  G200: "#EEEEEE",
  G300: "#E0E0E0",
  G500: "#9E9E9E",
  G700: "#616161",
  G800: "#424242",
  G900: "#222222",
  P50: "#F3EDF5",
  P300: "#B672CF",
  P500: "#7C00A9",
  P700: "#560076",
  R50: "#FFEFEF",
  R500: "#D35855",
  R700: "#C13431" // Hover red
};

const tokens = [
  // Background
  { name: "color/bg/primary", ref: "White" },
  { name: "color/bg/secondary", ref: "G50" },
  { name: "color/bg/tertiary", ref: "G100" },
  { name: "color/bg/tertiary/hover", ref: "G200" },
  { name: "color/bg/tertiary/disabled", ref: "G300" },
  { name: "color/bg/strong", ref: "G800" },
  { name: "color/bg/strong/hover", ref: "G900" },
  { name: "color/bg/brand/light", ref: "P50" },
  { name: "color/bg/brand", ref: "P500" },
  { name: "color/bg/brand/hover", ref: "P700" },
  { name: "color/bg/error", ref: "R50" },
  
  // Border
  { name: "color/border/tertiary", ref: "G50" },
  { name: "color/border/secondary", ref: "G200" },
  { name: "color/border/primary", ref: "G300" },
  { name: "color/border/brand/light", ref: "P300" },
  { name: "color/border/brand", ref: "P500" },
  { name: "color/border/error", ref: "R500" },
  
  // Text
  { name: "color/text/tertiary/disabled", ref: "White" },
  { name: "color/text/tertiary", ref: "G500" },
  { name: "color/text/secondary", ref: "G700" },
  { name: "color/text/primary", ref: "G900" },
  { name: "color/text/strong", ref: "Black" },
  { name: "color/text/brand", ref: "P500" },
  { name: "color/text/brand/hover", ref: "P700" },
  { name: "color/text/error", ref: "R500" },
  { name: "color/text/error/hover", ref: "R700" },

  // Base Grays
  { name: "color/gray/50", ref: "G50" },
  { name: "color/gray/100", ref: "G100" },
  { name: "color/gray/200", ref: "G200" },
  { name: "color/gray/300", ref: "G300" },
  { name: "color/gray/500", ref: "G500" },
  { name: "color/gray/700", ref: "G700" },
  { name: "color/gray/800", ref: "G800" },
  { name: "color/gray/900", ref: "G900" },

  // Base Purples
  { name: "color/purple/50", ref: "P50" },
  { name: "color/purple/300", ref: "P300" },
  { name: "color/purple/500", ref: "P500" },
  { name: "color/purple/700", ref: "P700" },

  // Base Reds
  { name: "color/red/50", ref: "R50" },
  { name: "color/red/500", ref: "R500" },
  { name: "color/red/700", ref: "R700" }
];

const allVariables = tokens.map(t => ({
  name: t.name,
  color: hexToRgb(palettes[t.ref])
}));

const ws = new WebSocket("ws://localhost:3055");
ws.on("open", () => {
  console.log("Joined...");
  ws.send(JSON.stringify({ type: "join", channel: "figma-default" }));
  
  ws.on("message", (data) => console.log(data.toString()));

  setTimeout(() => {
    ws.send(JSON.stringify({
      type: "message",
      channel: "figma-default",
      message: {
        id: "testRole_" + Date.now(),
        command: "create_multiple_color_variables",
        params: {
          collectionName: "쁘띠 테마 (Petit Theme)",
          variables: allVariables
        }
      }
    }));
    
    setTimeout(() => process.exit(0), 1500);
  }, 500);
});
