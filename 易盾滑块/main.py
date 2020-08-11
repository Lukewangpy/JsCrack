import json
import re
from urllib.parse import urlencode

import requests

from common import load_ctx, _download_image, FindPic, gen_trace

cb_ctx = load_ctx('cb.js')
fp_ctx = load_ctx('fp.js')
data_ctx = load_ctx('data.js')
bzk_ctx = load_ctx('bzk.js')


class NeteaseSlide:
    def __init__(self, id='07e2387ab53a4d6f930b8d9a9be71bdf'):
        self.id = id
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"})

    def captcha_init(self):
        param = {
            'callback': '__JSONP_47jcdbm_18',
            'cb': bzk_ctx.call("getcb"),
            'dev': '1',
            'dpr': '1',
            'fp': bzk_ctx.call("getfp"),
            'group': '',
            'https': 'true',
            'id': self.id,
            'ipv6': 'false',
            'referer': 'https%3A%2F%2Fdun.163.com%2Ftrial%2Fjigsaw',
            'runEnv': '10',
            'scene': '',
            'token': '',
            'type': '2',
            'version': '2.13.6',
            'width': '320'
        }
        url = "https://c.dun.163yun.com/api/v2/get?" + urlencode(param)
        resp = self.session.get(url)
        text = re.search(param['callback'] + "\((.*)\)", resp.text).group(1)
        data = json.loads(text)
        bg = data['data']['bg'][0]
        front = data['data']['front'][0]
        token = data['data']['token']
        return bg, front, token

    def get_trace_data(self, token, X):
        return bzk_ctx.call('getdata', token, X)

    def check_verify(self, trace_data, token):
        param = {
            "id": self.id,
            "token": token,
            "acToken": "",
            "data": trace_data,
            "width": "320",
            "type": "2",
            "version": "2.13.6",
            "cb": bzk_ctx.call("getcb"),
            "extraData": "",
            "runEnv": "10",
            "referer": "https://dun.163.com/trial/jigsaw",
            "callback": "__JSONP_iftwg5t_3",
        }
        url = "https://c.dun.163yun.com/api/v2/check?" + urlencode(param)
        resp = self.session.get(url)
        print(resp.text)

    def main(self):
        bg, front, token = self.captcha_init()
        bg_name = _download_image(self.session, bg, 'bg.jpg')
        front_name = _download_image(self.session, front, 'front.png')
        X = FindPic(bg_name, front_name)
        trace_data = self.get_trace_data(token, X-2)
        self.check_verify(trace_data, token)

    def test(self, X, token):
        trace_data = self.get_trace_data(token, X)
        print(trace_data)


if __name__ == '__main__':
    for i in range(10):
        netease_slide = NeteaseSlide()
        netease_slide.main()