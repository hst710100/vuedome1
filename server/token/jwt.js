const jwt = require('jsonwebtoken');
//封装jwt
const Token = {
    //data加密数据，time过期时间
    //str 自定义字符串，这个字符串在解密时需要用到
    encrypt: function (data, str, time) {
        //函数sign用于加密生成
        return jwt.sign(data, str, { expiresIn: time })
    },
    decrypt: function (token,str) {
        try {
            //函数verify用于解密
            //参数token 表示需要解密的令牌 
            //参数str 表示加密时用到的自定义字符串，即密钥
            let data = jwt.verify(token, str);
            return {
                token: true,
                id: data.id
            };
        } catch (e) {
            return {
                token: false,
                data: e
            }
        }
    }
}
module.exports = Token;