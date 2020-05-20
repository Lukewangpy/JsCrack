import re

import requests
import execjs

url = "http://www.gsxt.gov.cn/SearchItemCaptcha"

header_js = """
var setTimeout = function(){};
window = {
	DOMContentLoaded: function(){}
};
document = {
	addEventListener: function(x, y, z){
		if(x == "DOMContentLoaded"){
			y();
		}
	},
	attachEvent: function(x, y){
		if(x == "onreadystatechange"){
			y();
		}
	},
	cookie: ""
}
function get_cookie(){
	return document.cookie;
}
"""

resp = requests.get(url)
cookie_dict = requests.utils.dict_from_cookiejar(resp.cookies)
js_str = re.search("<script>(.*?)</script>", resp.text).group(1)
js_code = header_js + js_str
ctx = execjs.compile(js_code)
raw_cookie = ctx.call("get_cookie")
cookie_dict2 = dict([re.search("(.*?);Expires", raw_cookie).group(1).split("=")])
cookie_dict.update(cookie_dict2)
cookie_str = "__jsluid_h={0}; __jsl_clearance={1}".format(cookie_dict['__jsluid_h'], cookie_dict['__jsl_clearance'])
print(cookie_str)
headers = {
    "Host": "www.gsxt.gov.cn",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
    "Referer": "http://www.gsxt.gov.cn/SearchItemCaptcha",
    "Cookie": cookie_str
}


resp2 = requests.get(url, headers=headers)
print(resp2.text)
