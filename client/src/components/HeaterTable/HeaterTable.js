import React from 'react';
import './HeaterTable.css';

const HeaterTable = ({ records = [], columnStats }) => {
    if (!columnStats) return null;

    return (
        <div className="heaterTableContainer">
            <table className="heaterTable">
                <thead className="heaterTableHeader">
                    <tr className="heaterTableHeaderRow1">
                        <th className="heaterTableHeaderCell1Row2">Time</th>
                        <th className="heaterTableHeaderCellRow1 smaller">Box °C</th>
                        <th className="heaterTableHeaderCellRow1 smaller">Heater °C</th>
                        <th className="heaterTableHeaderCellRow1 smaller">Status</th>
                        <th className="heaterTableHeaderCellRow1 smaller">RSSI %</th>
                        <th className="heaterTableHeaderCellRow1 smaller">Packets</th>
                    </tr>
                    <tr className="heaterTableHeaderRow2">
                        <th className="heaterTableHeaderCell1Row2 smaller">MAX</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempBox.max}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempHeater.max}</th>
                        <th className="heaterTableHeaderCellRow1">-</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.rssiAvg.max}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.readingCount.max}</th>
                    </tr>
                    <tr className="heaterTableHeaderRow3">
                        <th className="heaterTableHeaderCell1Row2 smaller">AVG</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempBox.avg}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempHeater.avg}</th>
                        <th className="heaterTableHeaderCellRow1">-</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.rssiAvg.avg}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.readingCount.avg}</th>
                    </tr>
                </thead>
                <tbody className="heaterTableBody">
                    {records.map((record) => (
                        <tr key={record.id} className="heaterTableRow">
                            <td className="heaterTableCell2">
                                {new Date(record.datetime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </td>
                            <td className="heaterTableCell">{record.tempBox}</td>
                            <td className="heaterTableCell">{record.tempHeater}</td>
                            <td className="heaterTableCell">{record.statusBits}</td>
                            <td className="heaterTableCell">{record.rssiAvg}</td>
                            <td className="heaterTableCell">{record.readingCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HeaterTable;