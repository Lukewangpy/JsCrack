var _zh;
var _encrypt;
window = this;
window.navigator =  {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
};

!function(e) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function base64encode(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }

    function base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1) break;
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1) break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1) break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }

    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    function utf8to16(str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }

    function CharToHex(str) {
        var out, i, len, c, h;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            h = c.toString(16);
            if (h.length < 2) h = "0" + h;
            out += "\\x" + h + " ";
            if (i > 0 && i % 8 == 0) out += "\r\n";
        }
        return out;
    }
    this.atob = base64decode, this.btoa = base64encode;
}(this);

!function() {
    "use strict";
    function t(e) {
        return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.A ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    var A = "2.0"
      , __g = {};
    function s() {}
    function i(e) {
        this.t = (2048 & e) >> 11,
        this.s = (1536 & e) >> 9,
        this.i = 511 & e,
        this.h = 511 & e
    }
    function h(e) {
        this.s = (3072 & e) >> 10,
        this.h = 1023 & e
    }
    function a(e) {
        this.a = (3072 & e) >> 10,
        this.c = (768 & e) >> 8,
        this.n = (192 & e) >> 6,
        this.t = 63 & e
    }
    function c(e) {
        this.s = e >> 10 & 3,
        this.i = 1023 & e
    }
    function n() {}
    function e(e) {
        this.a = (3072 & e) >> 10,
        this.c = (768 & e) >> 8,
        this.n = (192 & e) >> 6,
        this.t = 63 & e
    }
    function o(e) {
        this.h = (4095 & e) >> 2,
        this.t = 3 & e
    }
    function r(e) {
        this.s = e >> 10 & 3,
        this.i = e >> 2 & 255,
        this.t = 3 & e
    }
    s.prototype.e = function(e) {
        e.o = !1
    }
    ,
    i.prototype.e = function(e) {
        switch (this.t) {
        case 0:
            e.r[this.s] = this.i;
            break;
        case 1:
            e.r[this.s] = e.k[this.h]
        }
    }
    ,
    h.prototype.e = function(e) {
        e.k[this.h] = e.r[this.s]
    }
    ,
    a.prototype.e = function(e) {
        switch (this.t) {
        case 0:
            e.r[this.a] = e.r[this.c] + e.r[this.n];
            break;
        case 1:
            e.r[this.a] = e.r[this.c] - e.r[this.n];
            break;
        case 2:
            e.r[this.a] = e.r[this.c] * e.r[this.n];
            break;
        case 3:
            e.r[this.a] = e.r[this.c] / e.r[this.n];
            break;
        case 4:
            e.r[this.a] = e.r[this.c] % e.r[this.n];
            break;
        case 5:
            e.r[this.a] = e.r[this.c] == e.r[this.n];
            break;
        case 6:
            e.r[this.a] = e.r[this.c] >= e.r[this.n];
            break;
        case 7:
            e.r[this.a] = e.r[this.c] || e.r[this.n];
            break;
        case 8:
            e.r[this.a] = e.r[this.c] && e.r[this.n];
            break;
        case 9:
            e.r[this.a] = e.r[this.c] !== e.r[this.n];
            break;
        case 10:
            e.r[this.a] = t(e.r[this.c]);
            break;
        case 11:
            e.r[this.a] = e.r[this.c]in e.r[this.n];
            break;
        case 12:
            e.r[this.a] = e.r[this.c] > e.r[this.n];
            break;
        case 13:
            e.r[this.a] = -e.r[this.c];
            break;
        case 14:
            e.r[this.a] = e.r[this.c] < e.r[this.n];
            break;
        case 15:
            e.r[this.a] = e.r[this.c] & e.r[this.n];
            break;
        case 16:
            e.r[this.a] = e.r[this.c] ^ e.r[this.n];
            break;
        case 17:
            e.r[this.a] = e.r[this.c] << e.r[this.n];
            break;
        case 18:
            e.r[this.a] = e.r[this.c] >>> e.r[this.n];
            break;
        case 19:
            e.r[this.a] = e.r[this.c] | e.r[this.n];
            break;
        case 20:
            e.r[this.a] = !e.r[this.c]
        }
    }
    ,
    c.prototype.e = function(e) {
        e.Q.push(e.C),
        e.B.push(e.k),
        e.C = e.r[this.s],
        e.k = [];
        for (var t = 0; t < this.i; t++)
            e.k.unshift(e.f.pop());
        e.g.push(e.f),
        e.f = []
    }
    ,
    n.prototype.e = function(e) {
        e.C = e.Q.pop(),
        e.k = e.B.pop(),
        e.f = e.g.pop()
    }
    ,
    e.prototype.e = function(e) {
        switch (this.t) {
        case 0:
            e.u = e.r[this.a] >= e.r[this.c];
            break;
        case 1:
            e.u = e.r[this.a] <= e.r[this.c];
            break;
        case 2:
            e.u = e.r[this.a] > e.r[this.c];
            break;
        case 3:
            e.u = e.r[this.a] < e.r[this.c];
            break;
        case 4:
            e.u = e.r[this.a] == e.r[this.c];
            break;
        case 5:
            e.u = e.r[this.a] != e.r[this.c];
            break;
        case 6:
            e.u = e.r[this.a];
            break;
        case 7:
            e.u = !e.r[this.a]
        }
    }
    ,
    o.prototype.e = function(e) {
        switch (this.t) {
        case 0:
            e.C = this.h;
            break;
        case 1:
            e.u && (e.C = this.h);
            break;
        case 2:
            e.u || (e.C = this.h);
            break;
        case 3:
            e.C = this.h,
            e.w = null
        }
        e.u = !1
    }
    ,
    r.prototype.e = function(e) {
        switch (this.t) {
        case 0:
            for (var t = [], n = 0; n < this.i; n++)
                t.unshift(e.f.pop());
            e.r[3] = e.r[this.s](t[0], t[1]);
            break;
        case 1:
            for (var r = e.f.pop(), o = [], i = 0; i < this.i; i++)
                o.unshift(e.f.pop());
            e.r[3] = e.r[this.s][r](o[0], o[1]);
            break;
        case 2:
            for (var a = [], c = 0; c < this.i; c++)
                a.unshift(e.f.pop());
            e.r[3] = new e.r[this.s](a[0],a[1])
        }
    }
    ;
    var k = function(e) {
        for (var t = 66, n = [], r = 0; r < e.length; r++) {
            var o = 24 ^ e.charCodeAt(r) ^ t;
            n.push(String.fromCharCode(o)),
            t = o
        }
        return n.join("")
    };
    function Q(e) {
        this.t = (4095 & e) >> 10,
        this.s = (1023 & e) >> 8,
        this.i = 1023 & e,
        this.h = 63 & e
    }
    function C(e) {
        this.t = (4095 & e) >> 10,
        this.a = (1023 & e) >> 8,
        this.c = (255 & e) >> 6
    }
    function B(e) {
        this.s = (3072 & e) >> 10,
        this.h = 1023 & e
    }
    function f(e) {
        this.h = 4095 & e
    }
    function g(e) {
        this.s = (3072 & e) >> 10
    }
    function u(e) {
        this.h = 4095 & e
    }
    function w(e) {
        this.t = (3840 & e) >> 8,
        this.s = (192 & e) >> 6,
        this.i = 63 & e
    }
    function G() {
        this.r = [0, 0, 0, 0],
        this.C = 0,
        this.Q = [],
        this.k = [],
        this.B = [],
        this.f = [],
        this.g = [],
        this.u = !1,
        this.G = [],
        this.b = [],
        this.o = !1,
        this.w = null,
        this.U = null,
        this.F = [],
        this.R = 0,
        this.J = {
            0: s,
            1: i,
            2: h,
            3: a,
            4: c,
            5: n,
            6: e,
            7: o,
            8: r,
            9: Q,
            10: C,
            11: B,
            12: f,
            13: g,
            14: u,
            15: w
        }
    }
    Q.prototype.e = function(e) {
        switch (this.t) {
        case 0:
            e.f.push(e.r[this.s]);
            break;
        case 1:
            e.f.push(this.i);
            break;
        case 2:
            e.f.push(e.k[this.h]);
            break;
        case 3:
            e.f.push(k(e.b[this.h]))
        }
    }
    ,
    C.prototype.e = function(A) {
        switch (this.t) {
        case 0:
            var t = A.f.pop();
            if(t == "length" && typeof(A.f[1])=='string'){
                var temp = A.f[1].slice(1);
                A.r[0] = temp;
                A.k[0] = temp;
                A.f = [window, 42];
            }
            A.r[this.a] = A.r[this.c][t];
            break;
        case 1:
            var s = A.f.pop()
              , i = A.f.pop();
            A.r[this.c][s] = i;
            break;
        case 2:
            var h = A.f.pop();
            A.r[this.a] = eval(h)
        }
    }
    ,
    B.prototype.e = function(e) {
        e.r[this.s] = k(e.b[this.h])
    }
    ,
    f.prototype.e = function(e) {
        e.w = this.h
    }
    ,
    g.prototype.e = function(e) {
        throw e.r[this.s]
    }
    ,
    u.prototype.e = function(e) {
        var t = this
          , n = [0];
        e.k.forEach(function(e) {
            n.push(e)
        });
        var r = function(r) {
            var o = new G;
            return o.k = n,
            o.k[0] = r,
            o.v(e.G, t.h, e.b, e.F),
            o.r[3]
        };
        r.toString = function() {
            return "() { [native code] }"
        }
        ,
        e.r[3] = r
    }
    ,
    w.prototype.e = function(e) {
        switch (this.t) {
        case 0:
            for (var t = {}, n = 0; n < this.i; n++) {
                var r = e.f.pop();
                t[e.f.pop()] = r
            }
            e.r[this.s] = t;
            break;
        case 1:
            for (var o = [], i = 0; i < this.i; i++)
                o.unshift(e.f.pop());
            e.r[this.s] = o
        }
    }
    ,
    G.prototype.D = function(e) {
        for (var t = atob(e), n = t.charCodeAt(0) << 8 | t.charCodeAt(1), r = [], o = 2; o < n + 2; o += 2)
            r.push(t.charCodeAt(o) << 8 | t.charCodeAt(o + 1));
        this.G = r;
        for (var i = [], a = n + 2; a < t.length; ) {
            var c = t.charCodeAt(a) << 8 | t.charCodeAt(a + 1)
              , s = t.slice(a + 2, a + 2 + c);
            i.push(s),
            a += c + 2
        }
        this.b = i
    }
    ,
    G.prototype.v = function(e, t, n) {
        for (t = t || 0,
        n = n || [],
        this.C = t,
        "string" == typeof e ? this.D(e) : (this.G = e,
        this.b = n),
        this.o = !0,
        this.R = Date.now(); this.o; ) {
            var r = this.G[this.C++];
            if ("number" != typeof r)
                break;
            var o = Date.now();
//             if (500 < o - this.R)
//                 return;
            this.R = o;
            //try {
                this.e(r)
            //} catch (e) {
            //    this.U = e,
            //    this.w && (this.C = this.w)
            //}
        }
    }
    ,
    G.prototype.e = function(e) {
        var t = (61440 & e) >> 12;
        new this.J[t](e).e(this)
    }
    ,
    "undefined" != typeof window && (new G).v("AxjgB5MAnACoAJwBpAAAABAAIAKcAqgAMAq0AzRJZAZwUpwCqACQACACGAKcBKAAIAOcBagAIAQYAjAUGgKcBqFAuAc5hTSHZAZwqrAIGgA0QJEAJAAYAzAUGgOcCaFANRQ0R2QGcOKwChoANECRACQAsAuQABgDnAmgAJwMgAGcDYwFEAAzBmAGcSqwDhoANECRACQAGAKcD6AAGgKcEKFANEcYApwRoAAxB2AGcXKwEhoANECRACQAGAKcE6AAGgKcFKFANEdkBnGqsBUaADRAkQAkABgCnBagAGAGcdKwFxoANECRACQAGAKcGKAAYAZx+rAZGgA0QJEAJAAYA5waoABgBnIisBsaADRAkQAkABgCnBygABoCnB2hQDRHZAZyWrAeGgA0QJEAJAAYBJwfoAAwFGAGcoawIBoANECRACQAGAOQALAJkAAYBJwfgAlsBnK+sCEaADRAkQAkABgDkACwGpAAGAScH4AJbAZy9rAiGgA0QJEAJACwI5AAGAScH6AAkACcJKgAnCWgAJwmoACcJ4AFnA2MBRAAMw5gBnNasCgaADRAkQAkABgBEio0R5EAJAGwKSAFGACcKqAAEgM0RCQGGAYSATRFZAZzshgAtCs0QCQAGAYSAjRFZAZz1hgAtCw0QCQAEAAgB7AtIAgYAJwqoAASATRBJAkYCRIANEZkBnYqEAgaBxQBOYAoBxQEOYQ0giQKGAmQABgAnC6ABRgBGgo0UhD/MQ8zECALEAgaBxQBOYAoBxQEOYQ0gpEAJAoYARoKNFIQ/zEPkAAgChgLGgkUATmBkgAaAJwuhAUaCjdQFAg5kTSTJAsQCBoHFAE5gCgHFAQ5hDSCkQAkChgBGgo0UhD/MQ+QACAKGAsaCRQCOYGSABoAnC6EBRoKN1AUEDmRNJMkCxgFGgsUPzmPkgAaCJwvhAU0wCQFGAUaCxQGOZISPzZPkQAaCJwvhAU0wCQFGAUaCxQMOZISPzZPkQAaCJwvhAU0wCQFGAUaCxQSOZISPzZPkQAaCJwvhAU0wCQFGAkSAzRBJAlz/B4FUAAAAwUYIAAIBSITFQkTERwABi0GHxITAAAJLwMSGRsXHxMZAAk0Fw8HFh4NAwUABhU1EBceDwAENBcUEAAGNBkTGRcBAAFKAAkvHg4PKz4aEwIAAUsACDIVHB0QEQ4YAAsuAzs7AAoPKToKDgAHMx8SGQUvMQABSAALORoVGCQgERcCAxoACAU3ABEXAgMaAAsFGDcAERcCAxoUCgABSQAGOA8LGBsPAAYYLwsYGw8AAU4ABD8QHAUAAU8ABSkbCQ4BAAFMAAktCh8eDgMHCw8AAU0ADT4TGjQsGQMaFA0FHhkAFz4TGjQsGQMaFA0FHhk1NBkCHgUbGBEPAAFCABg9GgkjIAEmOgUHDQ8eFSU5DggJAwEcAwUAAUMAAUAAAUEADQEtFw0FBwtdWxQTGSAACBwrAxUPBR4ZAAkqGgUDAwMVEQ0ACC4DJD8eAx8RAAQ5GhUYAAFGAAAABjYRExELBAACWhgAAVoAQAg/PTw0NxcQPCQ5C3JZEBs9fkcnDRcUAXZia0Q4EhQgXHojMBY3MWVCNT0uDhMXcGQ7AUFPHigkQUwQFkhaAkEACjkTEQspNBMZPC0ABjkTEQsrLQ==");
    var b = function(e) {
        return __g._encrypt(encodeURIComponent(e))
    };
    window.ENCRYPT_VERSION = A,
    _encrypt = b
}()

!function (e) {
    var n = {};
    function i(t) {
        if (n[t])
            return n[t].exports;
        var r = n[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(r.exports, r, r.exports, i),
        r.l = !0,
        r.exports
    }
    _zh = i;
}({
	"1667": function(e, t, n) {
        "use strict";
        var a;
        !function(r) {
            function i(e, t, n) {
                var a, r, i, o, s, c, l, u, A, C = 0, b = [], v = 0, E = !1, w = [], S = [], I = !1, O = !1;
                if (a = (n = n || {}).encoding || "UTF8",
                A = n.numRounds || 1,
                i = m(t, a),
                A !== parseInt(A, 10) || 1 > A)
                    throw Error("numRounds must a integer >= 1");
                if ("SHA-1" === e)
                    s = 512,
                    c = x,
                    l = H,
                    o = 160,
                    u = function(e) {
                        return e.slice()
                    }
                    ;
                else if (0 === e.lastIndexOf("SHA-", 0))
                    if (c = function(t, n) {
                        return q(t, n, e)
                    }
                    ,
                    l = function(t, n, a, r) {
                        var i, o;
                        if ("SHA-224" === e || "SHA-256" === e)
                            i = 15 + (n + 65 >>> 9 << 4),
                            o = 16;
                        else {
                            if ("SHA-384" !== e && "SHA-512" !== e)
                                throw Error("Unexpected error in SHA-2 implementation");
                            i = 31 + (n + 129 >>> 10 << 5),
                            o = 32
                        }
                        for (; t.length <= i; )
                            t.push(0);
                        for (t[n >>> 5] |= 128 << 24 - n % 32,
                        n += a,
                        t[i] = 4294967295 & n,
                        t[i - 1] = n / 4294967296 | 0,
                        a = t.length,
                        n = 0; n < a; n += o)
                            r = q(t.slice(n, n + o), r, e);
                        if ("SHA-224" === e)
                            t = [r[0], r[1], r[2], r[3], r[4], r[5], r[6]];
                        else if ("SHA-256" === e)
                            t = r;
                        else if ("SHA-384" === e)
                            t = [r[0].a, r[0].b, r[1].a, r[1].b, r[2].a, r[2].b, r[3].a, r[3].b, r[4].a, r[4].b, r[5].a, r[5].b];
                        else {
                            if ("SHA-512" !== e)
                                throw Error("Unexpected error in SHA-2 implementation");
                            t = [r[0].a, r[0].b, r[1].a, r[1].b, r[2].a, r[2].b, r[3].a, r[3].b, r[4].a, r[4].b, r[5].a, r[5].b, r[6].a, r[6].b, r[7].a, r[7].b]
                        }
                        return t
                    }
                    ,
                    u = function(e) {
                        return e.slice()
                    }
                    ,
                    "SHA-224" === e)
                        s = 512,
                        o = 224;
                    else if ("SHA-256" === e)
                        s = 512,
                        o = 256;
                    else if ("SHA-384" === e)
                        s = 1024,
                        o = 384;
                    else {
                        if ("SHA-512" !== e)
                            throw Error("Chosen SHA variant is not supported");
                        s = 1024,
                        o = 512
                    }
                else {
                    if (0 !== e.lastIndexOf("SHA3-", 0) && 0 !== e.lastIndexOf("SHAKE", 0))
                        throw Error("Chosen SHA variant is not supported");
                    var B = 6;
                    if (c = J,
                    u = function(e) {
                        var t, n = [];
                        for (t = 0; 5 > t; t += 1)
                            n[t] = e[t].slice();
                        return n
                    }
                    ,
                    "SHA3-224" === e)
                        s = 1152,
                        o = 224;
                    else if ("SHA3-256" === e)
                        s = 1088,
                        o = 256;
                    else if ("SHA3-384" === e)
                        s = 832,
                        o = 384;
                    else if ("SHA3-512" === e)
                        s = 576,
                        o = 512;
                    else if ("SHAKE128" === e)
                        s = 1344,
                        o = -1,
                        B = 31,
                        O = !0;
                    else {
                        if ("SHAKE256" !== e)
                            throw Error("Chosen SHA variant is not supported");
                        s = 1088,
                        o = -1,
                        B = 31,
                        O = !0
                    }
                    l = function(e, t, n, a, r) {
                        var i, o = B, c = [], l = (n = s) >>> 5, u = 0, d = t >>> 5;
                        for (i = 0; i < d && t >= n; i += l)
                            a = J(e.slice(i, i + l), a),
                            t -= n;
                        for (e = e.slice(i),
                        t %= n; e.length < l; )
                            e.push(0);
                        for (e[(i = t >>> 3) >> 2] ^= o << 24 - i % 4 * 8,
                        e[l - 1] ^= 128,
                        a = J(e, a); 32 * c.length < r && (e = a[u % 5][u / 5 | 0],
                        c.push((255 & e.b) << 24 | (65280 & e.b) << 8 | (16711680 & e.b) >> 8 | e.b >>> 24),
                        !(32 * c.length >= r)); )
                            c.push((255 & e.a) << 24 | (65280 & e.a) << 8 | (16711680 & e.a) >> 8 | e.a >>> 24),
                            0 == 64 * (u += 1) % n && J(null, a);
                        return c
                    }
                }
                r = L(e),
                this.setHMACKey = function(t, n, i) {
                    var u;
                    if (!0 === E)
                        throw Error("HMAC key already set");
                    if (!0 === I)
                        throw Error("Cannot set HMAC key after calling update");
                    if (!0 === O)
                        throw Error("SHAKE is not supported for HMAC");
                    if (t = (n = m(n, a = (i || {}).encoding || "UTF8")(t)).binLen,
                    n = n.value,
                    i = (u = s >>> 3) / 4 - 1,
                    u < t / 8) {
                        for (n = l(n, t, 0, L(e), o); n.length <= i; )
                            n.push(0);
                        n[i] &= 4294967040
                    } else if (u > t / 8) {
                        for (; n.length <= i; )
                            n.push(0);
                        n[i] &= 4294967040
                    }
                    for (t = 0; t <= i; t += 1)
                        w[t] = 909522486 ^ n[t],
                        S[t] = 1549556828 ^ n[t];
                    r = c(w, r),
                    C = s,
                    E = !0
                }
                ,
                this.update = function(e) {
                    var t, n, a, o = 0, l = s >>> 5;
                    for (e = (t = i(e, b, v)).binLen,
                    n = t.value,
                    t = e >>> 5,
                    a = 0; a < t; a += l)
                        o + s <= e && (r = c(n.slice(a, a + l), r),
                        o += s);
                    C += o,
                    b = n.slice(o >>> 5),
                    v = e % s,
                    I = !0
                }
                ,
                this.getHash = function(t, n) {
                    var a, i, s, c;
                    if (!0 === E)
                        throw Error("Cannot call getHash after setting HMAC key");
                    if (s = f(n),
                    !0 === O) {
                        if (-1 === s.shakeLen)
                            throw Error("shakeLen must be specified in options");
                        o = s.shakeLen
                    }
                    switch (t) {
                    case "HEX":
                        a = function(e) {
                            return d(e, o, s)
                        }
                        ;
                        break;
                    case "B64":
                        a = function(e) {
                            return h(e, o, s)
                        }
                        ;
                        break;
                    case "BYTES":
                        a = function(e) {
                            return p(e, o)
                        }
                        ;
                        break;
                    case "ARRAYBUFFER":
                        try {
                            i = new ArrayBuffer(0)
                        } catch (e) {
                            throw Error("ARRAYBUFFER not supported by this environment")
                        }
                        a = function(e) {
                            return g(e, o)
                        }
                        ;
                        break;
                    default:
                        throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER")
                    }
                    for (c = l(b.slice(), v, C, u(r), o),
                    i = 1; i < A; i += 1)
                        !0 === O && 0 != o % 32 && (c[c.length - 1] &= 4294967040 << 24 - o % 32),
                        c = l(c, o, 0, L(e), o);
                    return a(c)
                }
                ,
                this.getHMAC = function(t, n) {
                    var a, i, m, A;
                    if (!1 === E)
                        throw Error("Cannot call getHMAC without first setting HMAC key");
                    switch (m = f(n),
                    t) {
                    case "HEX":
                        a = function(e) {
                            return d(e, o, m)
                        }
                        ;
                        break;
                    case "B64":
                        a = function(e) {
                            return h(e, o, m)
                        }
                        ;
                        break;
                    case "BYTES":
                        a = function(e) {
                            return p(e, o)
                        }
                        ;
                        break;
                    case "ARRAYBUFFER":
                        try {
                            a = new ArrayBuffer(0)
                        } catch (e) {
                            throw Error("ARRAYBUFFER not supported by this environment")
                        }
                        a = function(e) {
                            return g(e, o)
                        }
                        ;
                        break;
                    default:
                        throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER")
                    }
                    return i = l(b.slice(), v, C, u(r), o),
                    A = c(S, L(e)),
                    a(A = l(i, o, s, A, o))
                }
            }
            function o(e, t) {
                this.a = e,
                this.b = t
            }
            function s(e, t, n) {
                var a, r, i, o, s, c = e.length;
                if (t = t || [0],
                s = (n = n || 0) >>> 3,
                0 != c % 2)
                    throw Error("String of HEX type must be in byte increments");
                for (a = 0; a < c; a += 2) {
                    if (r = parseInt(e.substr(a, 2), 16),
                    isNaN(r))
                        throw Error("String of HEX type contains invalid characters");
                    for (i = (o = (a >>> 1) + s) >>> 2; t.length <= i; )
                        t.push(0);
                    t[i] |= r << 8 * (3 - o % 4)
                }
                return {
                    value: t,
                    binLen: 4 * c + n
                }
            }
            function c(e, t, n) {
                var a, r, i, o, s = [];
                s = t || [0];
                for (r = (n = n || 0) >>> 3,
                a = 0; a < e.length; a += 1)
                    t = e.charCodeAt(a),
                    i = (o = a + r) >>> 2,
                    s.length <= i && s.push(0),
                    s[i] |= t << 8 * (3 - o % 4);
                return {
                    value: s,
                    binLen: 8 * e.length + n
                }
            }
            function l(e, t, n) {
                var a, r, i, o, s, c, l = [], u = 0;
                l = t || [0];
                if (t = (n = n || 0) >>> 3,
                -1 === e.search(/^[a-zA-Z0-9=+\/]+$/))
                    throw Error("Invalid character in base-64 string");
                if (r = e.indexOf("="),
                e = e.replace(/\=/g, ""),
                -1 !== r && r < e.length)
                    throw Error("Invalid '=' found in base-64 string");
                for (r = 0; r < e.length; r += 4) {
                    for (s = e.substr(r, 4),
                    i = o = 0; i < s.length; i += 1)
                        o |= (a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(s[i])) << 18 - 6 * i;
                    for (i = 0; i < s.length - 1; i += 1) {
                        for (a = (c = u + t) >>> 2; l.length <= a; )
                            l.push(0);
                        l[a] |= (o >>> 16 - 8 * i & 255) << 8 * (3 - c % 4),
                        u += 1
                    }
                }
                return {
                    value: l,
                    binLen: 8 * u + n
                }
            }
            function u(e, t, n) {
                var a, r, i, o = [];
                o = t || [0];
                for (a = (n = n || 0) >>> 3,
                t = 0; t < e.byteLength; t += 1)
                    r = (i = t + a) >>> 2,
                    o.length <= r && o.push(0),
                    o[r] |= e[t] << 8 * (3 - i % 4);
                return {
                    value: o,
                    binLen: 8 * e.byteLength + n
                }
            }
            function d(e, t, n) {
                var a, r, i = "";
                for (t /= 8,
                a = 0; a < t; a += 1)
                    r = e[a >>> 2] >>> 8 * (3 - a % 4),
                    i += "0123456789abcdef".charAt(r >>> 4 & 15) + "0123456789abcdef".charAt(15 & r);
                return n.outputUpper ? i.toUpperCase() : i
            }
            function h(e, t, n) {
                var a, r, i, o = "", s = t / 8;
                for (a = 0; a < s; a += 3)
                    for (r = a + 1 < s ? e[a + 1 >>> 2] : 0,
                    i = a + 2 < s ? e[a + 2 >>> 2] : 0,
                    i = (e[a >>> 2] >>> 8 * (3 - a % 4) & 255) << 16 | (r >>> 8 * (3 - (a + 1) % 4) & 255) << 8 | i >>> 8 * (3 - (a + 2) % 4) & 255,
                    r = 0; 4 > r; r += 1)
                        o += 8 * a + 6 * r <= t ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(i >>> 6 * (3 - r) & 63) : n.b64Pad;
                return o
            }
            function p(e, t) {
                var n, a, r = "", i = t / 8;
                for (n = 0; n < i; n += 1)
                    a = e[n >>> 2] >>> 8 * (3 - n % 4) & 255,
                    r += String.fromCharCode(a);
                return r
            }
            function g(e, t) {
                var n, a = t / 8, r = new ArrayBuffer(a);
                for (n = 0; n < a; n += 1)
                    r[n] = e[n >>> 2] >>> 8 * (3 - n % 4) & 255;
                return r
            }
            function f(e) {
                var t = {
                    outputUpper: !1,
                    b64Pad: "=",
                    shakeLen: -1
                };
                if (e = e || {},
                t.outputUpper = e.outputUpper || !1,
                !0 === e.hasOwnProperty("b64Pad") && (t.b64Pad = e.b64Pad),
                !0 === e.hasOwnProperty("shakeLen")) {
                    if (0 != e.shakeLen % 8)
                        throw Error("shakeLen must be a multiple of 8");
                    t.shakeLen = e.shakeLen
                }
                if ("boolean" != typeof t.outputUpper)
                    throw Error("Invalid outputUpper formatting option");
                if ("string" != typeof t.b64Pad)
                    throw Error("Invalid b64Pad formatting option");
                return t
            }
            function m(e, t) {
                var n;
                switch (t) {
                case "UTF8":
                case "UTF16BE":
                case "UTF16LE":
                    break;
                default:
                    throw Error("encoding must be UTF8, UTF16BE, or UTF16LE")
                }
                switch (e) {
                case "HEX":
                    n = s;
                    break;
                case "TEXT":
                    n = function(e, n, a) {
                        var r, i, o, s, c, l = [], u = [], d = 0;
                        l = n || [0];
                        if (o = (n = a || 0) >>> 3,
                        "UTF8" === t)
                            for (r = 0; r < e.length; r += 1)
                                for (u = [],
                                128 > (a = e.charCodeAt(r)) ? u.push(a) : 2048 > a ? (u.push(192 | a >>> 6),
                                u.push(128 | 63 & a)) : 55296 > a || 57344 <= a ? u.push(224 | a >>> 12, 128 | a >>> 6 & 63, 128 | 63 & a) : (r += 1,
                                a = 65536 + ((1023 & a) << 10 | 1023 & e.charCodeAt(r)),
                                u.push(240 | a >>> 18, 128 | a >>> 12 & 63, 128 | a >>> 6 & 63, 128 | 63 & a)),
                                i = 0; i < u.length; i += 1) {
                                    for (s = (c = d + o) >>> 2; l.length <= s; )
                                        l.push(0);
                                    l[s] |= u[i] << 8 * (3 - c % 4),
                                    d += 1
                                }
                        else if ("UTF16BE" === t || "UTF16LE" === t)
                            for (r = 0; r < e.length; r += 1) {
                                for (a = e.charCodeAt(r),
                                "UTF16LE" === t && (a = (i = 255 & a) << 8 | a >>> 8),
                                s = (c = d + o) >>> 2; l.length <= s; )
                                    l.push(0);
                                l[s] |= a << 8 * (2 - c % 4),
                                d += 2
                            }
                        return {
                            value: l,
                            binLen: 8 * d + n
                        }
                    }
                    ;
                    break;
                case "B64":
                    n = l;
                    break;
                case "BYTES":
                    n = c;
                    break;
                case "ARRAYBUFFER":
                    try {
                        n = new ArrayBuffer(0)
                    } catch (e) {
                        throw Error("ARRAYBUFFER not supported by this environment")
                    }
                    n = u;
                    break;
                default:
                    throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER")
                }
                return n
            }
            function A(e, t) {
                return e << t | e >>> 32 - t
            }
            function C(e, t) {
                return 32 < t ? (t -= 32,
                new o(e.b << t | e.a >>> 32 - t,e.a << t | e.b >>> 32 - t)) : 0 !== t ? new o(e.a << t | e.b >>> 32 - t,e.b << t | e.a >>> 32 - t) : e
            }
            function b(e, t) {
                return e >>> t | e << 32 - t
            }
            function v(e, t) {
                var n = null;
                n = new o(e.a,e.b);
                return 32 >= t ? new o(n.a >>> t | n.b << 32 - t & 4294967295,n.b >>> t | n.a << 32 - t & 4294967295) : new o(n.b >>> t - 32 | n.a << 64 - t & 4294967295,n.a >>> t - 32 | n.b << 64 - t & 4294967295)
            }
            function E(e, t) {
                return 32 >= t ? new o(e.a >>> t,e.b >>> t | e.a << 32 - t & 4294967295) : new o(0,e.a >>> t - 32)
            }
            function w(e, t, n) {
                return e & t ^ ~e & n
            }
            function S(e, t, n) {
                return new o(e.a & t.a ^ ~e.a & n.a,e.b & t.b ^ ~e.b & n.b)
            }
            function I(e, t, n) {
                return e & t ^ e & n ^ t & n
            }
            function O(e, t, n) {
                return new o(e.a & t.a ^ e.a & n.a ^ t.a & n.a,e.b & t.b ^ e.b & n.b ^ t.b & n.b)
            }
            function B(e) {
                return b(e, 2) ^ b(e, 13) ^ b(e, 22)
            }
            function y(e) {
                var t = v(e, 28)
                  , n = v(e, 34);
                return e = v(e, 39),
                new o(t.a ^ n.a ^ e.a,t.b ^ n.b ^ e.b)
            }
            function j(e) {
                return b(e, 6) ^ b(e, 11) ^ b(e, 25)
            }
            function k(e) {
                var t = v(e, 14)
                  , n = v(e, 18);
                return e = v(e, 41),
                new o(t.a ^ n.a ^ e.a,t.b ^ n.b ^ e.b)
            }
            function Q(e) {
                return b(e, 7) ^ b(e, 18) ^ e >>> 3
            }
            function T(e) {
                var t = v(e, 1)
                  , n = v(e, 8);
                return e = E(e, 7),
                new o(t.a ^ n.a ^ e.a,t.b ^ n.b ^ e.b)
            }
            function R(e) {
                return b(e, 17) ^ b(e, 19) ^ e >>> 10
            }
            function N(e) {
                var t = v(e, 19)
                  , n = v(e, 61);
                return e = E(e, 6),
                new o(t.a ^ n.a ^ e.a,t.b ^ n.b ^ e.b)
            }
            function M(e, t) {
                var n = (65535 & e) + (65535 & t);
                return ((e >>> 16) + (t >>> 16) + (n >>> 16) & 65535) << 16 | 65535 & n
            }
            function D(e, t, n, a) {
                var r = (65535 & e) + (65535 & t) + (65535 & n) + (65535 & a);
                return ((e >>> 16) + (t >>> 16) + (n >>> 16) + (a >>> 16) + (r >>> 16) & 65535) << 16 | 65535 & r
            }
            function F(e, t, n, a, r) {
                var i = (65535 & e) + (65535 & t) + (65535 & n) + (65535 & a) + (65535 & r);
                return ((e >>> 16) + (t >>> 16) + (n >>> 16) + (a >>> 16) + (r >>> 16) + (i >>> 16) & 65535) << 16 | 65535 & i
            }
            function V(e, t) {
                var n, a, r;
                return n = (65535 & e.b) + (65535 & t.b),
                r = (65535 & (a = (e.b >>> 16) + (t.b >>> 16) + (n >>> 16))) << 16 | 65535 & n,
                n = (65535 & e.a) + (65535 & t.a) + (a >>> 16),
                new o((65535 & (a = (e.a >>> 16) + (t.a >>> 16) + (n >>> 16))) << 16 | 65535 & n,r)
            }
            function P(e, t, n, a) {
                var r, i, s;
                return r = (65535 & e.b) + (65535 & t.b) + (65535 & n.b) + (65535 & a.b),
                s = (65535 & (i = (e.b >>> 16) + (t.b >>> 16) + (n.b >>> 16) + (a.b >>> 16) + (r >>> 16))) << 16 | 65535 & r,
                r = (65535 & e.a) + (65535 & t.a) + (65535 & n.a) + (65535 & a.a) + (i >>> 16),
                new o((65535 & (i = (e.a >>> 16) + (t.a >>> 16) + (n.a >>> 16) + (a.a >>> 16) + (r >>> 16))) << 16 | 65535 & r,s)
            }
            function U(e, t, n, a, r) {
                var i, s, c;
                return i = (65535 & e.b) + (65535 & t.b) + (65535 & n.b) + (65535 & a.b) + (65535 & r.b),
                c = (65535 & (s = (e.b >>> 16) + (t.b >>> 16) + (n.b >>> 16) + (a.b >>> 16) + (r.b >>> 16) + (i >>> 16))) << 16 | 65535 & i,
                i = (65535 & e.a) + (65535 & t.a) + (65535 & n.a) + (65535 & a.a) + (65535 & r.a) + (s >>> 16),
                new o((65535 & (s = (e.a >>> 16) + (t.a >>> 16) + (n.a >>> 16) + (a.a >>> 16) + (r.a >>> 16) + (i >>> 16))) << 16 | 65535 & i,c)
            }
            function z(e) {
                var t, n = 0, a = 0;
                for (t = 0; t < arguments.length; t += 1)
                    n ^= arguments[t].b,
                    a ^= arguments[t].a;
                return new o(a,n)
            }
            function L(e) {
                var t, n = [];
                if ("SHA-1" === e)
                    n = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
                else if (0 === e.lastIndexOf("SHA-", 0))
                    switch (n = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428],
                    t = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
                    e) {
                    case "SHA-224":
                        break;
                    case "SHA-256":
                        n = t;
                        break;
                    case "SHA-384":
                        n = [new o(3418070365,n[0]), new o(1654270250,n[1]), new o(2438529370,n[2]), new o(355462360,n[3]), new o(1731405415,n[4]), new o(41048885895,n[5]), new o(3675008525,n[6]), new o(1203062813,n[7])];
                        break;
                    case "SHA-512":
                        n = [new o(t[0],4089235720), new o(t[1],2227873595), new o(t[2],4271175723), new o(t[3],1595750129), new o(t[4],2917565137), new o(t[5],725511199), new o(t[6],4215389547), new o(t[7],327033209)];
                        break;
                    default:
                        throw Error("Unknown SHA variant")
                    }
                else {
                    if (0 !== e.lastIndexOf("SHA3-", 0) && 0 !== e.lastIndexOf("SHAKE", 0))
                        throw Error("No SHA variants supported");
                    for (e = 0; 5 > e; e += 1)
                        n[e] = [new o(0,0), new o(0,0), new o(0,0), new o(0,0), new o(0,0)]
                }
                return n
            }
            function x(e, t) {
                var n, a, r, i, o, s, c, l = [];
                for (n = t[0],
                a = t[1],
                r = t[2],
                i = t[3],
                o = t[4],
                c = 0; 80 > c; c += 1)
                    l[c] = 16 > c ? e[c] : A(l[c - 3] ^ l[c - 8] ^ l[c - 14] ^ l[c - 16], 1),
                    s = 20 > c ? F(A(n, 5), a & r ^ ~a & i, o, 1518500249, l[c]) : 40 > c ? F(A(n, 5), a ^ r ^ i, o, 1859775393, l[c]) : 60 > c ? F(A(n, 5), I(a, r, i), o, 2400959708, l[c]) : F(A(n, 5), a ^ r ^ i, o, 3395469782, l[c]),
                    o = i,
                    i = r,
                    r = A(a, 30),
                    a = n,
                    n = s;
                return t[0] = M(n, t[0]),
                t[1] = M(a, t[1]),
                t[2] = M(r, t[2]),
                t[3] = M(i, t[3]),
                t[4] = M(o, t[4]),
                t
            }
            function H(e, t, n, a) {
                var r;
                for (r = 15 + (t + 65 >>> 9 << 4); e.length <= r; )
                    e.push(0);
                for (e[t >>> 5] |= 128 << 24 - t % 32,
                t += n,
                e[r] = 4294967295 & t,
                e[r - 1] = t / 4294967296 | 0,
                t = e.length,
                r = 0; r < t; r += 16)
                    a = x(e.slice(r, r + 16), a);
                return a
            }
            function q(e, t, n) {
                var a, r, i, s, c, l, u, d, h, p, g, f, m, A, C, b, v, E, z, L, x, H, q, J = [];
                if ("SHA-224" === n || "SHA-256" === n)
                    p = 64,
                    f = 1,
                    H = Number,
                    m = M,
                    A = D,
                    C = F,
                    b = Q,
                    v = R,
                    E = B,
                    z = j,
                    x = I,
                    L = w,
                    q = K;
                else {
                    if ("SHA-384" !== n && "SHA-512" !== n)
                        throw Error("Unexpected error in SHA-2 implementation");
                    p = 80,
                    f = 2,
                    H = o,
                    m = V,
                    A = P,
                    C = U,
                    b = T,
                    v = N,
                    E = y,
                    z = k,
                    x = O,
                    L = S,
                    q = W
                }
                for (n = t[0],
                a = t[1],
                r = t[2],
                i = t[3],
                s = t[4],
                c = t[5],
                l = t[6],
                u = t[7],
                g = 0; g < p; g += 1)
                    16 > g ? (h = g * f,
                    d = e.length <= h ? 0 : e[h],
                    h = e.length <= h + 1 ? 0 : e[h + 1],
                    J[g] = new H(d,h)) : J[g] = A(v(J[g - 2]), J[g - 7], b(J[g - 15]), J[g - 16]),
                    d = C(u, z(s), L(s, c, l), q[g], J[g]),
                    h = m(E(n), x(n, a, r)),
                    u = l,
                    l = c,
                    c = s,
                    s = m(i, d),
                    i = r,
                    r = a,
                    a = n,
                    n = m(d, h);
                return t[0] = m(n, t[0]),
                t[1] = m(a, t[1]),
                t[2] = m(r, t[2]),
                t[3] = m(i, t[3]),
                t[4] = m(s, t[4]),
                t[5] = m(c, t[5]),
                t[6] = m(l, t[6]),
                t[7] = m(u, t[7]),
                t
            }
            function J(e, t) {
                var n, a, r, i, s = [], c = [];
                if (null !== e)
                    for (a = 0; a < e.length; a += 2)
                        t[(a >>> 1) % 5][(a >>> 1) / 5 | 0] = z(t[(a >>> 1) % 5][(a >>> 1) / 5 | 0], new o((255 & e[a + 1]) << 24 | (65280 & e[a + 1]) << 8 | (16711680 & e[a + 1]) >>> 8 | e[a + 1] >>> 24,(255 & e[a]) << 24 | (65280 & e[a]) << 8 | (16711680 & e[a]) >>> 8 | e[a] >>> 24));
                for (n = 0; 24 > n; n += 1) {
                    for (i = L("SHA3-"),
                    a = 0; 5 > a; a += 1)
                        s[a] = z(t[a][0], t[a][1], t[a][2], t[a][3], t[a][4]);
                    for (a = 0; 5 > a; a += 1)
                        c[a] = z(s[(a + 4) % 5], C(s[(a + 1) % 5], 1));
                    for (a = 0; 5 > a; a += 1)
                        for (r = 0; 5 > r; r += 1)
                            t[a][r] = z(t[a][r], c[a]);
                    for (a = 0; 5 > a; a += 1)
                        for (r = 0; 5 > r; r += 1)
                            i[r][(2 * a + 3 * r) % 5] = C(t[a][r], Z[a][r]);
                    for (a = 0; 5 > a; a += 1)
                        for (r = 0; 5 > r; r += 1)
                            t[a][r] = z(i[a][r], new o(~i[(a + 1) % 5][r].a & i[(a + 2) % 5][r].a,~i[(a + 1) % 5][r].b & i[(a + 2) % 5][r].b));
                    t[0][0] = z(t[0][0], Y[n])
                }
                return t
            }
            var K, W, Z, Y;
            W = [new o((K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298])[0],3609767458), new o(K[1],602891725), new o(K[2],3964484399), new o(K[3],2173295548), new o(K[4],4081628472), new o(K[5],3053834265), new o(K[6],2937671579), new o(K[7],3664609560), new o(K[8],2734883394), new o(K[9],1164996542), new o(K[10],1323610764), new o(K[11],3590304994), new o(K[12],4068182383), new o(K[13],991336113), new o(K[14],633803317), new o(K[15],3479774868), new o(K[16],2666613458), new o(K[17],944711139), new o(K[18],2341262773), new o(K[19],2007800933), new o(K[20],1495990901), new o(K[21],1856431235), new o(K[22],3175218132), new o(K[23],2198950837), new o(K[24],3999719339), new o(K[25],766784016), new o(K[26],2566594879), new o(K[27],3203337956), new o(K[28],1034457026), new o(K[29],2466948901), new o(K[30],3758326383), new o(K[31],168717936), new o(K[32],1188179964), new o(K[33],1546045734), new o(K[34],1522805485), new o(K[35],2643833823), new o(K[36],2343527390), new o(K[37],1014477480), new o(K[38],1206759142), new o(K[39],344077627), new o(K[40],1290863460), new o(K[41],3158454273), new o(K[42],3505952657), new o(K[43],106217008), new o(K[44],3606008344), new o(K[45],1432725776), new o(K[46],1467031594), new o(K[47],851169720), new o(K[48],3100823752), new o(K[49],1363258195), new o(K[50],3750685593), new o(K[51],3785050280), new o(K[52],3318307427), new o(K[53],3812723403), new o(K[54],2003034995), new o(K[55],3602036899), new o(K[56],1575990012), new o(K[57],1125592928), new o(K[58],2716904306), new o(K[59],442776044), new o(K[60],593698344), new o(K[61],3733110249), new o(K[62],2999351573), new o(K[63],3815920427), new o(3391569614,3928383900), new o(3515267271,566280711), new o(3940187606,3454069534), new o(4118630271,4000239992), new o(116418474,1914138554), new o(174292421,2731055270), new o(289380356,3203993006), new o(460393269,320620315), new o(685471733,587496836), new o(852142971,1086792851), new o(1017036298,365543100), new o(1126000580,2618297676), new o(1288033470,3409855158), new o(1501505948,4234509866), new o(1607167915,987167468), new o(1816402316,1246189591)],
            Y = [new o(0,1), new o(0,32898), new o(2147483648,32906), new o(2147483648,2147516416), new o(0,32907), new o(0,2147483649), new o(2147483648,2147516545), new o(2147483648,32777), new o(0,138), new o(0,136), new o(0,2147516425), new o(0,2147483658), new o(0,2147516555), new o(2147483648,139), new o(2147483648,32905), new o(2147483648,32771), new o(2147483648,32770), new o(2147483648,128), new o(0,32778), new o(2147483648,2147483658), new o(2147483648,2147516545), new o(2147483648,32896), new o(0,2147483649), new o(2147483648,2147516424)],
            Z = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]],
            void 0 === (a = function() {
                return i
            }
            .call(t, n, t, e)) || (e.exports = a)
        }()
    }
})

function generateFormStr(username, password){
	var client_id = "c3cef7c66a1843f8b3a9e6a1e3160e20";
	var timestamp = Date.now();
	var signature = sign(client_id, timestamp);
	var str = "client_id=" + client_id + "&grant_type=password&timestamp=" + timestamp + "&source=com.zhihu.web&signature=" + signature + "&username=%2B86" +
			  username + "&password=" + password + "&captcha=&lang=en&utm_source=&ref_source=other_https%3A%2F%2Fwww.zhihu.com%2Fsignin%3Fnext%3D%252F";
	return _encrypt(str);
}

function sign(client_id, timestamp){
	var enc = new (_zh("1667"))("SHA-1","TEXT");
	enc.setHMACKey("d1b964811afb40118a12068ff74a12f4", "TEXT")
	enc.update("password")
	enc.update(client_id)
	enc.update("com.zhihu.web")
	enc.update(String(timestamp))
	return enc.getHMAC("HEX");
}

