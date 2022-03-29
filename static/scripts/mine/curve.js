const div_height = 900, preview_width = 900, editor_width = 900, padding = 30, padding2 = 20;
const div_width = preview_width + editor_width + padding2;
const select_div_height = 40;

const _svg_width = 800;
const _svg_height = 800;
const _left_padding = 50;
const _right_padding = 15;
const _bottom_padding = 45;
const _top_padding = 10;
const _curve_g_height = _svg_height - _bottom_padding - _top_padding;
const _curve_g_width = _svg_width - _left_padding - _right_padding;
const _k_x = 100;
const canvas_width = 800;
const canvas_height = 800;

//mapping of labels and colors
const color_scheme1 = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",
    "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
    "#bcbd22", "#17becf"
];

const color_scheme2 = {
    0: '#cfe1f2', 1: '#a5cce4', 2: '#6daed5', 3: '#3c8bc3',
    4: '#1864aa', 5: '#d3eecd', 6: '#c4e8be', 7: '#b5e1ae',
    8: '#a4da9e', 9: '#91d18e', 10: '#7dc87f', 11: '#68be72',
    12: '#54b366', 13: '#41a75b', 14: '#319a50', 15: '#238c46',
    16: '#157f3b', 17: '#fdd8b3', 18: '#fb8d3d', 19: '#c44103',
    20: '#e2e1ef', 21: '#c9c9e2', 22: '#acabd2', 23: '#908cc1',
    24: '#7769b0', 25: '#61409b', 26: '#fee5d9', 27: '#fcbba1',
    28: '#fc9272', 29: '#fb6a4a', 30: '#ef3b2c', 31: '#cb181d',
    32: '#99000d', 33: '#cccccc'
};

const algorithms2type = {
    'Original': 0,
    'HaGrid': 1,
    'DGrid': 2,
    'Ours(adjusted r)': 3,
    'Ours(adjustable)': 4
}

const data_name2type = {
    '2008_cancelled_flights': 0,
    'Abalone': 1,
    'Avila': 2,
    'Barcelona_accident': 3,
    'Basketball': 4,
    'BeijingPM2.5': 5,
    'BlackFriday': 6,
    'Chicago_crimes': 7,
    'Clothes': 8,
    'Condition_based_maintenance': 9,
    'Copter': 10,
    'COVID-19_deaths': 11,
    'Credit_card_fraud': 12,
    'Crowd_sourced_mapping': 13,
    'CS_rankings': 14,
    'Cup98LRN': 15,
    'Daily_sports': 16,
    'DBLP_samples': 17,
    'Dc_census_citizens': 18,
    'Diamonds': 19,
    'Epileptic_seizure': 20,
    'Forest_covertype': 21,
    'GaAsH6': 22,
    'Gas_sensor_array_drift': 23,
    'Gesture_phase': 24,
    'GNFUV': 25,
    'Google_playstore_sentiment': 26,
    'Grammatical_facial_expression': 27,
    'GridGena': 28,
    'Hathi_trust_library': 29,
    'HT_sensor': 30,
    'Human_activity_recognition': 31,
    'Manhattan': 32,
    'Mnist_tsne': 33,
    'MoCap': 34,
    'Music': 35,
    'News': 36,
    'News_aggregator': 37,
    'News_popularity': 38,
    'Nomao': 39,
    'Paleontology': 40,
    'Person_activity': 41,
    'Phyllotaxis': 42,
    'Satimage': 43,
    'Sensorless_drive_diagnosis': 44,
    'Swiss_roll_2d': 45,
    'Swiss_roll_3d': 46,
    'Telescope': 47,
    'Terrorism': 48,
    'Wine': 49
};

