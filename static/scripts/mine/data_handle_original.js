function data_handle_original(data_points){
    original_slider_control_enable();
    ours_slider_control_disable();

    //data_points = data_formal_for_draw(data_points);

    console.log("original data start handle");
    d3.shuffle(data_points)
    data_points = data_points.slice(0, Math.round(original_data_s * data_points.length))

    const point_num = data_points.length;
    console.log('num of data points:', point_num);

    statistics_svg.append('text')
        .attr('font-size', $('#l_win').width()/40)
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'hanging')
        .attr('text-anchor', 'start')
        .attr('x', $('#l_win').width()/160)
        .attr('y', $('#l_win').width()/160)
        .attr('fill', light_on ? 'black' : 'white')
        .text('point num: ' + point_num);

    const labels = data_points.map(d => d['label']);

    let label_set = new Set();
    labels.forEach(function(value, key) {
        label_set.add(value);
    })

    statistics_svg.append('text')
        .attr('font-size', $('#l_win').width()/40)
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'hanging')
        .attr('text-anchor', 'start')
        .attr('x', $('#l_win').width()/160)
        .attr('y', $('#l_win').width()*35/800)
        .attr('fill', light_on ? 'black' : 'white')
        .text('label num: ' + label_set.size);

    for (const p of data_points) p.draw_r = original_data_r;

    data_points.map(function (item){
        if(special_data_symbol == 0){
            item.color = color_scheme1[item.label%10];
        };
        if(special_data_symbol == 1){
            item.color = color_scheme2[item.label];
        };

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