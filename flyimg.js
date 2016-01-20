(function () {
    "use strict";
    var flyimg = {};
    window.flyimg = flyimg;
    flyimg.computeExcess = function (img) {
        // Returns the no. of excess pixels in an image.
        var dw = img.naturalWidth - img.width,
            dh = img.naturalHeight - img.height;
        if (dw > 0 && dh > 0) {
            return dw * dh;
        }
    };
    flyimg.alertExcess = function (img) {
        // Alerts the no. of excess pixels in an image.
        var excess = flyimg.computeExcess(img);
        window.alert("Excess Pixels (EP) = " + excess);
        return null;
    };
    flyimg.computeTotalExcess = function () {
        // Returns the no. of excess pixels across all images.
        var imgs = document.querySelectorAll("img");
        imgs = Array.prototype.slice.call(imgs);
        return imgs.reduce(function (acc, img) {
            return acc + flyimg.computeExcess(img);
        }, 0);
    };
    flyimg.alertTotalExcess = function () {
        // Alerts the no. of excess pixels across all images.
        var excess = flyimg.computeTotalExcess();
        window.alert("Total Excess Pixels (TEP) = " + excess);
        return null;
    };
    flyimg.assert = function (test, errmsg) {
        if (test) {
            return test;
        }
        window.alert(errmsg);
        throw new Error(errmsg);
    };
    flyimg.roundUpToDivBy = function (divisor, number) {
        var i;
        for (i = number; i < number + divisor; i += 1) {
            if (i % divisor === 0) {
                return i;
            }
        }
        flyimg.assert(false, "Couln't round up " + number);
    };
    flyimg.getMaxWidth = function (img) {
        var s = window.getComputedStyle(img)["max-width"],
            s2;
            percent, parentWidth;
        if (s.endsWith("px")) {
            return Number(s.slice(0, -2));
        } else if (s.endsWith("%")) {
            percent = Number(s.slice(0, -1));
            s2 = window.getComputedStyle(img.parentElement)["width"];
            parentWidth = Number(s2.slice(0, -2)); //Shave off 'px'
            return parentWidth * (percent/100);
        }
        return img;
    };
    flyimg.baseURL = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy";
    flyimg.flyOne = function (img) {
        var dataSrc = img.getAttribute("data-src"),
            maxWidth = flyimg.getMaxWidth(img),
            resize_w = flyimg.roundUpToDivBy(10, maxWidth),
            src = flyimg.baseURL + "?" +
                "url=" + encodeURIComponent(dataSrc) + "&" +
                "resize_w=" + resize_w + "&" +
                "container=focus&refresh=600000";
        img.setAttribute("src", src);
        return img;
    };
    flyimg.flyAll = function () {
        var imgs = document.querySelectorAll("img");
        imgs = Array.prototype.slice.call(imgs);
        imgs.forEach(flyimg.flyOne);
    };
}());