const data_name2values = {
    '2008_cancelled_flights': [3, 3, 386],
    'Abalone': [3, 5, 7],
    'Avila': [3, 5, 13],
    'Barcelona_accident': [3, 4, 33],
    'Basketball': [3, 5, 33],
    'BeijingPM2.5': [3, 1, 43],
    'BlackFriday': [3, 2, 117],
    'Chicago_crimes': [3, 2, 156],
    'Clothes': [3, 5, 22],
    'Condition_based_maintenance': [3, 5, 8],
    'Copter': [3, 5, 52],
    'COVID-19_deaths': [3, 1, 42],
    'Credit_card_fraud': [3, 1, 78],
    'Crowd_sourced_mapping': [3, 5, 13],
    'CS_rankings': [3, 5, 49],
    'Cup98LRN': [3, 2, 134],
    'Daily_sports': [3, 5, 6681],
    'DBLP_samples': [3, 2, 184],
    'Dc_census_citizens': [3, 2, 196],
    'Diamonds': [3, 1, 30],
    'Epileptic_seizure': [3, 5, 7],
    'Forest_covertype': [3, 1, 93],
    'GaAsH6': [3, 5, 454],
    'Gas_sensor_array_drift': [3, 5, 91],
    'Gesture_phase': [3, 4, 38],
    'GNFUV': [3, 2, 22],
    'Google_playstore_sentiment': [3, 4, 92],
    'Grammatical_facial_expression': [3, 4, 37],
    'GridGena': [3, 5, 18],
    'Hathi_trust_library': [3, 2, 1015],
    'HT_sensor': [3, 2, 791],
    'Human_activity_recognition': [3, 1, 525],
    'Manhattan': [3, 5, 8],
    'Mnist_tsne': [3, 5, 29],
    'MoCap': [3, 3, 133],
    'Music': [3, 5, 17],
    'News': [3, 5, 16],
    'News_aggregator': [3, 2, 500],
    'News_popularity': [3, 1, 60],
    'Nomao': [3, 2, 47],
    'Paleontology': [3, 5, 50],
    'Person_activity': [3, 5, 215],
    'Phyllotaxis': [3, 2, 1],
    'Satimage': [3, 5, 7],
    'Sensorless_drive_diagnosis': [3, 5, 77],
    'Swiss_roll_2d': [3, 5, 9],
    'Swiss_roll_3d': [3, 5, 10],
    'Telescope': [3, 3, 15],
    'Terrorism': [3, 2, 812],
    'Wine': [5, 1, 18]
};

const fileTypes = [
    'application/json'
];

let data_name = 'CS_rankings';
let algorithm = 'Ours(adjustable)';
let [k, size, max_grid_length] = data_name2values[data_name];
console.log('data_name:', data_name);
console.log('k:', k);
console.log('size:', size);
console.log('max_grid_length:', max_grid_length);

let k_density = k / max_grid_length;
const format = d => d3.format(".3f")(d);
const percentage_format = d3.format(".1%");
const line = d3.line();
let values;
let json_array = [];
let uploaded_data;
let file_path;
let has_upload = 0;
let special_data_symbol = 0;  //CS_rankings   DBLP_samples
let original_data_r = 1;      //radius
let original_data_t = 1;      //transparency
let original_data_s = 1;      //sampling rate
let k_change = 0;
let size_change = 0;

if (data_name == "CS_rankings" || data_name == "DBLP_samples") special_data_symbol = 1;

$(window).resize( function (){
    location.reload()
});

const board = d3.select('body')
    .append('div')
    .attr('id', 'board')
    .style('width', '100%')
    .style('border', '6px solid #66CDAA')
    .style('border-radius', '2%')
    .style('padding', '20px')
    .style('background-color', '#fafffa')

const title = board
    .append('div')
    .attr('id', 'title_div')
    .style('height', $('#title_div').width() * 200/1192+ 'px')
    .style('margin', '20px')
    .style('margin-bottom', '60px')
    .style('border', '10px dashed #2E8B57')
    .style('background-color', 'white')
    .style('border-radius', '2%')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .html('scatterplotUnfold')
    .style('font-size', $('#title_div').width() * 60/1192+ 'px')
    .style('font-weight', 'bold')

const select_div = board
    .append('div')
    .attr('id', 'select_div')
    .style('display', 'flex')
    .style('width', '100%')
    .style('margin-bottom', '40px')
    .style('height', $('#select_div').width() * select_div_height/1200 + 'px');


//DataSets choose
const data_choose_input_div = select_div.append('div')
    .attr('id', 'data_choose_input_div')
    .attr('class', 'dropdown show');

data_choose_input_div.append('text')
    .text('Dataset: ')
    .style('font-size', $('#select_div').width()*20/1800 + 'px')

data_choose_input_div.append('button')
    .attr('class', 'btn btn-secondary dropdown-toggle')
    .attr('type', 'button')
    .attr('id', 'data_dropdownMenuButton')
    .attr('data-toggle', 'dropdown')
    .attr('aria-haspopup', 'true')
    .attr('aria-expanded', 'false')
    .style('text-align', 'center')
    .style('width', $('#select_div').width()*360/1800 + 'px')
    //.style('height', $('#select_div').width()*36/1400 + 'px')
    .html(data_name)
    .style('font-size', $('#select_div').width()*13/1800 + 'px');

