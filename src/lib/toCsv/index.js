import * as XLSX from 'xlsx';

export default (filename, list) => {
  const ws = XLSX.utils.aoa_to_sheet(list);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  XLSX.writeFile(wb, filename + '.xlsx');
}