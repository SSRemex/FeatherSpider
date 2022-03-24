// 扫描域名 末尾不要加/
const ROOT_URL = "https://benchmark.58corp.com";

// cookie 字符串
const Cookie_str = "c=to3wGuTN-1632625117028-cf4c89d08dbcf-1277372903; _fmdata=uELNf7mIkZIbXLdzcU21aMym1Pkxld42RaMe7%2F0OEqL5%2FtibJwMPHI1Vq1%2BjYbLQsWlZMCemF3Tvi6d674Tjj85b0pHah%2BhJDOIYww2MqTY%3D; _xid=lph1eBbOiYp%2B3fr3vOqcEhBa3wWAAwICbmdky5RdVp5JN%2Fq2IONzb72d0yrPYe93TX%2FIepkV9xo%2B4Ka4E9gn6g%3D%3D; wmda_uuid=2ee22d828a5761d3ae9efe8d98c2a7de; wmda_visited_projects=%3B18101072869043; ec=UebkL1K1-1642140767728-99636794cc056190373960; _efmdata=GiOQa4ZrtHfgBa158iW6fhjYZgTXLSUBYTdozLkK7kCMRLB%2BQAyuLEg7zP4ZyYZJX2EtCToQuyO1JSi59cToF6eRTz8YeqPx2U21cNC7qEc%3D; 58tj_uuid=83385fd0-5d9e-44fc-9d71-e9f5327c6cb6; new_uv=1; als=0; ishare_sso_username=F3A5B8DE5F87C6027C5310A6A948C79E0F7F5E2D66983F73F127795DD5303D0B; _exid=lph1eBbOiYp%2B3fr3vOqcEhBa3wWAAwICbmdky5RdVp4CxMakW6neFc4%2Fkrzm%2Fm3rKFbz4b2xvWjSqyt4PgPUmA%3D%3D; dunCookie=1cbe781ac68cf854596a86e295703a6a933bfe6938373ac2a24fefd4eef87370004f2d1b2913ae96; benchmark_token=24d22550c223269f84a6db8dd2fda1d3eb734b86; JSESSIONID=298EB41D7ACC05FD80341D40444CF98";

// url最大超时时间（毫秒）
const TIMEOUT = 10000

// 是否开启无头
const IS_HEADLESS = true;
// 递归深度
const DEEP = 3;

// 黑白都为空时，代表不作限制
// 保留白域名 
// eg: ["baidu.com", "hao123.com"]
const WHITE_DOMAIN = []

// 过滤黑域名 
// 设置白域名不为空时，黑域名自动为空，二者只能同时支持一种
const BLACK_DOMAIN = []

// 是否只爬取 ROOT_URL的host
// 该值为true时 黑白域名失效
const HOST_LOCKED = true

// uri重复等级 1（不过滤重复，重复数极大） 2 3（完全不重复）默认建议为 2
const LEVEL = 2



module.exports = {
    ROOT_URL, 
    Cookie_str, 
    IS_HEADLESS, 
    DEEP,
    WHITE_DOMAIN,
    BLACK_DOMAIN,
    HOST_LOCKED,
    LEVEL,
    TIMEOUT
};