data_choose_input_div.append('div')
    .attr('class', 'dropdown-menu')
    .attr('aria-labelledby', 'data_dropdownMenuButton')
    .selectAll('a')
    .data(Object.keys(data_name2type)).enter()
    .append('a')
    .attr('class', 'dropdown-item')
    .attr('href', '#')
    .html((d, i) => Object.keys(data_name2type)[i]);

//Bind update event
$('a.dropdown-item').on('click', function () {
    const cur_data_name = $(this).text();
    $('#data_dropdownMenuButton').html(cur_data_name);
    if (cur_data_name !== data_name) {
        data_name = cur_data_name;
        if (data_name == "CS_rankings" || data_name == "DBLP_samples") special_data_symbol = 1;
        else special_data_symbol = 0;
        has_upload = 0;
        k_change = 0;
        size_change = 0;
        max_grid_length = data_name2values[data_name][2];

        $("#name_preview").html('No files is uploaded');

        //initialize sliders
        initialize_slider_value();

        update_plot();
    }
});

//Algorithms choose
const algor_choose_input_div = select_div.append('div')
    .attr('id', 'algor_choose_input_div')
    .attr('class', 'dropdown show')
    .style('margin-left', $('#select_div').width()*20/1800 + 'px');

algor_choose_input_div.append('text')
    .text('Algorithm: ')
    .style('font-size', $('#select_div').width()*20/1800 + 'px');

algor_choose_input_div.append('button')
    .attr('class', 'btn btn-secondary dropdown-toggle')
    .attr('type', 'button')
    .attr('id', 'algor_dropdownMenuButton')
    .attr('data-toggle', 'dropdown')
    .attr('aria-haspopup', 'true')
    .attr('aria-expanded', 'false')
    .style('width', $('#select_div').width()*240/1800 + 'px')
    //.style('height', $('#select_div').width()*36/1400 + 'px')
    .html(algorithm)
    .style('font-size', $('#select_div').width()*13/1800 + 'px');;

algor_choose_input_div.append('div')
    .attr('class', 'dropdown-menu')
    .attr('aria-labelledby', 'algor_dropdownMenuButton')
    .selectAll('b')
    .data(Object.keys(algorithms2type)).enter()
    .append('b')
    .attr('class', 'dropdown-item')
    .attr('href', '#')
    .html((d, i) => Object.keys(algorithms2type)[i]);

//Bind update event
$('b.dropdown-item').on('click', function () {
    const cur_algor = $(this).text();
    $('#algor_dropdownMenuButton').html(cur_algor);
    if (cur_algor !== algorithm) {
        algorithm = cur_algor;
        console.log(algorithm);
        has_upload = 0;
        k_change = 0;
        size_change = 0;

        $("#name_preview").html('No files is uploaded');

        initialize_slider_value();

        update_plot();
    }
});

//upload file
const file_upload = select_div.append('div')
    .attr('id', 'file_upload_div')
    .attr('class', 'dropdown show')
    .style('margin-left', $('#select_div').width()*65/1800 + 'px')
    .style('display', 'flex')

const file_upload_div = file_upload.append('form')
    .append('div')

file_upload_div.append('label')
    .attr('for', 'file-upload')
    .style('cursor', 'pointer')
    .style('background-color', '#d1fff3')
    .style('border', '4px solid #7fe7cd')
    .style('border-radius', '4%')
    .style('padding', '4px 10px')
    .html('upload json file')
    .style('font-size', $('#select_div').width()*10/1800 + 'px')
    .style('font-weight', 'bold')

file_upload_div.append('input')
    .attr('type', 'file')
    .attr('accept', '.json')
    .attr('id', 'file-upload')
    .attr('name', 'file-upload')
    .attr('value', 'upload file')
    .style('display', 'none')

$("form label").hover(
    function () {
        $("form label").css({
            "background-color": "#99ffe7",
            "color": "black"
        })
    },
    function () {
        $("form label").css({
            "background-color": "#d1fff3",
            "color": "black"
        })
    }
)

const preview_div = file_upload.append('div')
    .attr('class', 'preview')
    .attr('id', 'name_preview')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('margin-left', $('#select_div').width()*25/1800 + 'px')
    .style('line-height', '100%')
    .html('No files is uploaded')
    .style('font-weight', '600')
    .style('font-size', $('#select_div').width()*15/1800 + 'px');


