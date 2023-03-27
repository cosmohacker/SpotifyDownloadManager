// Define constants and variables
const librarySelect = document.getElementById("library_select");
const outputSelect = document.getElementById("output_select");
const download_link = document.getElementById("download_link");
const download_format = document.getElementById("format");
const lblDownloadLink = document.getElementById("lblDownloadLink");

const cacheSelect = document.getElementById("cache_file");
const btnDownload = document.getElementById("btnDownload");
const button = document.getElementById("formats");
const current_time = document.getElementById("current_time");
const end_time = document.getElementById("end_time");
const btnClear = document.getElementById("btnClear");
const btnRecover = document.getElementById("btnRecover");
const btnLibReset = document.getElementById("reset-library");
const btnRecoverReset = document.getElementById("reset-recover");
var texts = ["mp3", "m4a", "flac", "opus", "ogg"];
var type_val = "song"
var download_method = "spotdl";
var recover_method = "json";
var library_path = "";
var globalSongCount = 1;
let currentIndex = 0;


// Add event listeners
librarySelect.addEventListener("click", handleLibrarySelect);
outputSelect.addEventListener("click", handleOutputSelect);
cacheSelect.addEventListener("click", handleCacheSelect);
btnDownload.addEventListener("click", handleDownload);
btnRecover.addEventListener("click", handleRecover);
button.addEventListener("click", handleFormatsButtonClick);
btnLibReset.addEventListener("click", resetLibrary);
btnRecoverReset.addEventListener("click", resetRecover);
btnClear.addEventListener("click", clear_data);
const checkbox = document.querySelector('.switch-button-checkbox');

checkbox.addEventListener('change', function() {
    if (this.checked) {
        recover_method = 'spotdl';
    } else {
        recover_method = 'json';
    }
});

const btnShare = document.getElementById("share_link");

btnShare.addEventListener('click', function() {
  navigator.clipboard.writeText("https://github.com/cosmohacker/SpotifyDownloadManager");

   Toastify({
    text: 'Share Link Copied',
    duration: 3000,
    gravity: 'top',
    position: 'center',
    style: {
    background: "#0C9000",
  },
  }).showToast();
});

$('select.dropdown').each(function() {

    var dropdown = $('<div />').addClass('dropdown selectDropdown');

    $(this).wrap(dropdown);

    var label = $('<span />').text($(this).attr('placeholder')).insertAfter($(this));
    var list = $('<ul />');

    $(this).find('option').each(function() {
        list.append($('<li />').append($('<a />').text($(this).text())));
    });

    list.insertAfter($(this));

    if ($(this).find('option:selected').length) {
        label.text($(this).find('option:selected').text());
        list.find('li:contains(' + $(this).find('option:selected').text() + ')').addClass('active');
        $(this).parent().addClass('filled');
    }

});

$(document).on('click touch', '.selectDropdown ul li a', function(e) {
    e.preventDefault();
    var dropdown = $(this).parent().parent().parent();
    var active = $(this).parent().hasClass('active');
    var label = active ? dropdown.find('select').attr('placeholder') : $(this).text();

    dropdown.find('option').prop('selected', false);
    dropdown.find('ul li').removeClass('active');

    dropdown.toggleClass('filled', !active);
    dropdown.children('span').text(label);
    type_val = label;
    handleDownloadTypeChange();

    if (!active) {
        dropdown.find('option:contains(' + $(this).text() + ')').prop('selected', true);
        $(this).parent().addClass('active');
    }

    dropdown.removeClass('open');
});

$('.dropdown > span').on('click touch', function(e) {
    var self = $(this).parent();
    self.toggleClass('open');
});

$(document).on('click touch', function(e) {
    var dropdown = $('.dropdown');
    if (dropdown !== e.target && !dropdown.has(e.target).length) {
        dropdown.removeClass('open');
    }
});



function handleDownloadTypeChange() {
    var lblDownloadLink = document.getElementById("lblDownloadLink");
    var lblOutputFolder = document.getElementById("lblOutputFolder");
    if (type_val === "JSON") {
        texts = ["mp3"];
        download_method = "json";
        $('#download_link').attr('placeholder', 'Playlist Name');
        lblDownloadLink.textContent = "Playlist";
        lblOutputFolder.textContent = "JSON File";
        button.innerText = "mp3";
        outputSelect.innerHTML = "Select JSON File";

    } else {
        download_method = "spotdl";
        texts = ["mp3", "m4a", "flac", "opus", "ogg"];
        $('#download_link').attr('placeholder', 'Link Here...');
        lblOutputFolder.textContent = "Output Folder";
        lblDownloadLink.textContent = "Link";
        outputSelect.innerHTML = "Select Folder";

    }
}


