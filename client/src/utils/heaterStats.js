const StatsLib = {
  avg: (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0,
  max: (arr) => arr.length ? Math.max(...arr) : 0,
  min: (arr) => arr.length ? Math.min(...arr) : 0,
};


export const calculateColumnStats  = (heaterRecords) => {
  if (!heaterRecords?.length) return null;

  const tempBoxs = heaterRecords.map(r => parseFloat(r.tempBox)).filter(v => !isNaN(v));
  const rssiHighs = heaterRecords.map(r => parseInt(r.rssiHigh)).filter(v => !isNaN(v));
  const tempHeaters = heaterRecords.map(r => parseFloat(r.tempHeater)).filter(v => !isNaN(v));
  const rssiLows = heaterRecords.map(r => parseInt(r.rssiLow)).filter(v => !isNaN(v));
  const sunlights = heaterRecords.map(r => parseInt(r.sunlight)).filter(v => !isNaN(v));
  const readingCounts = heaterRecords.map(r => parseInt(r.readingCount)).filter(v => !isNaN(v));

  const lastRecord = heaterRecords[0];
  const dateObj = new Date(lastRecord.datetime);
  const lastBoxTemp = lastRecord.tempBox;
  const lastHeaterTemp = lastRecord.tempHeater;
  const lastSunlight = lastRecord.sunlight;

  return {
    tempBox: {avg: StatsLib.avg(tempBoxs).toFixed(1),max: StatsLib.max(tempBoxs).toFixed(1),min: StatsLib.min(tempBoxs).toFixed(1)},
    tempHeater: {avg: StatsLib.avg(tempHeaters).toFixed(1),max: StatsLib.max(tempHeaters).toFixed(1),min: StatsLib.min(tempHeaters).toFixed(1)},
    sunlight: {avg: StatsLib.avg(sunlights).toFixed(1),max: StatsLib.max(sunlights).toFixed(1),min: StatsLib.min(sunlights).toFixed(1)},
    rssiHigh: {avg: StatsLib.avg(rssiHighs).toFixed(1),max: StatsLib.max(rssiHighs).toFixed(1),min: StatsLib.min(rssiHighs).toFixed(1)},
    rssiLow: {avg: StatsLib.avg(rssiLows).toFixed(1),max: StatsLib.max(rssiLows).toFixed(1),min: StatsLib.min(rssiLows).toFixed(1)},
    readingCount: {avg: StatsLib.avg(readingCounts).toFixed(1),max: StatsLib.max(readingCounts).toFixed(1),min: StatsLib.min(readingCounts).toFixed(1)},

    lastTime: dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
    lastDate: dateObj.toLocaleDateString(),
    lastCount: lastRecord.readingCount,
    lastBoxTemp: lastBoxTemp,
    lastHeaterTemp: lastHeaterTemp,
    lastSunlight: lastSunlight
    

  };
};