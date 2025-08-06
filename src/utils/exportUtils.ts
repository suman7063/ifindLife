import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportData {
  title: string;
  headers: string[];
  data: (string | number)[][];
  summary?: { label: string; value: string | number }[];
}

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(data.title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  
  let yPosition = 50;
  
  // Summary section if provided
  if (data.summary) {
    doc.setFontSize(14);
    doc.text('Summary', 20, yPosition);
    yPosition += 10;
    
    data.summary.forEach((item) => {
      doc.setFontSize(10);
      doc.text(`${item.label}: ${item.value}`, 20, yPosition);
      yPosition += 7;
    });
    
    yPosition += 10;
  }
  
  // Table
  doc.autoTable({
    head: [data.headers],
    body: data.data,
    startY: yPosition,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
    },
  });
  
  const filename = `${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
};

export const exportToExcel = (data: ExportData) => {
  let csvContent = '';
  
  // Add title
  csvContent += `${data.title}\n`;
  csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // Add summary if provided
  if (data.summary) {
    csvContent += 'Summary\n';
    data.summary.forEach((item) => {
      csvContent += `${item.label},${item.value}\n`;
    });
    csvContent += '\n';
  }
  
  // Add headers
  csvContent += data.headers.join(',') + '\n';
  
  // Add data rows
  data.data.forEach((row) => {
    csvContent += row.map(cell => 
      typeof cell === 'string' && cell.includes(',') 
        ? `"${cell}"` 
        : cell
    ).join(',') + '\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate sample earnings data for export
export const generateEarningsExportData = (currency: string, period: string): ExportData => {
  const currencySymbol = currency === 'INR' ? '₹' : '€';
  
  return {
    title: `Earnings Report - ${period}`,
    headers: ['Date', 'Session Type', 'Duration (min)', 'Amount', 'Status'],
    data: [
      // Sample data - replace with actual data
      ['2024-01-15', 'Life Coaching', '60', `${currencySymbol}100`, 'Paid'],
      ['2024-01-14', 'Mindfulness Session', '30', `${currencySymbol}50`, 'Paid'],
      ['2024-01-13', 'Spiritual Guidance', '45', `${currencySymbol}75`, 'Pending'],
    ],
    summary: [
      { label: 'Total Earnings', value: `${currencySymbol}225` },
      { label: 'Sessions Completed', value: '3' },
      { label: 'Average Session Value', value: `${currencySymbol}75` },
      { label: 'Pending Payouts', value: `${currencySymbol}75` }
    ]
  };
};

// Generate sample analytics data for export
export const generateAnalyticsExportData = (period: string): ExportData => {
  return {
    title: `Analytics Report - ${period}`,
    headers: ['Metric', 'Value', 'Change from Previous Period'],
    data: [
      ['Total Sessions', '12', '+20%'],
      ['Total Revenue', '€1,200', '+15%'],
      ['Average Rating', '4.8/5', '+0.2'],
      ['Client Retention', '85%', '+5%'],
      ['Response Time (avg)', '2.3 mins', '-0.5 mins'],
      ['Session Completion Rate', '98%', '+2%'],
    ],
    summary: [
      { label: 'Performance Score', value: '92/100' },
      { label: 'Growth Rate', value: '+18%' },
      { label: 'Client Satisfaction', value: '4.8/5' }
    ]
  };
};