$("#file-upload").on("change", function () {
    //console.log(this.files[0].name);
    $("#spinner_title").html("Uploading...");

    setTimeout(()=>{
        $("#spinner_div").toggle();
    }, 0);

    if (validFileType(this.files[0])) {
        setTimeout(()=>{
            $("#name_preview").html(this.files[0].name);

            const reader = new FileReader()
            // read file
            reader.readAsText(this.files[0], "UTF-8")
            reader.onload = function (e) {
                has_upload = 1;
                //read contents
                const fileString = e.target.result;
                uploaded_data = JSON.parse(fileString);
                //console.log(uploaded_data)
            }
            //console.log(`uploaded file path is ${this.value}`);

            initialize_slider_value();
        }, 10);

        setTimeout(()=>{
            $("#spinner_title").html("Computing...");
            update_plot();
        }, 20);
    } else {
        $("#name_preview").html('File ' + this.files[0].name + ' is not a json file. Please update your selection');
    }
});

function validFileType(file) {
    return fileTypes.includes(file.type);
}

//spinner
const spinner_div = select_div.append('div')
    .attr('id', 'spinner_div')
    .style('margin-left', $('#select_div').width()*60/1800 + 'px')
    .style('display', 'flex')

$("#spinner_div").hide(); // hide spinner_div

const spinner_button = spinner_div.append('button')
    .attr('class', 'btn btn-primary')
    .attr('type', 'button')
    .style('display', 'flex')
    .style('align-items', 'center');

spinner_button.append('span')
    .attr('class', 'spinner-border spinner-border-sm')
    .attr('role', 'status')
    .attr('aria-hidden', 'true');

spinner_button.append('div')
    .attr('id', 'spinner_title')
    .style('width', $('#select_div').width()*120/1800 + 'px')
    .style('margin-left', $('#select_div').width()*10/1800 + 'px')
    .html('Processing...')
    .style('font-size', $('#select_div').width()*13/1800 + 'px');

const plot_div = board.append('div')
    .style('display', 'flex')
    //.style('flex-wrap', 'wrap')
    .style('width', '100%')
    //.style('height', div_height + 'px');


const l_win = plot_div.append('div')
    .attr('id', 'l_win')
    .style('width', '47.5%')
    .style('height', '43vw')
    .style('border', '2px solid #888')
    .style('background-color', 'white')
    .style('position', 'relative');

console.log($('#l_win').width(), $('#l_win').height())


const canvas = l_win.append('canvas')
    .attr('id', 'my_canvas')
    .attr('width', $('#l_win').width())
    .attr('height', $('#l_win').height())
    .style('background-color', 'white')
    .style('position', 'absolute');

const font_awesome_svg = l_win.append('svg')
    .attr('id', 'font_awesome_svg')
    .attr('width', $('#l_win').width() * 5/100)
    .attr('height', $('#l_win').width() / 8)
    .attr('transform', `translate(${$('#l_win').width() * 0.935}, ${$('#l_win').width() * 0.0125})`)
    .style('position', 'absolute');

const statistics_svg = l_win.append('svg')
    .attr('id', 'statistics_svg')
    .attr('width', $('#l_win').width()*300/800)
    .attr('height', $('#l_win').width()*50/800)
    .attr('transform', `translate(${$('#l_win').width()*5/800}, ${$('#l_win').width()*5/800})`)
    .style('position', 'absolute');

const svg = plot_div.append('div')
    .attr('id', 'svg_div')
    .style('width', '47.5%')
    .style('height', '43vw')
    .style('border', '2px solid #888')
    .style('margin-left', '5%')
    .style('background', "#ececec")
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('background-color', 'white');

update_plot();

//canvas background color
let light_on = true;

const toolbox_g = font_awesome_svg.append('g')
    .attr('id', 'toolbox_g')
    .attr('transform', `translate(${$('#l_win').width()/90}, ${$('#l_win').width()/80})`);

const img_text = toolbox_g.append('text')
    .attr('id', 'img_text')
    .attr('class', 'far')
    .attr('y', $('#l_win').width()/400)
    .attr('text-anchor', 'middle')
    .attr('font-size', $('#l_win').width()*3/100)
    .attr('font-family', 'helvetica')
    .attr('alignment-baseline', 'central')
    .attr('fill', light_on ? 'black' : 'white')
    .attr('cursor', 'pointer')
    .style('pointer-events', 'all')
    .on('click', function () {
        let c = document.getElementById('my_canvas');
        //let dataURL = c.toDataURL("image/png");
        let fileName = data_name + ".png";
        c.toBlob(function (blob) {
            saveAs(blob, fileName);
        });
    })
    .text('\uf1c5')
    .append('title')
    .text('download png file');

