package com.journaling.hub.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * UserController 测试
 */
@DisplayName("UserController")
class UserControllerTest extends ControllerTestBase {

    @Test
    @DisplayName("GET /api/user/profile — 正常获取个人信息")
    void getProfile_shouldReturnUserInfo() throws Exception {
        mockMvc.perform(get("/api/user/profile")
                        .header("Authorization", normalUserToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.nickname").value("测试用户"));
    }

    @Test
    @DisplayName("GET /api/user/profile — 无 Token 返回 401")
    void getProfile_withoutToken_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/user/premium-status — 普通用户返回非会员")
    void getPremiumStatus_normalUser_shouldReturnFalse() throws Exception {
        mockMvc.perform(get("/api/user/premium-status")
                        .header("Authorization", normalUserToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isPremium").value(false));
    }

    @Test
    @DisplayName("GET /api/user/premium-status — 会员用户返回会员")
    void getPremiumStatus_premiumUser_shouldReturnTrue() throws Exception {
        mockMvc.perform(get("/api/user/premium-status")
                        .header("Authorization", premiumUserToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isPremium").value(true));
    }

    @Test
    @DisplayName("GET /api/user/stats — 返回用户统计数据")
    void getStats_shouldReturnStats() throws Exception {
        mockMvc.perform(get("/api/user/stats")
                        .header("Authorization", normalUserToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.downloadCount").isNumber())
                .andExpect(jsonPath("$.data.collectionCount").isNumber());
    }

    @Test
    @DisplayName("PUT /api/user/profile — 更新昵称")
    void updateProfile_shouldSucceed() throws Exception {
        String body = "{\"nickname\":\"新昵称\"}";
        mockMvc.perform(put("/api/user/profile")
                        .header("Authorization", normalUserToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
