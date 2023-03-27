import os
import re
import urllib.request
from pathlib import Path

import ijson
import numpy as np
from pytube import YouTube


class Utils:
    @staticmethod
    def download_song(link, download_format, path):
        open(path + "/recover.spotdl", "w")
        os.system('python -m spotdl save ' + link + ' --save-file ' + path + '/recover.spotdl')
        os.system(
            'python -m spotdl download ' + link + ' --output ' + '\"' + path + '\"' + ' --format ' + download_format + ' --preload ' + ' > data.txt')

    @staticmethod
    def resume_download(file, __type):
        path = os.path.dirname(file)
        if __type == "spotdl":
            os.system(
                'python -m spotdl download ' + file + ' --output ' + '\"' + path + '\"' + ' --preload ' + ' > data.txt')
        else:
            Data.data_insert("JSON recovery process started.")
            resume_json(file)

    @staticmethod
    def download_json(file, playlist):
        Data.clear_json_recover()
        download_via_json(file, playlist)


def download_via_json(file, playlist):
    path = os.path.dirname(file)
    json_filename = file
    assert os.path.exists(file), "I did not find the file at, " + str(file)
    f = open(file, 'r+')
    f.close()
    list_album_names(json_filename)
    get_tracks(playlist, file, path)


def resume_json(file):
    path = os.path.dirname(file)
    Data.data_insert("Path : " + path)
    Data.data_insert("File : " + file)
    songs = Data.read_json_recover(path)
    for song in songs:
        find_video_and_add(song, path)


def list_album_names(json_filename):
    with open(json_filename, 'rb') as data:
        for obj in ijson.items(data, 'playlists.item.name'):
            listName = obj
            Data.data_insert(listName)


def json_hierarchy(json_filename):
    with open(json_filename, 'rb') as input_file:
        parser = ijson.parse(input_file)
        for prefix, event, value in parser:
            Data.data_insert('prefix={}, event={}, value={}'.format(prefix, event, value))


def get_tracks(list_name, json_filename, download_path):
    count = -1
    input_get = []
    with open(json_filename, 'rb') as file:
        parser = ijson.parse(file)
        for prefix, event, value in parser:
            if event == 'start_map':
                value1 = value2 = 0
            elif event == 'end_map':
                if value3 == list_name:
                    count += 1
                    if isinstance(value1, int) and isinstance(value2, int):
                        Data.data_insert("Empty Track")
                    else:
                        input_get.insert(count, [value3, value1 + " " + value2])
                continue
            if prefix.endswith('.trackName'):
                value1 = value
            elif prefix.endswith('.artistName'):
                value2 = value
            elif prefix.endswith('.name'):
                value3 = value

    an_array = np.array(input_get)
    coordskeys = np.array(list(set([tuple(x) for x in an_array])))
    with open(download_path + '/recover.txt', 'w') as f:
        f.write('\n' + str(coordskeys))

    for iy, ix in np.ndindex(coordskeys.shape):
        if ix != 0:
            find_video_and_add(coordskeys[iy, ix], download_path)


def find_video_and_add(video_name, download_path):
    Data.data_insert(video_name)
    change_spaces = video_name.replace(" ", "+")
    unicode = ''.join([i if ord(i) < 128 else '' for i in change_spaces])

    html = urllib.request.urlopen("https://www.youtube.com/results?search_query=" + unicode)
    video_ids = re.findall(r"watch\?v=(\S{11})", html.read().decode())
    yt_link = "https://www.youtube.com/watch?v=" + video_ids[0]
    Data.data_insert(yt_link)
    download_from_youtube(yt_link, download_path)


def download_from_youtube(youtubeURL, download_path):
    try:
        yt = YouTube(str(youtubeURL))
        video = yt.streams.filter(only_audio=True).first()
        destination = download_path
        file_name = video.title + ".mp3"
        full_file_path = Path(destination, file_name)

        if full_file_path.exists():
            Data.data_insert("File already exists. Skipped!")
        else:
            out_file = video.download(output_path=destination)
            base, ext = os.path.splitext(out_file)
            new_file = base + '.mp3'
            os.rename(out_file, new_file)

    except FileExistsError as e:
        Data.data_insert(f"File already exists in the specified path: {download_path}")


class Data:

    @staticmethod
    def data_clear():
        open('data.txt', 'w').close()

    @staticmethod
    def data_gather():
        with open('data.txt', 'r') as f:
            data = f.readlines()
        return data

    @staticmethod
    def data_def():
        with open('data.txt', 'w') as f:
            f.write('Hey m8 how are you? \nYour processes will be listed here if you do something')

    @staticmethod
    def data_insert(text):
        with open('data.txt', 'a') as f:
            f.write('\n' + text)

    @staticmethod
    def read_json_recover(path):
        with open(path + '/recover.txt', 'r') as f:
            data = [line.strip().split(' ', 1) for line in f.readlines()]
            return [sublist[1].strip("]") for sublist in data if len(sublist) >= 2]

    @staticmethod
    def clear_json_recover():
        open('recover.txt', 'w').close()