// Event handler functions

function handleLibrarySelect(event) {
    fetch("/library")
        .then(response => response.json())
        .then(data => {
            const file_path = data.files;
            const folder_path = data.folder;
            library_path = folder_path;
            const list = document.getElementById("library_list");
            list.innerHTML = '';
            list.classList.add("lib-ul");

            let songCount = 1;

            file_path.forEach(path => {
                const li = document.createElement("li");
                li.id = "li-song-" + songCount
                li.classList.add("lib-li");
                li.setAttribute("onclick", `setSong('${li.id}')`);
                //const thumbnail = document.createElement("img");
                //thumbnail.classList.add("thumbnail");
                //thumbnail.src = "/static/img/logo/logo.png";
                //li.appendChild(thumbnail);

                const fileName = document.createElement("span");
                fileName.textContent = path;
                li.appendChild(fileName);

                //const playButton = document.createElement("button");
                //playButton.classList.add("play-button");
                //const playIcon = document.createElement("i");
                //playIcon.classList.add("fa", "fa-play");
                //playButton.appendChild(playIcon);
                //li.appendChild(playButton);

                list.appendChild(li);
                songCount++;
                globalSongCount = songCount;
            });
        })
        .catch(error => console.error(error));

}

function handleOutputSelect() {
    if (download_method == "spotdl") {
        fetch("/choose_folder")
            .then(response => response.json())
            .then(data => {
                const file_path = data.folder;
                console.log(file_path);
                outputSelect.innerHTML = file_path;
            })
            .catch(error => console.error(error));
    } else {
        fetch("/choose_json")
            .then(response => response.json())
            .then(data => {
                const file_path = data.json_file;
                console.log(file_path);
                outputSelect.innerHTML = file_path;
            })
            .catch(error => console.error(error));
    }

}

