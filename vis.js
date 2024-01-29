d3.csv('dataset.csv?' + new Date().getTime(), function(dataset) {
    var data = d3.entries(dataset).map(function(d) {
        var val = d.value;
        val.key = d.key;
        return val;
    })

    data.forEach(function(d) {
        d.viz = d.IVIS;
        delete d.IVIS; 
    });
    data.forEach(function(d) {
        d.stats	 = d.Stat;
        delete d.Stat; 
    });
    data.forEach(function(d) {
        d.math= d.Math;
        delete d.Math;
    });
    data.forEach(function(d) {
        d.art = d.Art;
        delete d.Art; 
    });
    data.forEach(function(d) {
        d.ui = d.Computers;
        delete d.Computers;
    });
    data.forEach(function(d) {
        d.code = d.Prog;
        delete d.Prog; 
    });
    data.forEach(function(d) {
        d.graph = d.Graphics;
        delete d.Graphics; 
    });
    data.forEach(function(d) {
        d.hci	= d.HCI;
        delete d.HCI;
    });
    data.forEach(function(d) {
        d.eval = d.UX;
        delete d.UX; 
    });
    data.forEach(function(d) {
        d.comm = d.Communication;
        delete d.Communication; 
    });
    data.forEach(function(d) {
        d.collab = d.Collab;
        delete d.Collab; 
    });
    var dataAvg = [{}];
        dataAvg[0].viz = d3.mean(data, function(d) { return d.viz.toString(); });
        dataAvg[0].stats = d3.mean(data, function(d) { return d.stats.toString(); });
        dataAvg[0].math = d3.mean(data, function(d) { return d.math.toString(); });
        dataAvg[0].art = d3.mean(data, function(d) { return d.art.toString(); });
        dataAvg[0].ui = d3.mean(data, function(d) { return d.ui.toString(); });
        dataAvg[0].code = d3.mean(data, function(d) { return d.code.toString(); });
        dataAvg[0].graph = d3.mean(data, function(d) { return d.graph.toString(); });
        dataAvg[0].hci = d3.mean(data, function(d) { return d.hci.toString(); });
        dataAvg[0].eval = d3.mean(data, function(d) { return d.eval.toString(); });
        dataAvg[0].comm = d3.mean(data, function(d) { return d.comm.toString(); });
        dataAvg[0].collab = d3.mean(data, function(d) { return d.collab.toString(); });


    var groupData = [];
    var groupAvg = [{}];

    var groupProgress = d3.select('#groupVis').style('text-align', 'center')
        groupProgress.append('div')
    var progressRow = groupProgress.selectAll('div.key')
        .data(d3.keys(dataAvg[0]))
        .enter()
        .append('div')
        .attr('class', 'progress')
        progressRow.append('medium').attr('class', 'd-flex position-absolute progressLabel').text(function(d) { return d; })

    var progress = progressRow.append('div')
        .attr('class', 'progress-bar')
        .attr('id', function(d) { 
            return 'prog-' + d; } )
        .style('width', function(d) { return (dataAvg[0][d]*10).toFixed(0) + '%'; })

    var progressMissing = progressRow.append('div')
        .attr('class', 'progress-bar progress-bar-striped progress-bar-animated')
        .attr('id', function(d) { return 'prog-missing-' + d; } )
        .style('width', function(d) { return '0%'; })
        .style('background-color', '#f8f9fa')

    var progressExtra = progressRow.append('div')
        .attr('class', 'progress-bar progress-bar-striped progress-bar-animated')
        .attr('id', function(d) { return 'prog-extra-' + d; } )
        .style('width', function(d) { return '0%'; })
        .style('background-color', '#f8f9fa')
        
    var groupInfo = groupProgress.append('div').attr('class', 'row').attr('id', 'explanatoryProgBars')
        groupInfo.append('div').attr('class', 'col-6').append('div').attr('class', 'progress').append('div').attr('class','progress-bar progress-bar-striped bg-danger').style('width', '100%').text('Under class average')
        groupInfo.append('div').attr('class', 'col-6').append('div').attr('class', 'progress').append('div').attr('class','progress-bar progress-bar-striped bg-success').style('width', '100%').text('Above class average')
        

    d3.select('#possibleGroupMembers')
        .append('h3').text('Possible Group Members')
        .append('table').attr('id', 'possibleGroupMembersTable').attr('class', 'table table-bordered');
    
    d3.select('#selectedGroup')
        .append('h3').text('Selected Group')
        .append('table').attr('id', 'possibleGroupTable').attr('class', 'table table-bordered');
    


    var colorScheme = d3.scale.linear()
        .domain([1, 10])
        .range(['#FFD700', '#FF69B4'])
        .interpolate(d3.interpolateHcl);

    var color = function(d) { return colorScheme(d.viz); };

    var parcoords = d3.parcoords()('#vis')
        .data(data)
        .hideAxis(['Name', 'Major', 'Degree', 'Interests', 'Goals',  'key'])
        .color(color)
        .alpha(0.4)
        .composite('darken')
        .margin({ top: 20, left: 20, bottom: 10, right: 25 })
        .mode('queue')
        .render()
        .reorderable()
        .brushMode('1D-axes')



        parcoords.on('brush', function(d) {
            updatePossibleGroupMembersTable(d);
        });
        
        function updatePossibleGroupMembersTable(filteredData) {
            var membersTable = d3.select('#possibleGroupMembersTable').html('');
            var rows = membersTable.selectAll('tr')
                .data(filteredData)
                .enter()
                .append('tr')
                .append('td')
                .text(function(d) { return d.Name; })
                .style('cursor', 'pointer')
                .on('click', function(d) {
                    console.log("Clicked data:", d);
                    addNameToPossibleGroup(d.Name);
                });
        }
        
        function addNameToPossibleGroup(name) {
            console.log("Adding name to Possible Group:", name);
    
            var groupTable = d3.select('#possibleGroupTable tbody');
            if (groupTable.empty()) {
                groupTable = d3.select('#possibleGroupTable').append('tbody');
            }
            var row = groupTable.append('tr');
            row.append('td').text(name);
        }
        

        var classTable = d3.select('#classTable').append('table')
        .attr('class', 'table table-bordered');
        var classTbody = classTable.append('tbody');
    

        var namesPerRow = 10;
        var numberOfRows = Math.ceil(data.length / namesPerRow);
    


    for (var i = 0; i < numberOfRows; i++) {
        var row = classTbody.append('tr');
        for (var j = 0; j < namesPerRow; j++) {
            var nameIndex = i * namesPerRow + j;
            var cell = row.append('td');

            if (nameIndex < data.length) {
                var studentName = data[nameIndex].Name;
                cell.text(studentName);

                cell.on('mouseover', (function(name) {
                    return function() {
                        var studentData = data.filter(function(d) { return d.Name === name; });
                        parcoords.highlight(studentData);


                        var tooltip = d3.select("#tooltip");
                        tooltip.html("Interests: " + studentData[0].Interests)
                            .style("visibility", "visible")
                            .style("top", (d3.event.pageY - 10) + "px")
                            .style("left", (d3.event.pageX + 10) + "px");
                    };
                })(studentName))
                .on('mouseout', function() {
                    parcoords.unhighlight();

                    d3.select("#tooltip").style("visibility", "hidden");
                });
            }
        }
    }
    


})