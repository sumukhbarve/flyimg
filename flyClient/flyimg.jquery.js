(function ($) {
    var fi = {},        // Short for flyimg, private reference.
        pvt = {};
    
    $.fn.flyimg = function (action, options) {
        return fi[action](this, options || {});
    };
    
    pvt.computeExcessPixels = function (img) {
        var dw = img.naturalWidth - img.width
            dh = img.naturalHeight - img.height;
        if (dw > 0 && dh > 0) { return dw * dh; }
        return 0;
    };
    fi.computeExcessPixels = function ($img, opts) {
        return pvt.computeExcessPixels($img.get(0));
    };
    fi.computeTotalExcessPixels = function ($coll, opts) {
        var total = 0;
        $coll.each(function (i, img) {
            total += pvt.computeExcessPixels(img);
        });
        return total;
    };
    
    pvt.baseUrl = "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy";
    pvt.roundToDivBy = function (div, num) {
        while (num % div !== 0) {
            console.log("num = " + num + " div = " + div);
            num += 1;
        }
        return num;
    };
    pvt.getMaxWidth = function ($elm) {
        var s = $elm.css("max-width"), p;
        if (s.endsWith("px")) {
            return Number(s.slice(0, s.length - 2));
        } else if (s.endsWith("%")) {
            p = Number(s.slice(0, s.length - 1));
            return $elm.parent().width() * (p/100);
        }
        alert("Error... couldn't get max-width");
        return 100;
    };
    fi.render = function ($img, opts) {
        var dataSrc = $img.attr("data-src"),
            maxWidth = pvt.getMaxWidth($img),
            resize_w = pvt.roundToDivBy(10, maxWidth);
            src = pvt.baseUrl + "?" + $.param({
                url: dataSrc,
                container: "focus",
                refresh: 100,
                resize_w: resize_w//,
            });
        $img.attr("src", src);
    };
    fi.renderAll = function ($imgs, opts) {
        $imgs.each(function (i, img) {
            $img = $(img);
            fi.render($img, {});
        });
    };
    
    
    //Debug:
    window.fi = fi; window.pvt = pvt;
}(jQuery));
