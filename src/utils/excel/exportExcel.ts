import * as XLSX from 'xlsx';

//对导出的数据进行处理
const transData = (columns, tableList) => {
  const tableHead = columns.filter(item => item.title !== '操作')
  .map(item => item.title);
  const dataIndexs = columns.map(item => item.dataIndex);
  const tableBody = tableList.map(item => itemDispose(item));

  function itemDispose(item) {
    const values: any = []
    Object.values(dataIndexs).forEach(key1 => {
      Object.keys(item).forEach(key2 => {
        const key = typeof key1 === 'string' ? key1 : JSON.parse(JSON.stringify(key1))?.[0]
        key === key2 && values.push(item[key2])
      })
    })
    return values
  }

  return [tableHead, ...tableBody];
}

//导出excel数据
export const exportExcel = (columns, tableList, exportName = "数据") => {
  const tableData = transData(
    columns,
    tableList
  );
  // 将一组 JS 数据数组转换为工作表
  const ws = XLSX.utils.aoa_to_sheet(tableData);
  // 创建 workbook
  const wb = XLSX.utils.book_new();
  // 将 工作表 添加到 workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  // 将 workbook 写入文件
  XLSX.writeFile(wb, exportName + '.xlsx');
}