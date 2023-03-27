# region dll

import os
from tkinter import Tk
from tkinter.filedialog import askdirectory, askopenfilename
from flask import *
from utils import Utils, Data
import webview

# endregion

# region app configuration

app = Flask(__name__,template_folder="templates")
window = webview.create_window("Sputyif", app, width=1200, height=950, zoomable=True)

# region variables

music_file_path = None
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg', 'flac'}


# endregion


# endregion

# region index

@app.route("/")
def home():
    Data.data_clear()
    Data.data_def()
    return render_template("Sputyif.html")


# endregion

# region get file/folder

@app.route('/choose_folder')
def choose_folder():
    folder_path = 'not found'
    root = Tk()
    root.withdraw()
    folder_path = askdirectory()
    if folder_path == 'not found':
        root.mainloop()
    else:
        root.destroy()

    if folder_path:
        return jsonify({'folder': folder_path}), 200
    else:
        return jsonify(request.json), 200


@app.route('/choose_json')
def choose_json():
    file_path = 'not found'
    root = Tk()
    root.withdraw()
    file_path = askopenfilename()
    if file_path == 'not found':
        root.mainloop()
    else:
        root.destroy()
    if file_path:
        return jsonify({'json_file': file_path}), 200
    else:
        return jsonify(request.json), 200


@app.route('/choose_cache')
def choose_cache():
    cache_path = 'not found'
    root = Tk()
    root.withdraw()
    cache_path = askopenfilename()
    if cache_path == 'not found':
        root.mainloop()
    else:
        root.destroy()

    if cache_path:
        return jsonify({'file': cache_path}), 200
    else:
        return jsonify(request.json), 200


@app.route('/library')
def get_files():
    folder_path = 'not found'
    root = Tk()
    root.withdraw()
    folder_path = askdirectory()
    if folder_path == 'not found':
        root.mainloop()
    else:
        root.destroy()
    files = []
    if os.path.isdir(folder_path):
        for filename in os.listdir(folder_path):
            extension = os.path.splitext(filename)[1][1:].lower()
            if extension in ALLOWED_EXTENSIONS:
                files.append(filename)
    return jsonify({'files': files, 'folder': folder_path})


# endregion

# region download

@app.route('/download', methods=['POST'])
def start_download():
    link = request.form['link']
    download_format = request.form['format']
    path = request.form['path']
    __type = request.form['type']

    Data.data_clear()
    Data.data_insert('Link : ' + link)
    Data.data_insert('\nFormat : ' + download_format)
    Data.data_insert('\nPath : ' + path)
    Data.data_insert('\nType : ' + __type)

    if __type == 'json':
        Utils.download_json(path, link)
    else:
        Utils.download_song(link, download_format, path)
    Data.data_insert('\nDownload completed')
    return 'Download completed'


# endregion

# region recover/resume

@app.route('/recover', methods=['POST'])
def start_recovery():
    file = request.form['file']
    __type = request.form['type']

    Data.data_clear()
    Data.data_insert('Recovery progress starting...')
    Data.data_insert('\nFile : ' + file)
    Data.data_insert('\nType : ' + __type)

    Utils.resume_download(file, __type)
    Data.data_insert('\nRecovery completed')
    return 'Recovery completed'


# endregion

# region music


@app.route('/get-music', methods=['POST'])
def get_music():
    global music_file_path
    music_file_path = request.form['file']
    song = request.form['song']
    with open(music_file_path + '/' + song, 'rb') as music_file:
        music_data = music_file.read()
    return Response(music_data, mimetype='audio/mpeg')


@app.route('/get-music-info', methods=['POST'])
def get_music_info():
    song = request.form['song']
    base, extension = os.path.splitext(song)
    artist, song = base.split('-', 1)
    artist = artist.strip()
    song = song.strip()
    return jsonify({'artist': artist, 'song': song})


@app.route('/play-music')
def play_music():
    global music_file_path
    if music_file_path is None:
        music_file_path = ""

    with open(music_file_path, 'rb') as music_file:
        music_data = music_file.read()
    return Response(music_data, mimetype='audio/mpeg')


# endregion

# region data.txt

@app.route('/data')
def show_data():
    return {'data': Data.data_gather()}


@app.route('/clear')
def clear_data():
    Data.data_clear()
    return "Data Cleared Successfully"


# endregion

# region app start

if __name__ == '__main__':
    # app.run(debug=True)
    webview.start(private_mode=False)

# endregion
