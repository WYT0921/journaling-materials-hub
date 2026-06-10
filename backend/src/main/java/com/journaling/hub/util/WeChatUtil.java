package com.journaling.hub.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * 微信小程序工具类
 */
@Slf4j
@Component
public class WeChatUtil {

    @Value("${wechat.appid}")
    private String appid;

    @Value("${wechat.secret}")
    private String secret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String JSCODE2SESSION_URL =
            "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

    /**
     * 调用微信 jscode2session 接口获取 openid
     */
    public Map<String, String> jscode2session(String code) {
        String url = String.format(JSCODE2SESSION_URL, appid, secret, code);

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);

            log.info("微信 jscode2session 响应: {}", response);

            if (jsonNode.has("errcode") && jsonNode.get("errcode").asInt() != 0) {
                String errMsg = jsonNode.has("errmsg") ? jsonNode.get("errmsg").asText() : "未知错误";
                log.error("微信 jscode2session 失败: {}", errMsg);
                return null;
            }

            Map<String, String> result = new HashMap<>();
            result.put("openid", jsonNode.get("openid").asText());
            result.put("session_key", jsonNode.get("session_key").asText());

            if (jsonNode.has("unionid")) {
                result.put("unionid", jsonNode.get("unionid").asText());
            }

            return result;
        } catch (Exception e) {
            log.error("微信 jscode2session 请求异常: ", e);
            return null;
        }
    }
}
