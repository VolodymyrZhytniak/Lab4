/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8895027624309392, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.95, 500, 1500, "-1"], "isController": false}, {"data": [1.0, 500, 1500, "-2"], "isController": false}, {"data": [1.0, 500, 1500, "-9-1"], "isController": false}, {"data": [1.0, 500, 1500, "-3"], "isController": false}, {"data": [1.0, 500, 1500, "-4"], "isController": false}, {"data": [1.0, 500, 1500, "-5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "-19-1"], "isController": false}, {"data": [1.0, 500, 1500, "-6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "-19-0"], "isController": false}, {"data": [1.0, 500, 1500, "-7"], "isController": false}, {"data": [1.0, 500, 1500, "-8"], "isController": false}, {"data": [0.6, 500, 1500, "-9"], "isController": false}, {"data": [0.9, 500, 1500, "-10"], "isController": false}, {"data": [1.0, 500, 1500, "-11"], "isController": false}, {"data": [1.0, 500, 1500, "-22"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "-12"], "isController": false}, {"data": [1.0, 500, 1500, "-13"], "isController": false}, {"data": [1.0, 500, 1500, "-14"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "-17"], "isController": false}, {"data": [0.25, 500, 1500, "-19"], "isController": false}, {"data": [0.85, 500, 1500, "-9-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 181, 0, 0.0, 365.9944751381215, 45, 3917, 207.0, 821.2000000000005, 1392.4000000000003, 2799.3400000000092, 26.85459940652819, 296.5081370548961, 22.195063288204746], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["-1", 10, 0, 0.0, 335.90000000000003, 264, 523, 288.5, 518.8, 523.0, 523.0, 8.968609865470851, 2.680072869955157, 18.480241031390136], "isController": false}, {"data": ["-2", 10, 0, 0.0, 115.1, 96, 180, 103.0, 177.70000000000002, 180.0, 180.0, 12.239902080783354, 16.811935817013463, 5.008319308445532], "isController": false}, {"data": ["-9-1", 10, 0, 0.0, 330.70000000000005, 266, 418, 317.5, 417.8, 418.0, 418.0, 8.19000819000819, 738.5067951474201, 7.630144348894349], "isController": false}, {"data": ["-3", 10, 0, 0.0, 263.7, 244, 321, 251.5, 319.7, 321.0, 321.0, 10.976948408342482, 15.548890299121844, 4.50226399560922], "isController": false}, {"data": ["-4", 10, 0, 0.0, 117.79999999999998, 96, 161, 111.5, 158.60000000000002, 161.0, 161.0, 12.135922330097086, 17.124213061286408, 4.9894758798543695], "isController": false}, {"data": ["-5", 10, 0, 0.0, 108.7, 94, 161, 103.0, 156.5, 161.0, 161.0, 12.239902080783354, 17.24104957160343, 5.0441783965728275], "isController": false}, {"data": ["-19-1", 6, 0, 0.0, 612.6666666666667, 180, 1424, 325.5, 1424.0, 1424.0, 1424.0, 2.782931354359926, 2.142005594851577, 3.9542628130797772], "isController": false}, {"data": ["-6", 10, 0, 0.0, 163.0, 101, 453, 119.0, 428.4000000000001, 453.0, 453.0, 11.534025374855824, 16.348129325259517, 4.764543685121107], "isController": false}, {"data": ["-19-0", 6, 0, 0.0, 764.1666666666666, 209, 2374, 548.0, 2374.0, 2374.0, 2374.0, 2.4630541871921183, 3.1798414408866997, 2.1816310036945814], "isController": false}, {"data": ["-7", 10, 0, 0.0, 107.2, 102, 130, 105.0, 127.80000000000001, 130.0, 130.0, 11.454753722794958, 16.49641144043528, 4.742983963344788], "isController": false}, {"data": ["-8", 10, 0, 0.0, 204.3, 100, 446, 156.5, 444.0, 446.0, 446.0, 10.869565217391305, 15.88293987771739, 4.511294157608695], "isController": false}, {"data": ["-9", 10, 0, 0.0, 676.6, 499, 1035, 612.5, 1020.2, 1035.0, 1035.0, 7.047216349541931, 643.0433513918252, 11.596249559548978], "isController": false}, {"data": ["-10", 10, 0, 0.0, 591.9000000000001, 171, 3917, 208.0, 3556.200000000001, 3917.0, 3917.0, 2.118195297606439, 0.46956087163736493, 0.8667224899385724], "isController": false}, {"data": ["-11", 9, 0, 0.0, 86.66666666666667, 45, 308, 61.0, 308.0, 308.0, 308.0, 9.911894273127754, 2.197265625, 4.055745801211454], "isController": false}, {"data": ["-22", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.472664578891258, 0.8724513592750534], "isController": false}, {"data": ["-12", 9, 0, 0.0, 927.2222222222222, 234, 2129, 635.0, 2129.0, 2129.0, 2129.0, 3.6101083032490977, 6.813217634376254, 4.477380415162455], "isController": false}, {"data": ["-13", 9, 0, 0.0, 142.66666666666666, 88, 236, 123.0, 236.0, 236.0, 236.0, 3.8910505836575875, 8.019803150670125, 4.734618190661478], "isController": false}, {"data": ["-14", 8, 0, 0.0, 102.875, 46, 325, 67.0, 325.0, 325.0, 325.0, 3.5842293906810037, 0.7945508512544802, 1.4665938620071683], "isController": false}, {"data": ["-17", 7, 0, 0.0, 631.5714285714286, 219, 1200, 675.0, 1200.0, 1200.0, 1200.0, 2.7602523659305995, 1.8788045889195584, 2.3586140822160884], "isController": false}, {"data": ["-19", 6, 0, 0.0, 1377.5, 653, 2554, 1267.0, 2554.0, 2554.0, 2554.0, 2.293577981651376, 4.726398246368501, 5.290460149082569], "isController": false}, {"data": ["-9-0", 10, 0, 0.0, 344.79999999999995, 184, 718, 252.5, 706.3000000000001, 718.0, 718.0, 8.673026886383347, 9.33366760624458, 6.191389310494363], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 181, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
