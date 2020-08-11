import cv2
from pathlib import Path
from numpy import arange

import execjs
import requests
import random

JS_DIR = Path(__file__).resolve().parent.joinpath("js_libs")
Cache = {}

# 缓动函数类处理


class easing(object):

    def ease_out_quad(self, x):
        return 1 - (1 - x) * (1 - x)

    def ease_out_quart(self, x):
        return 1 - pow(1 - x, 4)

    def ease_out_expo(self, x):
        if x == 1:
            return 1
        else:
            return 1 - pow(2, -10 * x)

    def get_tracks(self, distance):
        offsets = []
        seconds = random.randint(1, 2)
        r = random.randint(1, 3)
        for t in arange(0.0, seconds, 0.01):
            if r == 1:
                offset = round(self.ease_out_quad(t / seconds) * distance)
            elif r == 2:
                offset = round(self.ease_out_expo(t / seconds) * distance)
            else:
                offset = round(self.ease_out_quart(t / seconds) * distance)
            if int(offset) >= 3:
                offsets.append(int(offset))
        return offsets


easings = easing()


def cache_lookup(js_name):
    return Cache.get(js_name)


def cache_set(js_name, value):
    Cache[js_name] = value


def _download_image(session, url, img_name):
    resp = session.get(url)
    with open(img_name, 'wb') as f:
        f.write(resp.content)
    print('<%s> 图片下载完毕'%img_name)
    return img_name


def FindPic(template, target):
    """
    找出图像中最佳匹配位置
    :param target: 目标即背景图
    :param template: 模板即需要找到的图
    :return: 返回最佳匹配及其最差匹配和对应的坐标
    """
    target_rgb = cv2.imread(target)
    target_gray = cv2.cvtColor(target_rgb, cv2.COLOR_BGR2GRAY)
    template_rgb = cv2.imread(template, 0)
    res = cv2.matchTemplate(target_gray, template_rgb, cv2.TM_CCOEFF_NORMED)
    value = cv2.minMaxLoc(res)
    X = value[3][0]
    return X


def load_ctx(js_file):
    cache = cache_lookup(js_file)
    if not cache:
        js_path = JS_DIR.joinpath(js_file)
        with open(js_path, 'r') as f:
            ctx = execjs.compile(f.read())
            cache_set(js_file, ctx)
        return ctx
    return cache


def random_index(rate):
    """随机变量的概率函数"""
    #
    # 参数rate为list<int>
    # 返回概率事件的下标索引
    start = 0
    index = 0
    randnum = random.randint(1, sum(rate))

    for index, scope in enumerate(rate):
        start += scope
        if randnum <= start:
            break
    return index


def _gen_y_trace(coord_len):
    arr = [0, 1, -1]
    rate = [31, 1, 1]
    y_coord = []
    for _ in range(coord_len):
        index = random_index(rate)
        y_coord.append(arr[index])
    return y_coord


def _gen_z_trace(coord_len):
    arr = [2, 4, 3, 5, 7, 0, 9]
    rate = [10, 6, 7, 2, 1, 1, 1]
    start = random.randint(60, 200)
    z_coord = []
    for i in range(coord_len):
        if i == 0:
            z_coord.append(start)
        elif i == 1:
            z_coord.append(start + random.randint(10, 20))
        elif i == 2:
            z_coord.append(start + random.randint(7, 10))
        elif i == 3:
            z_coord.append(start + random.randint(4, 8))
        elif i == coord_len - 3:
            z_coord.append(start + random.randint(20, 100))
        elif i == coord_len - 2:
            z_coord.append(start + random.randint(100, 200))
        elif i == coord_len - 1:
            z_coord.append(start + random.randint(200, 300))
        else:
            index = random_index(rate)
            z_coord.append(start + arr[index])
        start = z_coord[-1]
    return z_coord


def gen_trace(X):
    x_coord = easings.get_tracks(X)
    coord_len = len(x_coord)
    y_coord = _gen_y_trace(coord_len)
    z_coord = _gen_z_trace(coord_len)
    return [list(i) for i in zip(x_coord, y_coord, z_coord)]


if __name__ == '__main__':
    print(gen_trace(89))

# [9, 5, 5, 4, 4, 5, 4, 5, 1, 2, 4, 2, 2, 1, 3, 2, 5, 0, 2, 3, 1, 3, 1, 2, 3, 1, 3, 2, 1, 4, 1, 1, 3, 2, 1, 2, 6, 2, 2, 4, 3, 2, 2, 3, 2, 3, 3, 2, 1, 2, 3, 1, 2, 2, 2, 2, 4, 3, 1, 5, 4, 7, 3, 2, 7, 2, 9, 10, 6, 12, 170, 494]