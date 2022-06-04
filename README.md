# Spotify Download Manager
#### by [cosmohacker](https://github.com/cosmohacker)
###### [Follow Me On Spotify](https://open.spotify.com/user/217cixzitjjw52l67325r3ypi?si=688baa4151194411)

[![Spoytif Logo](https://raw.githubusercontent.com/cosmohacker/github-components/main/spoytif.png "Spoytif Logo")](https://github.com/cosmohacker/SpoytifDownloadManager "Spoytif Logo")

# Features

- You can download your Spotify albums easily.
- It's free. (I think we can count this as feature)

Table of contents
=================

<!--ts-->
   * [Spotify Download Manager](#spotify-download-manager)
      * [by cosmohacker](#by-cosmohacker)
        * [Follow Me On Spotify](#follow-me-on-spotify)
   * [Features](#features)
   * [Installation](#installation)
      * [Linux](#linux)
      * [Windows](#windows)
   * [Usage](#usage)
      * [Possible Errors in Linux](#possible-errors-in-linux)
        * [How To Fix](#how-to-fix)
<!--te-->

# Installation

###### How to download pip for dummies
- [Windows](https://www.google.com/search?q=how+to+install+pip+windows&ei=GP2ZYrbrNs2Qxc8PzsqFqAU&ved=0ahUKEwi219TxopH4AhVNSPEDHU5lAVUQ4dUDCA0&uact=5&oq=how+to+install+pip+windows&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgYIABAeEBYyBggAEB4QFjIGCAAQHhAWMgYIABAeEBYyBggAEB4QFjIGCAAQHhAWOgcIABBHELADOgcIABCwAxBDSgQIQRgASgQIRhgAUJ6SA1jqmQNgraIDaARwAXgAgAHZAogB2AySAQcwLjMuMy4xmAEAoAEByAEKwAEB&sclient=gws-wiz)
- [Linux](https://www.google.com/search?q=how+to+install+pip+linux&ei=_fyZYtmDJNKWxc8P78GGoAM&ved=0ahUKEwiZ9tHkopH4AhVSS_EDHe-gATQQ4dUDCA0&uact=5&oq=how+to+install+pip+linux&gs_lcp=Cgdnd3Mtd2l6EAMyBAgAEEMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBggAEB4QFjIGCAAQHhAWMgYIABAeEBY6BwgAEEcQsAM6CgguENQCELADEEM6BwgAELADEENKBAhBGABKBAhGGABQkAVYqApg4QtoAXABeACAAa8DiAH6CJIBBTMtMi4xmAEAoAEByAEKwAEB&sclient=gws-wiz)

### [Linux](https://c.tenor.com/epNMHGvRyHcAAAAd/gigachad-chad.gif)
    sudo git clone https://github.com/cosmohacker/SpotifyDownloadManager
    cd SpoytifDownloadManager
    pip install -r requirements.txt
    python3 spoytif.py

### [Windows](https://www.dictionary.com/e/slang/normie/)
```shell
git clone https://github.com/cosmohacker/SpotifyDownloadManager
cd SpoytifDownloadManager
pip install -r /path/to/requirements.txt
py spoytif.py / python3 spoytif.py/ python spoytif.py
```

# Usage

1. First you need to go [Spotify Account](https://www.spotify.com/tr/account/overview/?utm_source=spotify&utm_medium=menu&utm_campaign=your_account)
2. After that click [Privacy](https://www.spotify.com/tr/account/privacy/)
3. You will see Download Your Data section at the end of page.
4. Request your data from Spotify.
5. After Download your Spotify data unzip my_spotify_data.zip.
6. When unzipping its done you will see .json file types (ex:Playlist1.json/Playlist2.json).
When all this  steps is completed you can start program by typing in project folder : 

```shell
python3 spoytif.py
```
Example Usage of Program 	:arrow_heading_down:
```shell
Please Choose Process Type [Download Via Json - 1| Download Via Link/Name - 2]
2
spotdl version :
1
3.9.6
Please Choose Process Type [Download Song - 1 | Playlist - 2 ]: 
Please Enter Song Name For Download : 
Shadow Chromatics
Please Enter Download Location : 
/home/cosmohacker/Music/
Will download to: /home/cosmohacker/Music
Searching Spotify for song named "Shadow Chromatics"...
Found YouTube URL for "Chromatics - Shadow" : https://www.youtube.com/watch?v=2Hwp0tA7IAM

Chromatics - Shadow      Done               ━━━━━━━━━━━━━━━━━━━━━━━ 100% 0:00:00

Process finished with exit code 0

Please Choose Process Type [Download Via Json - 1 | Download Via Link/Name - 2]
1

Please enter your .json file path EX:Path/file_name.json :
/media/cosmohacker/cosmohacker/Spotify/MyData/Playlist1.json
Randomize
Electronic
Classical
Turkish
A.R.E.
Atlas
OST
Please type one of the above for download : 
Randomize
Please type download path : 
/home/cosmohacker/Music/
```



## Possible Errors in Linux

```shell
Traceback (most recent call last):
  File "/home/cosmohacker/.local/lib/python3.9/site-packages/pytube/__main__.py", line 181, in fmt_streams
    extract.apply_signature(stream_manifest, self.vid_info, self.js)
  File "/home/cosmohacker/.local/lib/python3.9/site-packages/pytube/extract.py", line 409, in apply_signature
    cipher = Cipher(js=js)
  File "/home/cosmohacker/.local/lib/python3.9/site-packages/pytube/cipher.py", line 33, in __init__
    raise RegexMatchError(
pytube.exceptions.RegexMatchError: __init__: could not find match for ^\w+\W

```
### How to fix
1. Open /pytube/cipher.py in your editor then change this row : 

```python
var_regex = re.compile(r"^\w+\W")
```
> into

```python
var_regex = re.compile(r"^\$*\w+\W")
```