function handleDownload() {
    var selectedOption = download_type.options[download_type.selectedIndex];

    $.ajax({
        url: '/download',
        type: 'POST',
        data: {
            link: $('#download_link').val(),
            format: $('#formats').text(),
            path: $('#output_select').text(),
            type: download_method,
        },
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function handleRecover() {
    $.ajax({
        url: '/recover',
        type: 'POST',
        data: {
            type: recover_method,
            file: $('#cache_file').text(),
        },
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function handleCacheSelect() {
    fetch("/choose_cache")
        .then(response => response.json())
        .then(data => {
            const file_path = data.file;
            console.log(file_path);
            cacheSelect.innerHTML = file_path;
        })
        .catch(error => console.error(error));
}

function handleFormatsButtonClick() {
    currentIndex = (currentIndex + 1) % texts.length;
    button.innerText = texts[currentIndex];
}

function displayData() {
    $.ajax({
        url: "/data",
        type: "GET",
        dataType: "json",
        success: function(data) {
            var items = [];
            $.each(data.data, function(i, item) {
                if (item !== null && item !== '' && item !== '\n') {
                    items.push("<li>" + item + "</li>");
                }
            });
            $("#data").empty().append(items.join(""));
        },
        error: function(xhr, status, error) {
            console.log(error);
        },
        complete: function() {
            setTimeout(displayData, 5000);
        }
    });
}

$(document).ready(function() {
    displayData();
});

function clear_data() {
    $.ajax({
        url: "/clear",
        type: "GET",
        dataType: "json",
        success: function(data) {},
        error: function(xhr, status, error) {
            console.log(error);
        },
        complete: function() {
            //setTimeout(displayData, 5000);
        }
    });
    displayData();
}

function resetLibrary() {
    if (type_val === "JSON")
        outputSelect.innerHTML = "Select JSON File";
    else
        outputSelect.innerHTML = "Select Folder";
}

function resetRecover() {
    cacheSelect.innerHTML = "Select File";
}

const dots = document.querySelectorAll('.dot');
const slides = document.querySelectorAll('#slider-content > div');

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        slides.forEach(slide => slide.style.display = 'none');
        slides[index].style.display = 'block';
        dots.forEach(dot => dot.classList.remove('active'));
        dot.classList.add('active');
    });
});

// Music
var liId = "Null"
var btnStart = document.getElementById("btnStart");
var btnStop = document.getElementById("btnStop");
var btnNext = document.getElementById("next");
btnNext.addEventListener("click", nextSong);
var btnPrevious = document.getElementById("previous");
btnPrevious.addEventListener("click", prevSong);
var musicPlayer = $('#music-player');

var btnShuffle = document.getElementById("shuffle");
btnShuffle.addEventListener("click", toggleShuffle);
const shufflePath = document.getElementById("shuffle_path");
var is_on_shuffle = false;

var btnRepeat = document.getElementById("repeat");
btnRepeat.addEventListener("click", toggleRepeat);
const repeatPath = document.getElementById("repeat_path");
var is_on_repeat = false;

var audioSrc;

function nextSong() {
        if(is_on_shuffle){
        nextId = get_last_number(liId, "next");
        }
        setSong(nextId);
}

function prevSong() {
        if(is_on_shuffle){
        prevId = get_last_number(liId, "prev");
        }
        setSong(prevId);
}

$("#music-player")[0].addEventListener("ended", function() {
    if (is_on_repeat)
        setSong(liId);
    else
        nextSong(nextId);
});

function toggleRepeat() {
    if (!is_on_repeat) {
        repeatPath.setAttribute("stroke", "#0c9000");
        is_on_repeat = true;
    } else {
        repeatPath.setAttribute("stroke", "#BAA8ED");
        is_on_repeat = false;
    }
}

function toggleShuffle() {
    if (!is_on_shuffle) {
        shufflePath.setAttribute("fill", "#0c9000");
        is_on_shuffle = true;
    } else {
        shufflePath.setAttribute("fill", "#BAA8ED");
        is_on_shuffle = false;
    }
}

function setSong(id) {
    const spanElements = document.querySelectorAll('li span');
    spanElements.forEach(span => {
        span.style.color = '#fff';
    });

    liId = id;
    nextId = get_last_number(liId, "next");
    prevId = get_last_number(liId, "prev");
    var item = document.getElementById(liId);
    $.ajax({
        url: '/get-music',
        type: 'POST',
        xhrFields: {
            responseType: 'blob'
        },
        data: {
            file: library_path,
            song: item.textContent,
        },
        success: function(response) {
            audioSrc = URL.createObjectURL(response);
            $('#music-player source').attr('src', audioSrc);
            musicPlayer[0].load();
            musicPlayer[0].play();
        },
        error: function(error) {
            console.log(error);
        }
    });

    $.ajax({
        url: '/get-music-info',
        type: 'POST',
        data: {
            file: library_path,
            song: item.textContent,
        },
        success: function(data) {
            document.getElementById('album_name').textContent = data.song;
            document.getElementById('artist_name').textContent = data.artist;
        },
        error: function(error) {
            console.log(error);
        }
    });

    btnStop.style.display = "block";
    btnStart.style.display = "none";
    var spanElement = document.querySelector(`li#${id} span`);
    spanElement.style.color = '#0c9000';
}

$(window).on('load', function() {
    $.ajax({
        url: '/play-music',
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: (data) => {
            audioSrc = URL.createObjectURL(data);
            $('#music-player source').attr('src', audioSrc);
            musicPlayer[0].load();
        },
        error: (xhr, status, error) => {
            console.log('Error loading music:', error);
        }
    });
});

btnStop.addEventListener('click', () => {
    musicPlayer[0].pause();
    btnStop.style.display = "none";
    btnStart.style.display = "block";
});

btnStart.addEventListener('click', () => {
    $('#music-player source').attr('src', audioSrc);
    musicPlayer[0].play();
    btnStop.style.display = "block";
    btnStart.style.display = "none";
});

$(document).ready(function() {
    var musicPlayer = document.getElementById("music-player");
    var progressBar = $(".progress-bar");

    musicPlayer.addEventListener("timeupdate", function() {
        var duration = musicPlayer.duration;
        var currentTime = musicPlayer.currentTime;
        var minutes = Math.floor(currentTime / 60);
        var seconds = Math.floor(currentTime % 60);
        var endMinutes = Math.floor(duration / 60);
        var endSeconds = Math.floor(duration % 60);
        var formattedCurrentTime = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        var formattedEndTime = (endMinutes < 10 ? "0" : "") + endMinutes + ":" + (endSeconds < 10 ? "0" : "") + endSeconds;
        current_time.innerHTML = formattedCurrentTime;
        end_time.innerHTML = formattedEndTime;
        var progress = (currentTime / duration) * 100;
        progressBar.css("width", progress + "%");
    });
});

function get_last_number(text, type) {
    const matches = text.match(/\d+$/);
    const lastNumber = matches ? parseInt(matches[0]) : null;
    var newNumber;
    if (lastNumber === null) return null;

    if (is_on_shuffle)
        newNumber = randomIntFromInterval(1, globalSongCount);
    else{
        if (type == "next") {
            newNumber = lastNumber + 1;
            if (newNumber > globalSongCount)
                newNumber = 1;
        } else {
            newNumber = lastNumber - 1;
            if (newNumber < 1)
                newNumber = globalSongCount;
        }
    }
    return text.replace(/\d+$/, newNumber.toString());;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}