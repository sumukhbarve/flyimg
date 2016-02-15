(function () {
    "use strict";
    var flyimg = {};
    window.flyimg = flyimg;
    flyimg.assert = function (test, errmsg) {
        if (test) {
            return test;
        }
        window.alert(errmsg);
        throw new Error(errmsg);
    };
    flyimg.computeExcess = function (img) {
        // Returns the no. of excess pixels in an image.
        var dw = img.naturalWidth - img.width,
            dh = img.naturalHeight - img.height;
        if (dw >= 0 && dh >= 0) {
            return dw * dh;
        }
        //flyimg.assert(false, "dw and dh must be non-negative.");
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
    flyimg.roundUpToDivBy = function (divisor, number) {
        var i;
        for (i = Math.ceil(number); i < number + divisor; i += 1) {
            if (i % divisor === 0) {
                return i;
            }
        }
        flyimg.assert(false, "Couldn't round up " + number);
    };
    flyimg.getMaxWidth = function (img) {
        var strMaxWidth = window.getComputedStyle(img)["max-width"],
            strParentWidth, percentage, parentWidth;
        if (strMaxWidth.endsWith("px")) {
            return Number(strMaxWidth.slice(0, -2));            // Shave off "px".
        } else if (strMaxWidth.endsWith("%")) {
            percentage = Number(strMaxWidth.slice(0, -1));
            strParentWidth = window.getComputedStyle(img.parentElement)["width"];
            parentWidth = Number(strParentWidth.slice(0, -2));  // Shave off "px".
            return parentWidth * (percentage/100);
        }
        flyimg.assert("false", "Unreachable code.");
    };
    //flyimg.endpoint = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy";
    flyimg.endpoint = "http://localhost:8080/api/v001/resize";
    flyimg.flyOne = function (img) {
        var dataSrc = img.getAttribute("data-src"),
            maxWidth = flyimg.getMaxWidth(img),
            resize_w = flyimg.roundUpToDivBy(10, maxWidth),
            src = flyimg.endpoint + "?" +
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
    flyimg.autoFlyOnResize = function () {
        window.addEventListener("resize", flyimg.flyAll);
    };
}());