const json_text = toolbox_g.append('text')
    .attr('id', 'json_text')
    .attr('class', 'far')
    .attr('y', $('#l_win').width()*9/200)
    .attr('text-anchor', 'middle')
    .attr('font-size', $('#l_win').width()*3/100)
    .attr('font-family', 'helvetica')
    .attr('alignment-baseline', 'central')
    .attr('fill', light_on ? 'black' : 'white')
    .attr('cursor', 'pointer')
    .style('pointer-events', 'all')
    .on('click', function () {
        let content = JSON.stringify(json_array, null, '\t');
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        let fileName = has_upload == 1 ? "Ours.json" : algorithm + ".json"
        saveAs(blob, fileName);
    })
    .text('\uf15b')
    .append('title')
    .text('download json file');

const light_text = toolbox_g.append('text')
    .attr('id', 'light_text')
    .attr('class', 'far')
    .attr('y', $('#l_win').width()*7/80)
    .attr('text-anchor', 'middle')
    .attr('font-size', $('#l_win').width()*3/100)
    .attr('font-family', 'helvetica')
    .attr('alignment-baseline', 'central')
    .attr('fill', light_on ? 'black' : 'white')
    .attr('cursor', 'pointer')
    .style('pointer-events', 'all')
    .on('click', function () {
        if (light_on) {
            light_on = false;
            light_text.text('\uf0eb');
            canvas.style('background-color', 'black');
            light_text.select('title').text('control the light');
            toolbox_g.selectAll('text').attr('fill', 'white');
            statistics_svg.selectAll('text').attr('fill', 'white');
            console.log(light_text.select('title'))
        } else {
            light_on = true;
            light_text.text('\uf0eb');
            canvas.style('background-color', 'white')
            light_text.select('title').text('control the light');
            toolbox_g.selectAll('text').attr('fill', 'black');
            statistics_svg.selectAll('text').attr('fill', 'black');
        }
    })
    .text('\uf0eb')
    .append('title')
    .text('control the light');


const control_div = board.append('div')
    .style('margin-top', '40px')
    .style('display', 'flex')
    .style('width', '100%');
    //.style('height', '370px');

const original_div = control_div.append('div')
    .attr('id', 'original_div')
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('padding', '20px')
    .style('width', '47.5%')
    .style('border', '3px dashed #888')
    .style('border-radius', '1.5%');

const original_title_div = original_div.append('div')
    .style('display', 'flex')

original_title_div.append('span')
    .html("Appearance control")
    .style('font-weight', '700')
    .style('font-size', $('#original_div').width()*45/820 + 'px');

original_title_div.append('span')
    .style('display', 'flex')
    .style('align-items', 'flex-end')
    .style('margin-left', $('#original_div').width()*20/820 + 'px')
    .html("[Original]")
    .style('font-weight', '500')
    .style('font-size', $('#original_div').width()*20/820 + 'px');

const ours_div = control_div.append('div')
    .attr('id', 'ours_div')
    .style('background', "#ececec")
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('padding', '20px')
    .style('width', '47.5%')
    .style('margin-left', '5%')
    .style('border', '3px dashed #888')
    .style('border-radius', '1.5%');

const ours_title_div = ours_div.append('div')
    .style('display', 'flex')

ours_title_div.append('span')
    .html("Parameter control")
    .style('font-weight', '700')
    .style('font-size', $('#ours_div').width()*45/820 + 'px');

ours_title_div.append('span')
    .style('display', 'flex')
    .style('align-items', 'flex-end')
    .style('margin-left', $('#ours_div').width()*20/820 + 'px')
    .html("[Ours(adjustable)]")
    .style('font-weight', '500')
    .style('font-size', $('#ours_div').width()*20/820 + 'px');


const radius_control_div = original_div.append('div')
    .style('height', $('#original_div').width()*80/820 + 'px')
    .style('margin-top', $('#original_div').width()*50/820 + 'px')
    .style('margin-bottom', $('#original_div').width()*10/820 + 'px');

const radius_control_input = radius_control_div.append('input')
    .attr('id', 'radius_ex6')
    .attr('class', 'original_slider_input')
    .attr('type', 'text')
    .attr('data-slider-id', 'radius')
    .attr('data-slider-min', '0.5')
    .attr('data-slider-max', '3')
    .attr('data-slider-step', '0.1')
    .attr('data-slider-value', '1')
    .style('width', $('#original_div').width() * 36/100 + 'px')

