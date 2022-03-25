function draw(points) {
    const board = document.getElementById('board');

    const {width, height} = board.getElementsByTagName('canvas')[0].getBoundingClientRect();

    function get_camera_z(zoom_level) {
        return height / (exp(zoom_level));
    }

    function toDegrees(angle) {
        return angle * (180 / PI);
    }

    function needed_fov(height, camera_z, scale) {
        const fov_height = height / scale
        const half_fov_radians = atan(fov_height / (2 * camera_z))
        const half_fov = toDegrees(half_fov_radians)
        return half_fov * 2;
    }

    function zoomEvent(zoom) {
        const scale = zoom.k;
        camera.position.x = -(zoom.x - width / 2) / scale;
        camera.position.y = (zoom.y - height / 2) / scale;
        camera.position.z = get_camera_z(log(scale));
        camera.fov = needed_fov(height, camera.position.z, scale);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }

    const zoomBehavior = d3.zoom()
        .scaleExtent([1 / 4, 64])
        .extent([[0, 0], [width, height]])
        .on('zoom', (event) => {
            zoomEvent(event.transform);
        });

    const camera = new THREE.PerspectiveCamera(90, width / height, 1, 100000);
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xffffff);
    //scene.background = new THREE.Color(0x000000);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas.node(), alpha: true});
    renderer.setSize(width, height);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setClearAlpha(0);

    const positions = new Float32Array(points.length * 3)
    const colors = new Float32Array(points.length * 3);
    const opacities = new Float32Array(points.length);
    const sizes = new Float32Array(points.length);
    const vertex = new THREE.Vector3();
    const color = new THREE.Color(0xffffff);

    for (const [i, p] of Object.entries(points)) {
        opacities[i] = original_data_t;
        sizes[i] = p.draw_r;
        vertex.x = p.x;
        vertex.y = height - p.y;
        vertex.z = 1;
        vertex.toArray(positions, i * 3);
        const c = d3.hsl(p.color);
        color.setHSL(c.h / 360, c.s, c.l);
        color.toArray(colors, i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const scale = window.devicePixelRatio;
    const material = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: {
                value: new THREE.TextureLoader().load("../static/pointTexture.png")
            }
        },
        vertexShader: document.getElementById('vertexShader').textContent.replace('1630.0', round(1630 * scale) + '.0'),
        fragmentShader: document.getElementById('fragmentShader').textContent,

        depthTest: false,
        transparent: true
    });

    const circles = new THREE.Points(geometry, material);
    scene.add(circles);

    const initial_scale = 1;

    let initial_transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initial_scale)
        .translate(-width / 2, height / 2)
    zoomBehavior.transform(canvas, initial_transform);
    canvas.call(zoomBehavior);

    // camera.position.x = -(0 - width / 2) / initial_scale;
    // camera.position.y = (800 - height / 2) / initial_scale;
    // camera.position.z = get_camera_z(log(initial_scale));
    // camera.fov = needed_fov(height, camera.position.z, initial_scale);
    // camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    renderer.render(scene, camera);
}