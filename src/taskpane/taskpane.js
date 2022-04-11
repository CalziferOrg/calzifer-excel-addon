/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

  // Determine if the user's version of Office supports all the Office.js APIs that are used in the tutorial.
  if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
    console.log('Sorry. The tutorial add-in uses Excel.js APIs that are not available in your version of Office.');
  }

  // Assign event handlers and other initialization logic.
  document.getElementById("create-table").onclick = createTable;

  document.getElementById("filter-table").onclick = filterTable;

  document.getElementById("sort-table").onclick = sortTable;

  document.getElementById("create-chart").onclick = createChart;

  document.getElementById("freeze-header").onclick = freezeHeader;

}
});

async function createTable() {
  await Excel.run(async (context) => {

      // TODO1: Queue table creation logic here.
      const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
      const expensesTable = currentWorksheet.tables.add("A1:D1", true /*hasHeaders*/);
      expensesTable.name = "ExpensesTable";

      // TODO2: Queue commands to populate the table with data.
      expensesTable.getHeaderRowRange().values =
      [["Date", "Merchant", "Category", "Amount"]];

      expensesTable.rows.add(null /*add at the end*/, [
        ["1/1/2017", "The Phone Company", "Communications", "120"],
        ["1/2/2017", "Northwind Electric Cars", "Transportation", "142.33"],
        ["1/5/2017", "Best For You Organics Company", "Groceries", "27.9"],
        ["1/10/2017", "Coho Vineyard", "Restaurant", "33"],
        ["1/11/2017", "Bellows College", "Education", "350.1"],
        ["1/15/2017", "Trey Research", "Other", "135"],
        ["1/15/2017", "Best For You Organics Company", "Groceries", "97.88"]
      ]);

      // TODO3: Queue commands to format the table.
      expensesTable.columns.getItemAt(3).getRange().numberFormat = [['\u20AC#,##0.00']];
      expensesTable.getRange().format.autofitColumns();
      expensesTable.getRange().format.autofitRows();

      await context.sync();
  })
  .catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
  });
}


async function filterTable() {
  await Excel.run(async (context) => {

      // TODO1: Queue commands to filter out all expense categories except
      //        Groceries and Education.
      const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
      const expensesTable = currentWorksheet.tables.getItem('ExpensesTable');
      const categoryFilter = expensesTable.columns.getItem('Category').filter;
      categoryFilter.applyValuesFilter(['Education', 'Groceries']);

      await context.sync();
  })
  .catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
  });
}


async function sortTable() {
  await Excel.run(async (context) => {

      // TODO1: Queue commands to sort the table by Merchant name.
      const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
      const expensesTable = currentWorksheet.tables.getItem('ExpensesTable');
      const sortFields = [
          {
              key: 1,            // Merchant column
              ascending: false,
          }
      ];

      expensesTable.sort.apply(sortFields);

      await context.sync();
  })
  .catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
  });
}


async function createChart() {
  await Excel.run(async (context) => {

      // TODO1: Queue commands to get the range of data to be charted.
      const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
      const expensesTable = currentWorksheet.tables.getItem('ExpensesTable');
      const dataRange = expensesTable.getDataBodyRange();

      // TODO2: Queue command to create the chart and define its type.
      const chart = currentWorksheet.charts.add('ColumnClustered', dataRange, 'Auto');

      // TODO3: Queue commands to position and format the chart.
      chart.setPosition("A15", "F30");
      chart.title.text = "Expenses";
      chart.legend.position = "Right";
      chart.legend.format.fill.setSolidColor("white");
      chart.dataLabels.format.font.size = 15;
      chart.dataLabels.format.font.color = "black";
      chart.series.getItemAt(0).name = 'Value in \u20AC';

      await context.sync();
  })
  .catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
  });
}


async function freezeHeader() {
  await Excel.run(async (context) => {

      // TODO1: Queue commands to keep the header visible when the user scrolls.
      const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
      currentWorksheet.freezePanes.freezeRows(1);

      await context.sync();
  })
  .catch(function (error) {
      console.log("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
  });
}