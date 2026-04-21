const StatsLib = {
  avg: (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0,
  max: (arr) => arr.length ? Math.max(...arr) : 0,
  min: (arr) => arr.length ? Math.min(...arr) : 0,
};

export const calculateColumnStats = (heaterRecords) => {
  if (!heaterRecords?.length) return null;

  const tempBoxs = heaterRecords.map(r => parseFloat(r.tempBox)).filter(v => !isNaN(v));
  const tempHeaters = heaterRecords.map(r => parseFloat(r.tempHeater)).filter(v => !isNaN(v));
  const rssiAvgs = heaterRecords.map(r => parseInt(r.rssiAvg)).filter(v => !isNaN(v));
  const readingCounts = heaterRecords.map(r => parseInt(r.readingCount)).filter(v => !isNaN(v));

  const lastRecord = heaterRecords[0];
  const dateObj = new Date(lastRecord.datetime);

  return {
    tempBox: {
      avg: StatsLib.avg(tempBoxs).toFixed(1),
      max: StatsLib.max(tempBoxs).toFixed(1),
      min: StatsLib.min(tempBoxs).toFixed(1)
    },
    tempHeater: {
      avg: StatsLib.avg(tempHeaters).toFixed(1),
      max: StatsLib.max(tempHeaters).toFixed(1),
      min: StatsLib.min(tempHeaters).toFixed(1)
    },
    rssiAvg: {
      avg: StatsLib.avg(rssiAvgs).toFixed(0),
      max: StatsLib.max(rssiAvgs),
      min: StatsLib.min(rssiAvgs)
    },
    readingCount: {
      avg: StatsLib.avg(readingCounts).toFixed(1),
      max: StatsLib.max(readingCounts),
      min: StatsLib.min(readingCounts)
    },

    lastTime: dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
    lastDate: dateObj.toLocaleDateString(),
    lastCount: lastRecord.readingCount,
    lastBoxTemp: lastRecord.tempBox,
    lastHeaterTemp: lastRecord.tempHeater,
    lastStatus: lastRecord.statusBits,
    lastRSSI: lastRecord.rssiAvg
  };
};