const radius_control_span = radius_control_div.append('span')
    .attr('id', 'radius_ex6CurrentSliderValLabel')
    .style('width', $('#original_div').width()*100/820 + 'px')
    .html('radius: ')
    .style('font-size', $('#original_div').width()*35/820 + 'px')
    .style('margin-left', $('#original_div').width()*45/820 + 'px')
    .append('span')
    .attr('id', 'radius_ex6SliderVal')
    .attr('class', 'slider_show')
    .html('1');

$("#radius_ex6").slider();
$("#radius_ex6")
    .on("slide", function (slideEvt) {
        $("#radius_ex6SliderVal").text(slideEvt.value);
    })
    .on("slideStop", function (slideEvt) {
        original_data_r = slideEvt.value;
        update_plot()
    });

$("#radius .slider-selection").css({
    "background": "#e8c0da"
});

$("#radius .slider-handle").css({
    "background": "#ff71cd"
});

const transparency_control_div = original_div.append('div')
    .style('height', $('#original_div').width()*80/820 + 'px')
    .style('margin-bottom', $('#original_div').width()*10/820 + 'px');

const transparency_control_input = transparency_control_div.append('input')
    .attr('id', 'transparency_ex6')
    .attr('class', 'original_slider_input')
    .attr('type', 'text')
    .attr('data-slider-id', 'transparency')
    .attr('data-slider-min', '0.05')
    .attr('data-slider-max', '1')
    .attr('data-slider-step', '0.05')
    .attr('data-slider-value', '1')
    .style('width', $('#original_div').width() * 36/100 + 'px')

const transparency_control_span = transparency_control_div.append('span')
    .attr('id', 'transparency_ex6CurrentSliderValLabel')
    .html('transparency: ')
    .style('font-size', $('#original_div').width()*35/820 + 'px')
    .style('margin-left', $('#original_div').width()*45/820 + 'px')
    .append('span')
    .attr('id', 'transparency_ex6SliderVal')
    .attr('class', 'slider_show')
    .html('1');

$("#transparency_ex6").slider();
$("#transparency_ex6")
    .on("slide", function (slideEvt) {
        $("#transparency_ex6SliderVal").text(slideEvt.value);
    })
    .on("slideStop", function (slideEvt) {
        original_data_t = slideEvt.value;
        update_plot()
    });

$("#transparency .slider-selection").css({
    "background": "#b7e3c9"
});

$("#transparency .slider-handle").css({
    "background": "#46cb81"
});

const sampling_control_div = original_div.append('div')
    .style('height', $('#original_div').width()*80/820 + 'px')
    .style('margin-bottom', $('#original_div').width()*10/820 + 'px');

const sampling_control_input = sampling_control_div.append('input')
    .attr('id', 'sampling_ex6')
    .attr('class', 'original_slider_input')
    .attr('type', 'text')
    .attr('data-slider-id', 'sampling')
    .attr('data-slider-min', '0.1')
    .attr('data-slider-max', '1')
    .attr('data-slider-step', '0.1')
    .attr('data-slider-value', '1')
    .style('width', $('#original_div').width() * 36/100 + 'px')

const sampling_control_span = sampling_control_div.append('span')
    .attr('id', 'sampling_SliderValLabel')
    .html('sampling rate: ')
    .style('font-size', $('#original_div').width()*35/820 + 'px')
    .style('margin-left', $('#original_div').width()*45/820 + 'px')
    .append('span')
    .attr('id', 'sampling_ex6SliderVal')
    .attr('class', 'slider_show')
    .html('1');

$("#sampling_ex6").slider();
$("#sampling_ex6")
    .on("slide", function (slideEvt) {
        $("#sampling_ex6SliderVal").text(slideEvt.value);
    })
    .on("slideStop", function (slideEvt) {
        original_data_s = slideEvt.value;
        update_plot();
    });

$("#sampling .slider-selection").css({
    "background": "#c2e4ee"
});

$("#sampling .slider-handle").css({
    "background": "#43c7e1"
});

const k_control_div = ours_div.append('div')
    .style('height', $('#ours_div').width() * 100/820 + 'px')
    .style('margin-top', $('#ours_div').width() * 50/820 + 'px')
    .style('margin-bottom', $('#ours_div').width() * 20/820 + 'px');

const k_control_input = k_control_div.append('input')
    .attr('id', 'k_ex6')
    .attr('class', 'ours_slider_input')
    .attr('type', 'text')
    .attr('data-slider-id', 'k')
    .attr('data-slider-min', '3')
    .attr('data-slider-max', '10')
    .attr('data-slider-step', '1')
    .attr('data-slider-value', '3')
    .style('width', $('#ours_div').width() * 36/100 + 'px')

