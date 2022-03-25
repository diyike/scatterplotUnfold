// function Zone() {
//     this.next = null;
//     this.previous = null;
//     this.circle = null;
// }
//
// // 分为36个扇区
// const zone_num = 36;
// const zones = d3.range(zone_num).map(_ => new Zone());
// // 将zone前后相连
// for (const [i, zone] of zones.entries()) {
//     zone.next = zones[(i + 1) % zones.length];
//     zone.previous = zones[(i - 1 + zones.length) % zones.length];
// }

function place(a, b, c) {
    let dx = b.x - a.x, x, a2,
        dy = b.y - a.y, y, b2,
        d2 = dx * dx + dy * dy;
    if (d2) {
        a2 = a.r + c.r, a2 *= a2;
        b2 = b.r + c.r, b2 *= b2;
        if (a2 > b2) {
            x = (d2 + b2 - a2) / (2 * d2);
            y = sqrt(max(0, b2 / d2 - x * x));
            c.x = b.x - x * dx - y * dy;
            c.y = b.y - x * dy + y * dx;
        } else {
            x = (d2 + a2 - b2) / (2 * d2);
            y = sqrt(max(0, a2 / d2 - x * x));
            c.x = a.x + x * dx - y * dy;
            c.y = a.y + x * dy + y * dx;
        }
    } else {
        c.x = a.x + c.r;
        c.y = a.y;
    }
}

function intersects(a, b) {
    let dr = a.r + b.r - 1e-6, dx = b.x - a.x, dy = b.y - a.y;
    return dr > 0 && dr * dr > dx * dx + dy * dy;
}

// 计算从角度a顺时针转到角度b所需的角度
function angle_diff(a, b) {
    return a >= b ? a - b : a - b + PI * 2;
}

function packing(circles, [x, y], count=50) {
    function get_angle(c) {
        let angle = atan2(y - c.y, c.x - x);
        if (angle < 0) angle += 2 * PI;
        return angle;
    }

    // function get_zone(angle) {
    //     return zones[floor(angle / (PI * 2 / zone_num))];
    // }

    function Node(circle) {
        this._ = circle;
        this.next = null;
        this.previous = null;
        this.angle = get_angle(circle);
    }

    let a, b, c, i, j, k, sj, sk;

    // Place the first circle.
    a = circles[0];

    // Place the second circle.
    b = circles[1];
	
	//a.x = x - b.r;
	//b.x = a.x + a.r + b.r;
	a.x = x - a.r;
	b.x = x + b.r;
	b.y = a.y = y;

    // Place the third circle.
    place(b, a, c = circles[2]);

    // Initialize the front-chain using the first three circles a, b and c.
    a = new Node(a), b = new Node(b), c = new Node(c);
    a.next = c.previous = b;
    b.next = a.previous = c;
    c.next = b.previous = a;
    // get_zone(a.angle).circle = a;
    // get_zone(b.angle).circle = b;
    // get_zone(c.angle).circle = c;

    // Place each remaining circle
    pack: for (i = 3; i < circles.length - 1; i++) {
        place(a._, b._, c = circles[i]);
        c = new Node(c);

        j = b.next, k = a.previous, sj = b._.r, sk = a._.r;

        let num_j = 0;
        let num_k = 0;

        do {
            if(num_j > count) break;
            if(num_k > count) break;
            if (sj <= sk) {
                num_j += 1;
                if (intersects(j._, c._)) {
                    b = j, a.next = b, b.previous = a, --i;
                    continue pack;
                }
                sj += j._.r, j = j.next;
            } else {
                num_k += 1;
                if (intersects(k._, c._)) {
                    a = k, a.next = b, b.previous = a, --i;
                    continue pack;
                }
                sk += k._.r, k = k.previous;
            }
        } while (j !== k.next);

        // Success! Insert the new circle c between a and b.
        c.previous = a, c.next = b, a.next = b.previous = b = c;
        // c.angle = get_angle({x: c._.x, y: c._.y});
        //
        // get_zone(c.angle).circle = c;
        //
        // if (i % 10000 === 0) console.log(i / 10000);

        // // 整圆遍历
        // const target_angle = get_angle(circles[i + 1]);
        // let min_diff = 2 * PI;
        // const init_c = c;
        // while ((c = c.next) !== init_c) {
        //     let cur_diff = abs(c.angle - target_angle);
        //     if (cur_diff < min_diff) {
        //         min_diff = cur_diff;
        //         a = c;
        //     }
        // }
        // b = a.next;

        // 半圆遍历
        const init_c = c;
        const target_angle = get_angle(circles[i + 1]);
        const init_angle_diff = angle_diff(c.angle, target_angle);
        if (init_angle_diff >= PI) {
            while ((c = c.next) !== init_c) {
                const cur_angle_diff = angle_diff(c.angle, target_angle);
                if (cur_angle_diff < PI) {
                    // a = abs(c.angle - target_angle) < abs(c.next.angle - target_angle)? c: c.next;
                    a = c;
                    break;
                }
            }
        } else {
            while ((c = c.previous) !== init_c) {
                const cur_angle_diff = angle_diff(c.angle, target_angle);
                if (cur_angle_diff >= PI) {
                    // a = abs(c.angle - target_angle) < abs(c.previous.angle - target_angle)? c: c.previous;
                    a = c;
                    break;
                }
            }
        }

        b = a.next;

        // // 分桶遍历
        // const target_angle = get_angle(circles[i + 1]);
        // let init_zone = get_zone(target_angle);
        // let init_c = init_zone.circle == null ? get_zone(a.angle).circle: init_zone.circle;
        //
        // c = init_c;
        // const init_angle_diff = angle_diff(init_c.angle, target_angle);
        // let cur_angle_diff = 0;
        //
        // if (init_angle_diff >= PI) {
        //     while ((c = c.previous) !== init_c) {
        //         cur_angle_diff = angle_diff(c.angle, target_angle);
        //         if (cur_angle_diff < PI) {
        //             a = c;
        //             break;
        //         }
        //     }
        // } else {
        //     while ((c = c.next) !== init_c) {
        //         cur_angle_diff = angle_diff(c.angle, target_angle);
        //         if (cur_angle_diff >= PI) {
        //             a = c;
        //             break;
        //         }
        //     }
        // }
        // b = a.next;
    }
}
