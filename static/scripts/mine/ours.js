function flower(n) {
    const radians = 0.017453292519943295;
    const theta = 137.508;
    const init = 0.5;
    const t = theta * radians, r = Math.sqrt(n + init) / 12;
    return [r * Math.sin(t * n), r * Math.cos(t * n)];
}

function preprocessing(data_points, num_th) {
    const format = d => d3.format(".1f")(d); // 保留一位小数
    const singularities = new Map();
    for (let [index, p] of Object.entries(data_points)) {
        index = parseInt(index);
        const key = format(p.x) + '_' + format(p.y);
        if (singularities.has(key)) {
            const points = singularities.get(key);
            points.push(index);
            singularities.set(key, points);
        } else {
            singularities.set(key, [index]);
        }
    }

    for (const [key, indexes] of singularities.entries()) {
        if (indexes.length >= num_th) {
            for (const [id, index] of Object.entries(indexes)) {
                const [x, y] = flower(id);
                data_points[index].x += x;
                data_points[index].y += y;
            }
        } else {
            singularities.delete(key);
        }
    }
    console.log('num of singularities: ', singularities.size);
}

function ours(data_points) {
    const column = ceil(canvas_width / size);
    const row = ceil(canvas_height / size);
    const s = size * size;

    preprocessing(data_points, 5);

    const x_scale = d3.scaleLinear()
        .domain([0, 800])
        .range([10, 790]);

    const y_scale = d3.scaleLinear()
        .domain([0, 800])
        .range([10, 790]);

    for (const p of data_points) {
        p.x = x_scale(p.x);
        p.y = y_scale(p.y);
    }

    const grids = [];
    for (const i of d3.range(row)) {
        for (const j of d3.range(column)) {
            const grid = [];
            grid.i = i;
            grid.j = j;
            grids.push(grid);
        }
    }

    for (const p of data_points) {
        const i = floor(p.y / size);
        const j = floor(p.x / size);
        grids[i * column + j].push(p);
    }

    const random = d3.randomUniform(0, size);
    max_grid_length = d3.max(grids, d => d.length);
    // console.log('max_grid_length', max_grid_length);
    // if (max_grid_length < k) console.log('ERROR!!!!!')
    const r = sqrt(s / PI / max_grid_length);

    const packing_points = [];
    for (const grid of grids) {
        const r = sqrt(s / PI / max(grid.length, k));
        const density = grid.length / max_grid_length; // 计算局部密度，取值范围是[0, 1]
        for (const p of grid) {
            const data_point = {
                id: p.id,
                x: p.x,
                y: p.y,
                r: r,
                label: p.label == undefined ? 1 : p.label,
                density: p.density,
                grid_density: density,
            };
            packing_points.push(data_point);
        }

        for (let i = 0; i < k - grid.length; i++) {
            const dummy_point = {
                x: grid.j * size + random(),
                y: grid.i * size + random(),
                r: r,
                label: -1
            }
            packing_points.push(dummy_point);
        }
    }

    const center = [canvas_width / 2, canvas_height / 2];
    for (const p of packing_points) {
        p.dis = distance([p.x, p.y], center);
    }

    packing_points.sort((a, b) => a.dis - b.dis);
    console.log('k:', k);
    console.log('size:', size);
    console.log('max_grid_length:', max_grid_length);
    console.log('num of grid:', grids.length);
    console.log('num of packing points:', packing_points.length);

    packing(packing_points, center);

    const final_points = packing_points.filter(d => d.label >= 0);

    return final_points;
};