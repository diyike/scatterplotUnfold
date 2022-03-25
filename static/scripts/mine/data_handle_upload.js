function data_handle_upload() {
    original_slider_control_disable();
    ours_slider_control_enable();

    let data_points = ours(uploaded_data);

    console.log(data_points);

    const vptree = VPTreeFactory.build(data_points, dis);
    for (const point of data_points) {
        const neighbors = vptree.search(point, 6);
        const density = 1 / d3.mean(neighbors.slice(1), p => p.d);
        point['grid_density'] = point['density'];
        point['density'] = density;
    }
    console.log(data_points);

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

    console.log('num of data points:', point_num);
    data_points.sort((a, b) => a['grid_density'] - b['grid_density']);
    const densities = data_points.map(d => d['grid_density']);

    const k_index = d3.bisectCenter(densities, k_density);
    const data_points0 = data_points.slice(0, k_index);
    const data_points1 = data_points.slice(k_index);
    const densities0 = data_points0.map(d => d['density']);

    for (const p of data_points) p.r *= (canvas_width - 20) / 780;
    const [min_r, max_r] = d3.extent(data_points, d => d.r);
    for (const p of data_points) p.draw_r = min_r;
    let cur_quantile = 1;
    let cur_density = 1;
    let cur_r = min_r;

    console.log(data_points[0])

    data_points.map(function (item){
        if(item.color == undefined){
            item.color = color_scheme1[item.label%10];
        }

        json_array.push({
            x: item['x'],
            y: item['y'],
            color: item['color'],
            r: item['draw_r']
        })
    })

    draw(data_points);
    console.log('min_r', min_r);
    console.log('max_r', max_r);

    const density_scale0 = d3.scaleLinear()
        .domain([0, d3.max(densities0)])
        .range([0, k_x]);
    const density_scale = d3.scaleLinear()
        .domain([k_density, 1])
        .range([k_x, curve_g_width]);
    const r_scale = d3.scaleLinear()
        .domain([0, max_r * 4])
        .range([curve_g_height, 0]);
    const min_r_y = r_scale(min_r);

    // min_r_text
    svg.append('text')
        .attr('id', 'min_r_text')
        .attr('font-size', '13px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'end')
        .attr('font-weight', 'bold')
        .attr('x', left_padding)
        .attr('y', min_r_y + top_padding)
        .attr('dx', -5)
        .text(d3.format(".2f")(min_r));

    const histogram_g = svg.append('g')
        .attr('id', 'histogram_g')
        .attr('transform', `translate(${left_padding}, ${top_padding})`);
    const histogram_g0 = svg.append('g')
        .attr('id', 'histogram_g0')
        .attr('transform', `translate(${left_padding}, ${top_padding})`);

    // density_axis_g
    svg.append('g')
        .attr('id', 'density_axis_g')
        .attr('transform', `translate(${left_padding}, ${curve_g_height + top_padding})`)
        .attr('class', 'axis')
        .call(d3.axisBottom(density_scale).ticks(10, ".1f"));

    // r_axis_g
    svg.append('g')
        .attr('id', 'r_axis_g')
        .attr('transform', `translate(${left_padding}, ${top_padding})`)
        .attr('class', 'axis')
        .call(d3.axisLeft(r_scale).ticks(10, ".2f"));

    const curve_g = svg.append('g')
        .attr('id', 'curve_g')
        .attr('transform', `translate(${left_padding}, ${top_padding})`);

    // update_button_rect
    svg.append('rect')
        .attr('id', 'update_button_rect')
        .attr('width', 100)
        .attr('height', 40)
        .attr('x', svg_width - right_padding - 110)
        .attr('y', curve_g_height - 725)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('fill', 'orange')
        .attr('stroke', '#888')
        .attr('stroke-width', 2)
        .on('mouseover', function () {
            d3.select(this)
                .attr('stroke', '#555')
                .attr('stroke-width', 3);
        })
        .on('mouseout', function () {
            d3.select(this)
                .attr('stroke', '#888')
                .attr('stroke-width', 3);
        })
        .on('click', function () {
            update_scatterplot();
        });

    svg.append('text')
        .attr('id', 'update_button_text')
        .attr('font-size', '18px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('x', svg_width - right_padding - 95 + 70 / 2)
        .attr('y', curve_g_height - 720 + 30 / 2)
        .text('update');

    // curve_g_bg_rect
    curve_g.append('rect')
        .attr('width', svg_width - left_padding - right_padding)
        .attr('height', svg_height - top_padding - bottom_padding)
        .attr('fill-opacity', 0)
        .attr('stroke', '#888');

    // histogram
    const bin_count = 100;
    const histogram = d3.histogram()
        .value(d => d['grid_density'])
        .domain([k_density, 1])
        .thresholds(d3.ticks(k_density, 1, bin_count));
    const bins = histogram(data_points1);

    const h_y_scale = d3.scaleLinear()
        .domain([0, d3.max(bins.map(x => x.length))])
        .range([0, curve_g_height * 0.95]);

    histogram_g.selectAll("rect").data(bins)
        .enter()
        .append("rect")
        .attr('class', 'histogram_rect')
        .attr("fill", "#69b3a2")
        .attr('id', (d, i) => 'rect_' + i)
        .attr('x', d => density_scale(d.x0))
        .attr('y', d => curve_g_height - h_y_scale(d.length))
        .attr("height", d => h_y_scale(d.length))
        .attr("width", d => Math.max(density_scale(d.x1) - density_scale(d.x0) - 1, 0));

    // histogram0
    const bin_count0 = 10;
    const histogram0 = d3.histogram()
        .value(d => d['density'])
        .domain([0, d3.max(densities0)])
        .thresholds(d3.ticks(0, d3.max(densities0), bin_count0));
    const bins0 = histogram0(data_points0);

    histogram_g0.selectAll("rect").data(bins0)
        .enter()
        .append("rect")
        .attr('class', 'histogram_rect')
        .attr("fill", "#69b3a2")
        .attr('id', (d, i) => 'rect_' + i)
        .attr('x', d => density_scale0(d.x0))
        .attr('y', d => curve_g_height - h_y_scale(d.length))
        .attr("height", d => h_y_scale(d.length))
        .attr("width", d => Math.max(density_scale0(d.x1) - density_scale0(d.x0) - 1, 0));

    const density2pack_r = new Map();
    for (const p of data_points1) {
        density2pack_r.set(p['grid_density'], p.r);
    }
    const pack_r_points = [...density2pack_r].sort().map(d => ([density_scale(d[0]), r_scale(d[1])]));

    // min_r_line
    curve_g.append('path')
        .attr('id', 'min_r_line')
        .attr('stroke', '#888')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', ("5, 3"))
        .attr('d', line([[0, min_r_y], [curve_g_width, min_r_y]]));
    const quantile_line = curve_g.append('path')
        .attr('id', 'quantile_line')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', ("5, 3"))
        .attr('d', line([[curve_g_width, 0], [curve_g_width, svg_height]]));
    const quantile_text = curve_g.append('text')
        .attr('id', 'quantile_text')
        .attr('font-size', '13px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'hanging')
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .attr('x', curve_g_width)
        .attr('y', 15)
        .attr('dx', 5)
        .text('quantile=' + cur_quantile);

    // k_line
    curve_g.append('path')
        .attr('id', 'k_line')
        .attr('stroke', '#888')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', ("7, 3"))
        .attr('d', line([[k_x, 0], [k_x, curve_g_height]]));

    const pack_r_curve = curve_g.append('path')
        .attr('id', 'pack_r_curve')
        .attr('d', line(pack_r_points))
        .attr('fill', 'none')
        .attr('stroke', '#c00000')
        .attr('stroke-width', 4);
    const draw_r_curve1 = curve_g.append('path')
        .attr('id', 'draw_r_curve1')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
    const draw_r_curve2 = curve_g.append('path')
        .attr('id', 'draw_r_curve2')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)

    const x2y = solve(pack_r_curve.node());
    const k_y = x2y(k_x);
    // const y2x = solve2(pack_r_curve.node());

    let hd_control_point_x = curve_g_width;
    let hd_control_point_y = min_r_y;

    const density_preservation_zone = curve_g.append('rect')
        .attr('id', 'density_preservation_zone')
        .attr('width', curve_g_width)
        .attr('height', 40)
        .attr('x', 0)
        .attr('y', curve_g_height)
        .attr('fill', '#70ad47')
        .attr('fill-opacity', 0.4)
        .attr('stroke', '#507e32');
    const tangent_zone = curve_g.append('rect')
        .attr('id', 'tangent_zone')
        .attr('width', 0)
        .attr('height', 40)
        .attr('x', curve_g_width)
        .attr('y', curve_g_height)
        .attr('fill', '#ed7d31')
        .attr('fill-opacity', 0.4)
        .attr('stroke', '#ae5a21');
    const density_zone_text = curve_g.append('text')
        .attr('id', 'density_zone_text')
        .attr('font-size', '13px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('x', curve_g_width / 2)
        .attr('y', curve_g_height + 20 + 10)
        .text('100%');
    const tangent_zone_text = curve_g.append('text')
        .attr('id', 'tangent_zone_text')
        .attr('font-size', '13px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('x', curve_g_width)
        .attr('y', curve_g_height + 20 + 10)
        .text('');

    function update_draw_r_curve() {
        const draw_curve_points1 = [[0, ld_control_point_y], [ld_control_point_x, ld_control_point_y],
            [ld_control_point_x, hd_control_point_y], [hd_control_point_x, hd_control_point_y]];
        draw_r_curve1.attr('d', line(draw_curve_points1));
        const draw_curve_points2 = [[hd_control_point_x, hd_control_point_y], ...pack_r_points.filter(p => p[0] >= hd_control_point_x)];
        draw_r_curve2.attr('d', line(draw_curve_points2));
    }

    function update_scatterplot() {
        console.log('update');

        const density_th1 = ld_control_point_x < k_x ? density_scale0.invert(ld_control_point_x) : density_scale.invert(ld_control_point_x);
        const density_th2 = density_scale.invert(hd_control_point_x);
        const r1 = r_scale.invert(ld_control_point_y);
        const r2 = r_scale.invert(hd_control_point_y);
        values = {
            'density_th1': my_round(density_th1, 4),
            'density_th2': my_round(density_th2, 4),
            'k_density': my_round(k_density, 4),
            'r1': my_round(r1, 4),
            'r2': my_round(r2, 4)
        }

        if (ld_control_point_x < k_x) {
            for (const p of data_points) {
                if (p['density'] <= density_th1) {
                    p.draw_r = r1;
                } else if (p['grid_density'] <= density_th2) {
                    p.draw_r = r2;
                } else {
                    p.draw_r = p.r;
                }
            }
        } else {
            for (const p of data_points) {
                if (p['grid_density'] <= density_th1) {
                    p.draw_r = r1;
                } else if (p['grid_density'] <= density_th2) {
                    p.draw_r = r2;
                } else {
                    p.draw_r = p.r;
                }
            }
        }
        json_array.length = 0;

        data_points.map(function (item){
            json_array.push({
                x: item['x'],
                y: item['y'],
                color: item['color'],
                r: item['draw_r']
            })
        })

        draw(data_points);
    }

    //json save event
    json_text.on('click',function(){
        let content = JSON.stringify(json_array);
        let fileName = has_upload == 1 ? "Ours.json" : algorithm+".json"
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName);
    })

    const ld_feasible_zone = curve_g
        .append('path')
        .attr('id', 'ld_feasible_zone')
        .attr('fill', '#888')
        .attr('opacity', 0);

    const hd_control_point_drag = d3.drag()
        .on("start", hd_control_point_drag_start)
        .on("drag", hd_control_point_drag_move)
        .on("end", hd_control_point_drag_end);

    function density2quantile(density) {
        return d3.bisectCenter(densities, density) / point_num;
    }

    function density2quantile0(density) {
        return d3.bisectCenter(densities0, density) / point_num;
    }

    function hd_control_point_drag_start() {
        d3.select(this).attr('stroke-width', 2);
    }

    function hd_control_point_drag_move(event) {
        const cur_x = Math.min(Math.max(k_x, event.x), curve_g_width);
        const cur_y = x2y(cur_x);
        hd_control_point_x = cur_x;
        hd_control_point_y = cur_y;
        d3.select(this)
            .attr('cx', cur_x)
            .attr('cy', cur_y);
        cur_density = density_scale.invert(cur_x);
        cur_quantile = density2quantile(cur_density);
        cur_r = r_scale.invert(cur_y);

        quantile_line.attr('d', line([[cur_x, 0], [cur_x, curve_g_height]]));
        quantile_text
            .attr('x', cur_x)
            .text('quantile=' + format(cur_quantile));
        density_preservation_zone
            .attr('x', ld_control_point_x)
            .attr('width', hd_control_point_x - ld_control_point_x);
        const text = ld_control_point_x > k_x ? percentage_format(cur_quantile - density2quantile(density_scale.invert(ld_control_point_x)))
            : percentage_format(cur_quantile - density2quantile0(density_scale0.invert(ld_control_point_x)));
        density_zone_text
            .attr('x', (ld_control_point_x + hd_control_point_x) / 2)
            .text(text);

        tangent_zone
            .attr('x', cur_x)
            .attr('width', curve_g_width - cur_x);
        tangent_zone_text
            .attr('x', (cur_x + curve_g_width) / 2)
            .text(percentage_format(1 - cur_quantile));
        if (ld_control_point_y > cur_y) {
            ld_control_point.attr('cy', cur_y);
            ld_control_point_y = cur_y;
        }
        update_draw_r_curve();
    }

    function hd_control_point_drag_end() {
        d3.select(this).attr('stroke-width', 1);
        hd_control_point.select('title').remove();
        hd_control_point.append('title').text(format_hd_text(cur_quantile, cur_density, cur_r));
    }

    const format_hd_text = (quantile, density, r) =>
        `quantile: ${format(quantile)} \ndensity: ${format(density)} \nr: ${format(r)}`;
    const hd_control_point = curve_g.append('circle')
        .attr('id', 'hd_control_point')
        .attr('cx', hd_control_point_x)
        .attr('cy', hd_control_point_y)
        .attr('r', 6)
        .attr('fill', 'red')
        .attr('stroke', 'black');
    hd_control_point.append('title')
        .text(format_hd_text(cur_quantile, cur_density, min_r));
    hd_control_point.call(hd_control_point_drag);


    function ld_control_point_drag_start() {
        d3.select(this).attr('stroke-width', 2);
    }

    function ld_control_point_drag_move(event) {
        let cur_x, cur_y;
        if (event.x <= k_x) {
            cur_x = Math.max(event.x, 0);
            cur_y = Math.min(Math.max(0, event.y), hd_control_point_y);
        } else if (event.y < k_y) {
            cur_x = k_x;
            cur_y = Math.max(event.y, 0);
        } else if (event.y < x2y(event.x)) {
            const min_index = d3.minIndex(pack_r_points.filter(d => d[0] < hd_control_point_x),
                d => distance_sqrt([event.x, event.y], d));
            [cur_x, cur_y] = pack_r_points[min_index];
        } else {
            [cur_x, cur_y] = [Math.min(event.x, hd_control_point_x), Math.min(event.y, hd_control_point_y)];
        }

        d3.select(this)
            .attr('cx', cur_x)
            .attr('cy', cur_y);
        ld_r_text
            .attr('y', ld_control_point_y)
            .text(d3.format(".2f")(r_scale.invert(ld_control_point_y)));
        ld_control_point_x = cur_x;
        ld_control_point_y = cur_y;

        density_preservation_zone
            .attr('x', ld_control_point_x)
            .attr('width', hd_control_point_x - ld_control_point_x);
        const text = ld_control_point_x > k_x ? percentage_format(cur_quantile - density2quantile(density_scale.invert(ld_control_point_x)))
            : percentage_format(cur_quantile - density2quantile0(density_scale0.invert(ld_control_point_x)));
        density_zone_text
            .attr('x', (ld_control_point_x + hd_control_point_x) / 2)
            .text(text)

        update_draw_r_curve();

        ld_feasible_zone
            .attr('d', line([
                [0, 0], [0, hd_control_point_y], [hd_control_point_x, hd_control_point_y],
                ...pack_r_points.filter(p => p[0] <= hd_control_point_x).reverse(),
                [k_x, k_y],
                [k_x, 0],
                [0, 0]
            ]))
            .attr('opacity', 0.3);
    }

    function ld_control_point_drag_end() {
        d3.select(this).attr('stroke-width', 1);
        ld_feasible_zone.attr('opacity', 0);
    }

    const ld_control_point_drag = d3.drag()
        .on("start", ld_control_point_drag_start)
        .on("drag", ld_control_point_drag_move)
        .on("end", ld_control_point_drag_end);

    let ld_control_point_x = 0;
    let ld_control_point_y = min_r_y;
    const ld_control_point = curve_g.append('circle')
        .attr('id', 'ld_control_point')
        .attr('cx', ld_control_point_x)
        .attr('cy', ld_control_point_y)
        .attr('r', 6)
        .attr('fill', 'red')
        .attr('stroke', 'black');
    ld_control_point.call(ld_control_point_drag);

    // k_text
    curve_g.append('text')
        .attr('id', 'k_text')
        .attr('font-size', '13px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'hanging')
        .attr('text-anchor', 'end')
        .attr('font-weight', 'bold')
        .attr('x', k_x - 12)
        .attr('y', 15)
        .attr('dx', 5)
        .text('k=' + k);

    const ld_r_text = curve_g
        .append('text')
        .attr('id', 'ld_r_text')
        .attr('font-size', '13px')
        .attr('font-family', 'helvetica')
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'end')
        .attr('font-weight', 'bold')
        .attr('x', 0)
        .attr('y', min_r_y)
        .attr('dx', -5)
        .text(d3.format(".2f")(min_r));
}