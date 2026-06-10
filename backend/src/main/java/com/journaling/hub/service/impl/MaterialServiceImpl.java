package com.journaling.hub.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.journaling.hub.common.BusinessException;
import com.journaling.hub.common.ErrorCode;
import com.journaling.hub.entity.Material;
import com.journaling.hub.mapper.MaterialMapper;
import com.journaling.hub.service.MaterialService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 素材服务实现
 */
@Slf4j
@Service
public class MaterialServiceImpl implements MaterialService {

    @Autowired
    private MaterialMapper materialMapper;

    @Override
    public IPage<Material> listMaterials(int page, int limit, String category, String keyword) {
        Page<Material> pageParam = new Page<>(page, limit);

        LambdaQueryWrapper<Material> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Material::getStatus, 1);

        if (category != null && !category.isEmpty()) {
            wrapper.eq(Material::getCategory, category);
        }

        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w
                    .like(Material::getTitle, keyword)
                    .or()
                    .like(Material::getDescription, keyword)
            );
        }

        wrapper.orderByDesc(Material::getSortOrder)
                .orderByDesc(Material::getCreatedAt);

        return materialMapper.selectPage(pageParam, wrapper);
    }

    @Override
    public Material getDetail(Long id) {
        Material material = materialMapper.selectById(id);
        if (material == null) {
            throw new BusinessException(ErrorCode.MATERIAL_NOT_FOUND);
        }
        if (material.getStatus() != 1) {
            throw new BusinessException(ErrorCode.MATERIAL_OFFLINE);
        }
        return material;
    }

    @Override
    public IPage<Material> searchMaterials(String keyword, int page, int limit) {
        Page<Material> pageParam = new Page<>(page, limit);
        return materialMapper.searchMaterials(pageParam, keyword);
    }

    @Override
    public List<Map<String, Object>> getCategories() {
        // 查询所有分类及其数量
        List<Material> materials = materialMapper.selectList(
                new LambdaQueryWrapper<Material>()
                        .eq(Material::getStatus, 1)
                        .select(Material::getCategory)
                        .groupBy(Material::getCategory)
        );

        // 统计每个分类的数量
        Map<String, Long> categoryCounts = materialMapper.selectList(
                new LambdaQueryWrapper<Material>()
                        .eq(Material::getStatus, 1)
                        .select(Material::getCategory)
        ).stream()
                .collect(Collectors.groupingBy(Material::getCategory, Collectors.counting()));

        List<Map<String, Object>> result = new ArrayList<>();
        categoryCounts.forEach((category, count) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("category", category);
            item.put("count", count);
            result.add(item);
        });

        return result;
    }
}
