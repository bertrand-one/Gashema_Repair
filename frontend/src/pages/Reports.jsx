import { useState } from 'react';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import api from '../services/api';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startDate, setStartDate] = useState(format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);

      let response;
      if (reportType === 'daily') {
        response = await api.get(`/api/reports/daily?date=${date}`);
      } else {
        response = await api.get(`/api/reports/range?startDate=${startDate}&endDate=${endDate}`);
      }

      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.records || reportData.records.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Create CSV content
    const headers = Object.keys(reportData.records[0]).join(',');
    const rows = reportData.records.map(record =>
      Object.values(record).map(value =>
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    ).join('\n');

    const csvContent = `${headers}\n${rows}`;

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-dark-400">Generate and view reports</p>
      </div>

      <div className="bg-dark-700 rounded-lg border border-dark-600 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Report Type</label>
            <select
              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors duration-200"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="daily">Daily Report</option>
              <option value="range">Date Range Report</option>
            </select>
          </div>

          {reportType === 'daily' ? (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors duration-200"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors duration-200"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors duration-200"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="px-8 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Report'
            )}
          </button>
        </div>
      </div>

      {reportData && (
        <div className="bg-dark-700 rounded-lg border border-dark-600 p-6 print:bg-white print:border-gray-300 print:shadow-none" id="report-content">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
            <h2 className="text-xl font-bold text-white">
              {reportType === 'daily'
                ? `Daily Report - ${format(new Date(reportData.date), 'dd/MM/yyyy')}`
                : `Report from ${format(new Date(reportData.startDate), 'dd/MM/yyyy')} to ${format(new Date(reportData.endDate), 'dd/MM/yyyy')}`
              }
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
              >
                Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                Print
              </button>
            </div>
          </div>

          <div className="print:block">
            <div className="text-center mb-6 hidden print:block">
              <h1 className="text-2xl font-bold">SmartPark Car Repair Management System</h1>
              <h2 className="text-xl">
                {reportType === 'daily'
                  ? `Daily Report - ${format(new Date(reportData.date), 'dd/MM/yyyy')}`
                  : `Report from ${format(new Date(reportData.startDate), 'dd/MM/yyyy')} to ${format(new Date(reportData.endDate), 'dd/MM/yyyy')}`
                }
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-bold">{reportData.records.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">{reportData.totalAmount.toLocaleString()} RWF</p>
              </div>
              {reportType === 'range' && reportData.serviceGroups && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Most Popular Service</p>
                  <p className="text-2xl font-bold">
                    {Object.entries(reportData.serviceGroups)
                      .sort((a, b) => b[1].count - a[1].count)[0]?.[0] || 'N/A'}
                  </p>
                </div>
              )}
            </div>

            {reportType === 'range' && reportData.serviceGroups && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Services Summary</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Revenue (RWF)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(reportData.serviceGroups).map(([name, data]) => (
                        <tr key={name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {data.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {data.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <h3 className="text-lg font-medium mb-3">Service Records</h3>
            {reportData.records.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No records found for this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Record #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Car
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount (RWF)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Received By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.records.map((record) => (
                      <tr key={record.RecordNumber}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.RecordNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.PlateNumber} {record.Model && `(${record.Model})`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.ServiceName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {parseFloat(record.AmountPaid).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(record.PaymentDate), 'dd/MM/yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.ReceiverName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500 hidden print:block">
              <p>Generated on {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
              <p>SmartPark Car Repair Management System</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
