function data_handle_HaGrid(data_points){
    original_slider_control_disable();
    ours_slider_control_disable();

    console.log("original data start handle");
    d3.shuffle(data_points)
    data_points = data_points.slice(0, Math.round(original_data_s * data_points.length))

    console.log(data_points.length);

    const point_num = data_points.length;

    const point_num_text = statistics_svg.append('text')
        .attr('font-size', '20px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'hanging')
        .attr('text-anchor', 'start')
        .attr('x', 5)
        .attr('y', 5)
        .attr('fill', light_on ? 'black' : 'white')
        .text('point num: ' + point_num);

    const labels = data_points.map(d => d['label']);
    const [min_x, max_x] = d3.extent(data_points, d => d.x);
    const [min_y, max_y] = d3.extent(data_points, d => d.y);
    const width = max_x - min_x;
    const height = max_y - min_y;

    let label_set = new Set();
    labels.forEach(function(value, key) {
        label_set.add(value);
    })

    const label_num_text = statistics_svg.append('text')
        .attr('font-size', '20px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'hanging')
        .attr('text-anchor', 'start')
        .attr('x', 5)
        .attr('y', 35)
        .attr('fill', light_on ? 'black' : 'white')
        .text('label num: ' + label_set.size);

    const x_scale = d3.scaleLinear()
        .domain([min_x, max_x])
        .range([0, canvas_width]);
    const y_scale = d3.scaleLinear()
        .domain([min_y, max_y])
        .range([0, canvas_height]);


    data_points.map(function (item){
        if(special_data_symbol == 0){
            item.color = color_scheme1[item.label%10];
        }
        else if(special_data_symbol == 1){
            item.color = color_scheme2[item.label];
        };

        if(width < height){
            item.size = canvas_width/height * item.size;
        }
        else{
            item.size = canvas_width/width * item.size;
        }

        item.x = x_scale(item.x);
        item.y = y_scale(item.y);
        item.size = item.size

        item.x = item.x + item.size/2;
        item.y = item.y + item.size/2;
        item.draw_r = item.size/2;

        json_array.push({
            x: item['x'],
            y: item['y'],
            color: item['color'],
            r: item['draw_r']
        })
    })

    //json save event
    json_text.on('click',function(){
        let content = JSON.stringify(json_array);
        let fileName = has_upload == 1 ? "Ours.json" : algorithm+".json"
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName);
    })

    draw(data_points);

}