const k_control_span = k_control_div.append('span')
    .attr('id', 'k_ex6CurrentSliderValLabel')
    .style('width', $('#ours_div').width() * 100/820 + 'px')
    .html('k: ')
    .style('font-size', $('#ours_div').width() * 35/820 + 'px')
    .style('margin-left', $('#ours_div').width() * 45/820 + 'px')
    .append('span')
    .attr('id', 'k_ex6SliderVal')
    .attr('class', 'ours_slider_show')
    .html('3');

$("#k_ex6").slider();
$("#k_ex6")
    .on("slide", function (slideEvt) {
        $("#k_ex6SliderVal").text(slideEvt.value);
    })
    .on("slideStop", function (slideEvt) {
        k_change = 1;
        k = slideEvt.value;
        update_plot()
    });

$("#k .slider-selection").css({
    "background": "#cbcbcb"
});

$("#k .slider-handle").css({
    "background": "#8f8f8f"
});

const size_control_div = ours_div.append('div')
    .style('height', $('#ours_div').width() * 100/820 + 'px')
    .style('margin-bottom', $('#ours_div').width() * 20/820 + 'px');

const size_control_input = size_control_div.append('input')
    .attr('id', 'size_ex6')
    .attr('class', 'ours_slider_input')
    .attr('type', 'text')
    .attr('data-slider-id', 'size')
    .attr('data-slider-min', '1')
    .attr('data-slider-max', '10')
    .attr('data-slider-step', '1')
    .attr('data-slider-value', '5')
    .style('width', $('#ours_div').width() * 36/100 + 'px')

const size_control_span = size_control_div.append('span')
    .attr('id', 'size_ex6CurrentSliderValLabel')
    .html('size: ')
    .style('font-size', $('#ours_div').width() * 35/820 + 'px')
    .style('margin-left', $('#ours_div').width() * 45/820 + 'px')
    .append('span')
    .attr('id', 'size_ex6SliderVal')
    .attr('class', 'ours_slider_show')
    .html('5');

$("#size_ex6").slider();
$("#size_ex6")
    .on("slide", function (slideEvt) {
        $("#size_ex6SliderVal").text(slideEvt.value);
    })
    .on("slideStop", function (slideEvt) {
        size_change = 1;
        size = slideEvt.value;
        update_plot()
    });

$("#size .slider-selection").css({
    "background": "#cbcbcb"
});

$("#size .slider-handle").css({
    "background": "#8f8f8f"
});

$(".slider.slider-horizontal").css({
    "margin-left": $('#ours_div').width() * 80/820 + 'px'
});


d3.selectAll('.slider_input')
    .selectAll('slider-selection')
    .style('background', '#BABABA')

function update_plot() {
    json_array.length = 0;
    canvas.selectAll('*').remove();
    svg.selectAll('*').remove();
    statistics_svg.selectAll('*').remove();

    setTimeout(()=>{
        let menu = algorithm;
        if (menu == "Ours(adjusted r)" || menu == "Ours(adjustable)") menu = "Ours";

        file_path = "static/data/" + menu + "/" + data_name + ".json";

        d3.json(file_path).then(function (data_points) {
            if (has_upload == 1){
                if(k != 3 || size != 5){
                    $("#spinner_div").toggle();
                }

                setTimeout(()=>{
                    data_handle_upload();
                }, 10);

                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 20);
            }
            else if (algorithm == "Original"){
                $("#spinner_title").html("Processing...");
                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 0)

                setTimeout(()=>{
                    data_handle_original(data_points);
                }, 10);

                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 20);
            }
            else if (algorithm == "HaGrid"){
                $("#spinner_title").html("Processing...");
                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 0)

                setTimeout(()=>{
                    data_handle_HaGrid(data_points);
                }, 10);

                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 20);
            }
            else if (algorithm == "DGrid"){
                $("#spinner_title").html("Processing...");
                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 0)

                setTimeout(()=>{
                    data_handle_DGrid(data_points);
                }, 10);

                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 20);
            }
            else if (algorithm == "Ours(adjusted r)"){
                $("#spinner_title").html("Processing...");
                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 0)

                setTimeout(()=>{
                    data_handle_adjusted(data_points);
                }, 10);

                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 20);
            }
            else if (algorithm == "Ours(adjustable)"){
                if (k_change == 1 || size_change == 1){
                    $("#spinner_title").html("Computing...");
                }
                else{
                    $("#spinner_title").html("Processing...");
                }

                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 1)

                setTimeout(()=>{
                    data_handle_ours(data_points);
                }, 10);

                setTimeout(()=>{
                    $("#spinner_div").toggle();
                }, 20);
            }

        })
    }, 10);

}

