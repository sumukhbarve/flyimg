import bottle;
import PIL;
from PIL import Image;
import urllib2;
import os;

#### CONSTANTS #############################################

SERVER_DIR = os.path.abspath(".");
IMAGES_DIR = os.path.join(SERVER_DIR, "images");

#### WSGI HELPERS ##########################################

def serveImage(filename):
    "Helps serve images from the `IMAGES_DIR` directory.";
    return bottle.static_file(filename, IMAGES_DIR);

def getParams(paramNamesStr):
    "Given a string of space separated paramnames, gets them."
    paramNames = paramNamesStr.split();
    d = bottle.request.query; # Assuming "GET" request.
    if (bottle.request.method == "POST"):
        d = bottle.request.forms;
    return map(d.get, paramNames);

#### IMAGE HELPERS #########################################

def buildMFilename(url):
    "Given a url, returns filename for the master file."
    return "m_" + urllib2.quote(url, safe="");

def downloadImage(srcUrl, dstPath):
    "Downloads resource at srcUrl and saves to dstPath."
    resource = urllib2.urlopen(srcUrl);
    with open(dstPath, "wb") as f:
        f.write(resource.read());
    return None;

def ensureMImage(url):
    "Given a url, ensures that the master files exists."
    mFilename = buildMFilename(url);
    mFilepath = os.path.join(IMAGES_DIR, mFilename);
    if not os.path.isfile(mFilepath):
        downloadImage(url, mFilepath);
    return mFilename;

def ensureSImage(url, resize_w, resize_h):
    "Ensures that the required slave image exists."
    mFilename = buildMFilename(url);
    mFilepath = os.path.join(IMAGES_DIR, mFilename);
    mImage = Image.open(mFilepath);
    w, h = map(float, mImage.size);
    if (resize_w and resize_h):         # BOTH
        # ==> Resizing already complete.
        pass;
    elif (resize_w and not resize_h):   # Only WIDTH
        resize_h = int(h * (resize_w / w));
    elif (not resize_w and resize_h):   # Only HEIGHT
        resize_w = int(w * (resize_h / h));
    else:                               # NEITHER
        # ==> No resizing ==> sFilename is mFilename.
        return mFilename;
    # ==> At least one resizing parameter supplied:
    sPrefix = "s_%sx%s_" % (resize_w, resize_h);
    sFilename = sPrefix + urllib2.quote(url, safe="");
    sFilepath = os.path.join(IMAGES_DIR, sFilename);
    if not os.path.isfile(sFilepath):
        sImage = mImage.resize((resize_w, resize_h));
        sImage.save(sFilepath);
    return sFilename;

#### WSGI APPLICATION #####################################

app = bottle.Bottle();

@app.route("/")
def route_slash():
    return "<h2><code>flyImg<small>.js</small></code></h2>";

@app.route("/api/v001/resize")
def route_api_v001():
    url, resize_w, resize_h = getParams("""
    url  resize_w  resize_h""");
    resize_w, resize_h = map(int, [resize_w or 0, resize_h or 0]);
    mFilename = ensureMImage(url);
    sFilename = ensureSImage(url, resize_w, resize_h);
    print "sFilename = " + sFilename;
    return serveImage(sFilename);  

if __name__ == "__main__":
    app.run(debug=True, reloader=True);
