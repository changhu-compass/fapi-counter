(function (Viz) {
    'use strict';

    Viz.Graphs = (function () {


        var fapiDeployment = {
            preprocess: function (rows) {

                var shift = function (date) {
                    return date.getDay() * 24 + date.getHours();
                };

                var data = [];
                for (var i = 0; i < 24; i++) {
                    data[i] = {
                        date: null,
                        count: 0
                    };
                }

                var minHour = -1;
                rows.forEach(function (row) {
                    console.log(row);
                    var format = d3.time.format("%Y/%m/%d %I:%M %p");
                    var date = format.parse(row.TimeStamp);

                    if (minHour === -1) {
                        minHour = shift(date);
                    }

                    var pos = shift(date) - minHour;
                    data[pos].count++;
                    data[pos].date = date;
                });
                return data;
            },

            draw: function (data, selector) {
                //Width and height
                var w = 1000;
                var h = 150;
                var barPadding = 5;
                var hScale = 50;
                var hMargin = 10;

                //Create SVG element
                var svg = d3.select(selector)
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h + hMargin);
                svg.selectAll("rect")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", function (d, i) {
                        return i * (w / data.length);
                    })
                    .attr("y", function (d) {
                        return h - (d.count * hScale);
                    })
                    .attr("width", w / data.length - barPadding)
                    .attr("height", function (d) {
                        return d.count * hScale;
                    })
                    .attr("fill", "teal");

                //Labels
                svg.selectAll("text")
                    .data(data)
                    .enter()
                    .append("text")
                    .text(function (d, i) {
                        if (d.date === null) return '';
                        var date = d.date;
                        date.setMinutes(0);
                        return date.toTimeString().substring(0, 5);
                    })
                    .attr("x", function (d, i) {
                        return i * (w / data.length) + 5;
                    })
                    .attr("y", h + hMargin)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "10px")
                    .attr("fill", "black");

            }
        };



        return {
            fapiDeployment: function (rows, selector) {
                var data = fapiDeployment.preprocess(rows);
                fapiDeployment.draw(data, selector);
            }
        };

    })();

})(window.Viz = window.Viz || {});