function data_formal(data_points){
    const board = document.getElementById('board');
    const {width, height} = board.getElementsByTagName('canvas')[0].getBoundingClientRect();

    const [x_min, x_max] = d3.extent(data_points, d => d.x);
    const [y_min, y_max] = d3.extent(data_points, d => d.y);
    const w = x_max - x_min;
    const h = y_max - y_min;

    const scale_x = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([0, canvas_width]);
    const scale_y = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([0, canvas_height]);

    for (const p of data_points) {
        if (w < h) {
            p.r = canvas_width / h * p.r;
        } else {
            p.r = canvas_width / w * p.r;
        }

        p.x = scale_x(p.x);
        p.y = scale_y(p.y);
    }

    return data_points;
}

function data_formal_for_draw(data_points){
    const board = document.getElementById('board');
    const {width, height} = board.getElementsByTagName('canvas')[0].getBoundingClientRect();

    const [x_min, x_max] = d3.extent(data_points, d => d.x);
    const [y_min, y_max] = d3.extent(data_points, d => d.y);
    const w = x_max - x_min;
    const h = y_max - y_min;

    const scale_x = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([0, canvas_width]);
    const scale_y = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([0, canvas_height]);

    for (const p of data_points) {
        if (w < h) {
            p.r = canvas_width / h * p.r;
        } else {
            p.r = canvas_width / w * p.r;
        }

        p.x = scale_x(p.x);
        p.y = scale_y(p.y);
    }

    return data_points;
}

function original_slider_control_disable() {
    original_div.style('background', "#ececec");
    $(".original_slider_input").slider("disable");

    $("#radius .slider-selection").css({
        "background": "#cbcbcb"
    });

    $("#radius .slider-handle").css({
        "background": "#8f8f8f"
    });
    $("#transparency .slider-selection").css({
        "background": "#cbcbcb"
    });

    $("#transparency .slider-handle").css({
        "background": "#8f8f8f"
    });

    $("#sampling .slider-selection").css({
        "background": "#cbcbcb"
    });

    $("#sampling .slider-handle").css({
        "background": "#8f8f8f"
    });
}

function original_slider_control_enable() {
    original_div.style('background', "#ffffff");
    $(".original_slider_input").slider("enable");

    $("#radius .slider-selection").css({
        "background": "#e8c0da"
    });

    $("#radius .slider-handle").css({
        "background": "#ff71cd"
    });
    $("#transparency .slider-selection").css({
        "background": "#b7e3c9"
    });

    $("#transparency .slider-handle").css({
        "background": "#46cb81"
    });

    $("#sampling .slider-selection").css({
        "background": "#c2e4ee"
    });

    $("#sampling .slider-handle").css({
        "background": "#43c7e1"
    });
}

function ours_slider_control_disable() {
    ours_div.style('background', "#ececec");
    svg.style('background', "#ececec");
    $(".ours_slider_input").slider("disable");

    $("#k .slider-selection").css({
        "background": "#cbcbcb"
    });

    $("#k .slider-handle").css({
        "background": "#8f8f8f"
    });
    $("#size .slider-selection").css({
        "background": "#cbcbcb"
    });

    $("#size .slider-handle").css({
        "background": "#8f8f8f"
    });
}

function ours_slider_control_enable() {
    ours_div.style('background', "#ffffff");
    svg.style('background', "#ffffff");
    $(".ours_slider_input").slider("enable");

    $("#k .slider-selection").css({
        "background": "#f1e3a9"
    });

    $("#k .slider-handle").css({
        "background": "#eaba48"
    });
    $("#size .slider-selection").css({
        "background": "#bacae7"
    });

    $("#size .slider-handle").css({
        "background": "#4675cb"
    });
}

function initialize_slider_value() {
    original_data_t = 1;
    original_data_s = 1;
    original_data_r = 1;
    k = 3;
    size = 5;
    $(".original_slider_input").slider('setValue', '1');
    $("#k_ex6").slider('setValue', k + '');
    $("#size_ex6").slider('setValue', size + '');
    $(".slider_show").text('1');
    $("#k_ex6SliderVal").text('3');
    $("#size_ex6SliderVal").text('5');
}