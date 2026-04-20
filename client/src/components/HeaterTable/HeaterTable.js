import React from 'react';
import './HeaterTable.css';

const HeaterTable = ({ records = [], columnStats }) => {
    if (!columnStats) return null;

    return (
        <div className="heaterTableContainer">
            <table className="heaterTable">
                <thead className="heaterTableHeader">
                    <tr className="heaterTableHeaderRow1">
                        <th className="heaterTableHeaderCell1Row2"></th>
                        <th className="heaterTableHeaderCellRow1 smaller stack-text" id="">Box °C</th>
                        <th className="heaterTableHeaderCellRow1 smaller stack-text">Heater °C</th>
                        <th className="heaterTableHeaderCellRow1 smaller stack-text">Sun intensity</th>
                        <th className="heaterTableHeaderCellRow1 smaller stack-text">rssiHigh dB</th>
                        <th className="heaterTableHeaderCellRow1 smaller stack-text">rssiLow dB</th>
                        <th className="heaterTableHeaderCellRow1 smaller stack-text">Count Diff</th>
                    </tr>
                    <tr className="heaterTableHeaderRow2">
                        <th className="heaterTableHeaderCell1Row2 smaller">MAX</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempBox.max}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempHeater.max}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.sunlight.max}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.rssiHigh.max}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.rssiLow.max}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.readingCount.max}</th>
                    </tr>
                    <tr className="heaterTableHeaderRow3">
                        <th className="heaterTableHeaderCell1Row2 smaller">AVG</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempBox.avg}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempHeater.avg}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.sunlight.avg}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.rssiHigh.avg}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.rssiLow.avg}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.readingCount.avg}</th>
                    </tr>
                    <tr className="heaterTableHeaderRow3">
                        <th className="heaterTableHeaderCell1Row2 smaller">MIN</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempBox.min}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.tempHeater.min}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.sunlight.min}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.rssiHigh.min}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.rssiLow.min}</th>
                        <th className="heaterTableHeaderCellRow1">{columnStats.readingCount.min}</th>
                    </tr>
                </thead>
                <tbody className="heaterTableBody">
                    <tr className="heaterTablePlaceholder"></tr>
                    {Array.isArray(records) && records.map((record) => (
                        <tr key={record.id} className="heaterTableRow">
                            <td className="heaterTableCell2">
                                {record.datetime ? new Date(record.datetime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : "N/a"}
                            </td>
                            <td className="heaterTableCell">{record.tempBox ?? "N/a"}</td>
                            <td className="heaterTableCell">{record.tempHeater ?? "N/a"}</td>
                            <td className="heaterTableCell">{record.sunlight ?? "N/a"}</td>
                            <td className="heaterTableCell">{record.rssiHigh ?? "N/a"}</td>
                            <td className="heaterTableCell">{record.rssiLow ?? "N/a"}</td>
                            <td className="heaterTableCell">{record.readingCount ?? "N/a"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HeaterTable;