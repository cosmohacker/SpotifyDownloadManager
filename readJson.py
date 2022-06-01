import os
import re
import urllib.request
import sys

import ijson
import numpy as np
from pytube import YouTube

def listAlbumNames(json_filename):
    with open(json_filename, 'rb') as data:
        for obj in ijson.items(data, 'playlists.item.name'):
            listName = obj
            print(listName)


print("Please enter your .json file path EX:Path/file_name.json : ")
file_path = input()
json_filename = file_path
assert os.path.exists(file_path), "I did not find the file at, " + str(file_path)
f = open(file_path, 'r+')
f.close()
listAlbumNames(json_filename)

print("\nPlease type one of the above for download : ")
albumInput = input()
listName = albumInput

print("Please type download path : ")
download_path = input()


def jsonHierarchy(json_filename):
    with open(json_filename, 'rb') as input_file:
        # load json iteratively
        parser = ijson.parse(input_file)
        for prefix, event, value in parser:
            print('prefix={}, event={}, value={}'.format(prefix, event, value))


def getTracks(listName, json_filename):
    count = -1
    input = []
    with open(json_filename, 'rb') as file:
        parser = ijson.parse(file)
        for prefix, event, value in parser:
            if event == 'start_map':
                # reach the start of an object
                # reset variables
                value1 = value2 = 0
            elif event == 'end_map':
                # reach the end of an object
                if value3 == listName:
                    count += 1
                    input.insert(count, [value3, value1 + " " + value2])
                continue
            if prefix.endswith('.trackName'):
                value1 = value
            elif prefix.endswith('.artistName'):
                value2 = value
            elif prefix.endswith('.name'):
                value3 = value

    # print("\nBefore : \n")

    # for x in input:
    # print(x, end="\n")

    # print("\nAfter : \n")

    an_array = np.array(input)
    coordskeys = np.array(list(set([tuple(x) for x in an_array])))
    # print(np.size(coordskeys))
    # print(*coordskeys, sep=', ')

    for iy, ix in np.ndindex(coordskeys.shape):
        if ix != 0:
            # print("\n" + coordskeys[iy, ix])
            findVideoAndAdd(coordskeys[iy, ix])


def findVideoAndAdd(videoname):
    # videoName = coordskeys[0, 1] + " " + coordskeys[0, 2]
    videoName = videoname
    print(videoName)
    changeSpaces = videoName.replace(" ", "+")
    unicode =''.join([i if ord(i) < 128 else '' for i in changeSpaces])

    html = urllib.request.urlopen("https://www.youtube.com/results?search_query=" + unicode)
    video_ids = re.findall(r"watch\?v=(\S{11})", html.read().decode())
    ytLink = "https://www.youtube.com/watch?v=" + video_ids[0]
    print(ytLink)
    downloadFromYoutube(ytLink)
    # print("https://www.youtube.com/watch?v=" + video_ids[0])


def downloadFromYoutube(youtubeURL):
    yt = YouTube(str(youtubeURL))
    video = yt.streams.filter(only_audio=True).first()
    destination = download_path
    out_file = video.download(output_path=destination)
    base, ext = os.path.splitext(out_file)
    new_file = base + '.mp3'
    os.rename(out_file, new_file)


getTracks(listName, json_filename)
