package org.financial.financialaibackend.Utils;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class EntityModelMapper {

    private final ModelMapper modelMapper;

    public EntityModelMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        this.modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
    }

    /**
     * 將來源清單的每個元素映射為目標類型（使用寬鬆匹配策略）。
     *
     * @param sourceList       來源清單
     * @param destinationClass 目標類型
     * @return 映射後的清單，若來源清單為 null 或空，返回空清單
     */
    public <S, D> List<D> mapWithLooseStrategy(List<S> sourceList, Class<D> destinationClass) {
        if (sourceList == null || sourceList.isEmpty()) {
            return Collections.emptyList();
        }
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE); // 設置寬鬆匹配
        return sourceList.stream()
                .map(s -> map(s, destinationClass))
                .toList();
    }

    /**
     * 將來源清單的每個元素映射為目標類型（使用嚴格匹配策略）。
     *
     * @param sourceList       來源清單
     * @param destinationClass 目標類型
     * @return 映射後的清單，若來源清單為 null 或空，返回空清單
     */
    public <S, D> D mapWithLooseStrategy(S source, Class<D> destinationClass) {
        if (source == null ) {
            return null;
        }
        // 設置寬鬆匹配策略
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);
        return modelMapper.map(source, destinationClass);
    }

    /**
     * 將來源清單的每個元素映射為目標類型（使用嚴格匹配策略）。
     *
     * @param sourceList       來源清單
     * @param destinationClass 目標類型
     * @return 映射後的清單，若來源清單為 null 或空，返回空清單
     */
    public <S, D> List<D> mapWithStrictStrategy(List<S> sourceList, Class<D> destinationClass) {
        if (sourceList == null || sourceList.isEmpty()) {
            return Collections.emptyList();
        }
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT); // 設置嚴格匹配
        return sourceList.stream()
                .map(s -> map(s, destinationClass))
                .toList();
    }

    /**
     * 使用嚴格匹配策略將單一來源物件映射為目標類型。
     *
     * @param source           來源物件
     * @param destinationClass 目標類型
     * @return 映射後的物件，若來源為 null，返回 null
     */
    public <S, D> D mapWithStrictStrategy(S source, Class<D> destinationClass) {
        if (source == null) {
            return null;
        }
        // 設置嚴格匹配策略
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper.map(source, destinationClass);
    }


    /**
     * 將單一來源物件映射為目標類型（默認使用標準匹配策略）。
     *
     * @param source           來源物件
     * @param destinationClass 目標類型
     * @return 映射後的物件，若來源為 null，返回 null
     */
    public <S, D> D map(S source, Class<D> destinationClass) {
        if (source == null) {
            return null;
        }
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD); // 默認標準匹配
        return modelMapper.map(source, destinationClass);
    }

    /**
     * 將來源物件的屬性覆蓋到已存在的目標物件中（使用標準匹配策略）。
     *
     * @param source 來源物件
     * @param target 已存在的目標物件
     */
    public <S, D> void map(S source, D target) {
        if (source == null || target == null) {
            throw new IllegalArgumentException("Source and target objects must not be null");
        }
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD); // 默認標準匹配
        modelMapper.map(source, target);
    }

    /**
     * 將來源清單的每個元素的屬性覆蓋到已存在的目標清單中（使用標準匹配策略）。
     *
     * @param sourceList 來源清單
     * @param targetList 目標清單
     */
    public <S, D> void map(List<S> sourceList, List<D> targetList) {
        if (sourceList == null || targetList == null) {
            throw new IllegalArgumentException("Source and target lists must not be null");
        }
        if (sourceList.size() != targetList.size()) {
            throw new IllegalArgumentException("Source and target lists must have the same size");
        }

        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD); // 默認標準匹配
        for (int i = 0; i < sourceList.size(); i++) {
            map(sourceList.get(i), targetList.get(i));
        }
    }
}
