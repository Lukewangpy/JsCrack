import requests
import execjs

url = "https://www.zhihu.com/api/v3/oauth/sign_in"

headers ={
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-length": "480",
    "content-type": "application/x-www-form-urlencoded",
    "origin": "https://www.zhihu.com",
    "pragma": "no-cache",
    "referer": "https://www.zhihu.com/signin?next=%2F",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
    "x-ab-param": "zr_training_boost=false;zr_sim3=0;se_aa_base=0;se_ffzx_jushen1=0;li_paid_answer_exp=0;zr_slot_training=1;se_merge=0;tp_header_style=1;tp_contents=2;pf_creator_card=1;tsp_ios_cardredesign=0;pf_profile2_tab=0;li_answer_card=0;li_sp_mqbk=0;zr_rec_answer_cp=open;ug_follow_topic_1=2;li_pl_xj=0;se_v_v005=0;tp_m_intro_re_topic=1;tp_discover=0;qap_labeltype=1;se_col_boost=0;tp_topic_tab=0;se_auth_src=0;tp_sft=a;top_quality=0;li_viptab_name=0;li_vip_verti_search=0;li_yxzl_new_style_a=1;se_sug_term=0;zr_training_first=false;se_major=0;se_usercard=0;zr_search_sim2=2;tsp_hotlist_ui=1;li_edu_page=old;zr_km_answer=open_cvr;zr_search_paid=1;se_preset=0;tp_fenqu_wei=0;soc_feed_intelligent=3;tp_flow_ctr=0;top_root=0;ug_newtag=1;se_return_1=0;tp_clubhyb=0;se_hi_trunc=0;se_major_v2=0;se_v057=0;tp_club__entrance2=1;zr_intervene=0;se_videobox=0;se_v054=0;li_panswer_topic=0;zr_expslotpaid=1;se_guess=0;li_svip_tab_search=1;se_vbert3=0;li_catalog_card=1;zr_slotpaidexp=1;se_mobilecard=0;se_v058=0;tp_club_entrance=1;pf_fuceng=1;ls_video_commercial=0;zw_sameq_sorce=999;se_searchwiki=0;pf_noti_entry_num=0;qap_question_author=0;qap_question_visitor= 0;se_click_v_v=0;tp_club_top=0;soc_notification=1;tsp_ioscard2=0;se_whitelist=0;tp_zrec=0;se_topicfeed=0;se_entity22=0;tp_club_qa_entrance=1;se_v_v006=0;tp_meta_card=0;tp_topic_style=0;li_topics_search=0;se_college=default;tp_dingyue_video=0;ls_videoad=2;li_svip_cardshow=1;se_wil_act=0;se_sug_dnn=0;ls_fmp4=0;li_ebook_gen_search=0;se_club_ui=0;tp_club_bt=0;top_v_album=1;se_recommend=0;tp_club_feed=0;zr_topic_rpc=0;se_v053=1;top_test_4_liguangyi=1;tp_club_fdv4=0;top_ebook=0;tsp_ad_cardredesign=0;ls_recommend_test=0;li_car_meta=0;zr_rerank=0;se_zp_boost=0;top_universalebook=1;tsp_adcard2=0;pf_newguide_vertical=0;li_video_section=0;se_colorfultab=1;se_t2sug=0;se_adsrank=4;tp_topic_tab_new=0-0-0;li_yxxq_aut=A1;se_auth_src2=0;pf_foltopic_usernum=50;pf_adjust=0",
    "x-ab-pb": "ChAnCpwKJQq0CpsKnQq9CqEKEggGAAUAAAAAAA==",
    "x-requested-with": "fetch",
    "x-zse-83": "3_2.0",
    "cookie": '_xsrf=qIRDsuvmkls7Q3dyc4TX6z8mOekAp5CZ; _zap=61bc6d17-92b0-468c-b4f8-24081c15be85; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1596036269,1596037728,1597050390,1597109433; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1597115470; d_c0="AIDSbbHzthGPTvPER-GwY2lOiqwX-U3Xhbc=|1597115472"; capsion_ticket="2|1:0|10:1597115472|14:capsion_ticket|44:MDNiNWMxNjIyZDc2NDgyYzk0NGVmNzhjMzk3NzkyMDM=|cd5dd3539ba7d2032c5b36d593a9738752de878e6d24999e16ae30e196933f40"; _ga=GA1.2.478053542.1597115471; _gid=GA1.2.1745658925.1597115471; _gat_gtag_UA_149949619_1=1; KLBRSID=9d75f80756f65c61b0a50d80b4ca9b13|1597115473|1597114714',
}

# data = "a8H0c79qkLnm2LF0z_pKg9H92Ltxg6O1XGO12rN0cT2tJvS8XLp1DhHKEMVVoBH0sTYhxU9qkLk12LF0z0pMebw1shoYi9omEqYhggHMcvOOsBOB8BF0g6S0gLOfkComBvCmevgqkLP9g9e0zMNmUBHqkLnm2Lf8PqxGQJe8ST2t6MFqs_20kA98Xq2tHhomGqoMUDgqkLPxkTF08TF0k79qr8FXPhYq8LP924_BJwx9kCSMsBF0g09ykMYp2Lt00hF066H0o8txnUtqmMtyNrLq28Fxc8O01028b7LyHGFm2LfB8CpGU9eBDqppkLn8zG3ZchL1iDpuJvS8EqYhggHMcvOOSTYhBT2qc0UqeX2xoHYqm_e0giCmU9VOgcO1KBF0g6HM-GVO2wxMEqYhgDCKevgVEwNMqBF0giU0gutpr0YBmXNqgq982TNXNqtqfXY8SQr8o8SYFq28EqYhHqeVebSYDrS8"

username = "15222222222"
password = "a12345678"
with open("zh.js", 'r') as f:
    js_ctx = execjs.compile(f.read())
    data = js_ctx.call("generateFormStr", username, password)
resp = requests.post(url, headers=headers, data=data)

print(resp.json())