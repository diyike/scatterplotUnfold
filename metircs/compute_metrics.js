function union(setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function intersection(setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

// delete singularities
function preprocessing_k(init_points, packed_points) {
    const format = d => d3.format(".1f")(d);
    const singularities = new Set();
    for (let i = 0; i < init_points.length; i++) {
        const key = format(init_points[i].x) + '_' + format(init_points[i].y);
        if (singularities.has(key)) {
            init_points.splice(i, 1);
            packed_points.splice(i, 1);
            i--;
        } else {
            singularities.add(key);
        }
    }
}

// kendallsTau Rank calculating
function kendallsTau(a, b) {
    let similarity = 0;
    let counter = 0;
    let aux = [];

    // merge_sort -- separate
    function mergeSort(a, lo, hi) {
        if (hi <= lo) return;
        let mid = floor(lo + (hi - lo) / 2);
        mergeSort(a, lo, mid);
        mergeSort(a, mid + 1, hi);
        merge(a, lo, mid, hi);
    }

    // merge_sort -- merge
    function merge(a, lo, mid, hi) {
        let i = lo, j = mid + 1;
        for (let k = lo; k <= hi; k++)
            aux[k] = a[k];
        for (let k = lo; k <= hi; k++) {
            if (i > mid)
                a[k] = aux[j++];
            else if (j > hi)
                a[k] = aux[i++];
            else if (aux[j] < aux[i]) {
                a[k] = aux[j++];
                counter += mid - i + 1;
            } else
                a[k] = aux[i++];
        }
    }

    // b_list reindex using a_list's order
    let N = a.length;
    let aIndex = [], bIndex = [];
    for (let i = 0; i < N; i++)
        aIndex[a[i]] = i;
    for (let i = 0; i < N; i++)
        bIndex[i] = aIndex[b[i]];

    mergeSort(bIndex, 0, N - 1);
    let cNum = (N * (N - 1)) / 2;
    similarity = (cNum - 2 * counter) / cNum;
    return similarity;
}

function k_neighbors(k, init_points, packed_points) {
    const vpTree = VPTreeFactory.build(init_points, dis);
    const vpTree_p = VPTreeFactory.build(packed_points, dis);
    const id2value = new Map();
    for (const [init_p, packed_p] of zip(init_points, packed_points)) {
        const init_neighbors = vpTree.search(init_p, k + 1);
        const init_set = new Set(init_neighbors.slice(1).map(p => init_points[p.i].id));

        const packed_neighbors = vpTree_p.search(packed_p, k + 1);
        const packed_set = new Set(packed_neighbors.slice(1).map(p => packed_points[p.i].id));
        const similarity = intersection(init_set, packed_set).size / k;
        id2value.set(init_p.id, similarity);
    }
    return {'k_neighbors': format_2(d3.mean(id2value.values()))};
}

function density(k, init_points, packed_points) {
    const init_vpTree = VPTreeFactory.build(init_points, dis);
    for (const init_p of init_points) {
        const init_neighbors = init_vpTree.search(init_p, k + 1);
        init_p.avg_dis = d3.mean(init_neighbors.slice(1), p => {
            return dis(init_points[p.i], init_p)
        });
    }
    init_points.sort((a, b) => a.avg_dis - b.avg_dis);

    const packed_vpTree = VPTreeFactory.build(packed_points, dis);
    for (const packed_p of packed_points) {
        const packed_neighbors = packed_vpTree.search(packed_p, k + 1);
        packed_p.avg_dis = d3.mean(packed_neighbors.slice(1), p => {
            return dis(packed_points[p.i], packed_p)
        });
    }
    packed_points.sort((a, b) => a.avg_dis - b.avg_dis);

    // calculate quantiles
    const id2value = new Map();
    let i = 1;
    const N = init_points.length;
    for (const [init_p, packed_p] of zip(init_points, packed_points)) {
        init_p.quantile = i / N;
        packed_p.quantile = i / N;
        i++;
    }
    init_points.sort((a, b) => a.id - b.id);
    packed_points.sort((a, b) => a.id - b.id);

    for (const [init_p, packed_p] of zip(init_points, packed_points)) {
        id2value.set(init_p.id, format_2(abs(init_p.quantile - packed_p.quantile)));
    }
    return {'density': format_2(d3.mean(id2value.values()))};
}

function shape(dis_th, init_points, packed_points) {
    // calculate mass_centre
    let mass_centre = {};
    mass_centre.x = d3.mean(init_points, point => point.x);
    mass_centre.y = d3.mean(init_points, point => point.y);

    const m = 10, n = 36;
    const init_vpTree = VPTreeFactory.build(init_points, dis);
    const center = init_points[init_vpTree.search(mass_centre)[0].i]
    const center_p = packed_points[init_vpTree.search(mass_centre)[0].i];
    const max_r = d3.max(init_points, point => {
        return dis(point, center)
    });

    const deviations = [];
    for (let r = max_r / m; r <= max_r; r += max_r / m) {
        const distances = [];
        for (let angle = 0; angle < 2 * PI; angle += 2 * PI / n) {
            const p = {};
            p.x = center.x + Math.cos(angle) * r;
            p.y = center.y - Math.sin(angle) * r;
            // calculate nearest point from p
            const nearest_point = init_points[init_vpTree.search(p)[0].i];
            const nearest_point_P = packed_points[init_vpTree.search(p)[0].i];
            if (dis(nearest_point, p) <= dis_th) {
                distances.push(dis(center_p, nearest_point_P));
            }
        }
        deviations.push(d3.deviation(distances));
    }
    return {'shape': format_2(d3.mean(deviations))};

}

function displacement(init_points, packed_points) {
    const id2displacement = new Map();

    // calculate (left, right, up, down) bounding of padding
    function getBoundary(nodes) {
        let results = [];
        results.push(d3.min(nodes, d => d.x));
        results.push(d3.max(nodes, d => d.x));
        results.push(d3.min(nodes, d => d.y));
        results.push(d3.max(nodes, d => d.y));
        return results;
    }

    let initialRes = getBoundary(init_points);
    let packedRes = getBoundary(packed_points);

    // calculate scale_ratio between initial's padding and packed 's
    let scale = sqrt((initialRes[1] - initialRes[0]) * (initialRes[3] - initialRes[2]) / (packedRes[1] - packedRes[0]) / (packedRes[3] - packedRes[2]));
    // make packed_padding's size same as initial, then calculate the shift
    let newCenterX = scale * (packedRes[1] + packedRes[0]) / 2;
    let newCenterY = scale * (packedRes[3] + packedRes[2]) / 2;
    let shiftX = (initialRes[1] + initialRes[0]) / 2 - newCenterX;
    let shiftY = (initialRes[3] + initialRes[2]) / 2 - newCenterY;

    for (let i = 0; i < packed_points.length; i++) {
        const new_point = {};
        new_point.x = packed_points[i].x * scale + shiftX;
        new_point.y = packed_points[i].y * scale + shiftY;
        id2displacement.set(packed_points[i].id, format_2(dis(new_point, init_points[i])));
    }
    return {'displacement': format_2(d3.mean(id2displacement.values()))};
}

function overall(init_points, packed_points) {
    init_points.sort((a, b) => a.id - b.id);
    packed_points.sort((a, b) => a.id - b.id);

    const posts_array = [];
    let py_similarities;
    for (const angle of d3.range(0, PI, PI / 36)) {
        const init_ordered_array = [];
        const packed_ordered_array = [];

        // Record intersection's x_coordinate(y_coordinate if angle is PI/2)
        const init_x0_array = [];
        const packed_x0_array = [];
        const k = (angle !== PI / 2) ? tan(angle) : null;
        for (const [init_p, packed_p] of zip(init_points, packed_points)) { // init_points投影在轴上
            init_p.x0 = (angle !== PI / 2) ? (k * init_p.y + init_p.x) / (pow(k, 2) + 1) : init_p.y;
            init_x0_array.push(init_p.x0);
            packed_p.x0 = (angle !== PI / 2) ? (k * packed_p.y + packed_p.x) / (pow(k, 2) + 1) : packed_p.y;
            packed_x0_array.push(packed_p.x0);
        }
        init_x0_array.sort(((a, b) => a - b));
        packed_x0_array.sort(((a, b) => a - b));

        // search locations to index
        for (const [init_p, packed_p] of zip(init_points, packed_points)) {
            init_ordered_array.push(d3.bisectCenter(init_x0_array, init_p.x0));
            packed_ordered_array.push(d3.bisectCenter(packed_x0_array, packed_p.x0));
        }
        // calculate similarities
        posts_array.push(kendallsTau(init_ordered_array, packed_ordered_array));
    }

    py_similarities = format_2(d3.mean(posts_array));
    return {'overall': py_similarities};
}

function overlap(packed_points) {
    const id2value = new Map();
    let overlap_value = [];
    for (const packedPoint of packed_points) {
        packedPoint.r = packedPoint.width / 2;
    }

    const pointArea = PI * pow(packed_points[0].r, 2);

    for (const packed_p of packed_points) {
        for (const packedPoint of packed_points) {
            if (packedPoint.id === packed_p.id) continue;
            if (dis(packed_p, packedPoint) < packedPoint.r + packed_p.r) {
                overlap_value.push(area(packed_p, packedPoint) / pointArea);
                id2value.set(packedPoint.id + '_' + packed_p.id, format_2(area(packed_p, packedPoint) / pointArea));
            }
        }
    }

    const overlap = format_2(d3.sum(overlap_value) / packed_points.length / (packed_points.length - 1));
    if (overlap_value.length === 0)
        return {'overlap': 0};
    return {'overlap': overlap};
}

function metrics(init_points, packed_points, k) {
    const all_results = [];

    // reorder by id
    init_points.sort((a, b) => a.id - b.id);
    packed_points.sort((a, b) => a.id - b.id);
    preprocessing_k(init_points, packed_points);

    all_results.push(k_neighbors(k, init_points, packed_points));
    all_results.push(density(k, init_points, packed_points));
    all_results.push(displacement(init_points, packed_points));
    all_results.push(overlap(packed_points));
    all_results.push(shape(10, init_points, packed_points));
    all_results.push(overall(init_points, packed_points));

    return all_results;
}