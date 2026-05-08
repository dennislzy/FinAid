package org.financial.financialaibackend.BL;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.financial.financialaibackend.Entity.CaseAnalysis;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.SocialWorker;
import org.financial.financialaibackend.Enums.AnalysisType;
import org.financial.financialaibackend.Repository.CaseAnalysisRepository;
import org.springframework.stereotype.Component;

@Component
public class CaseAnalysisBL {

    private final CaseAnalysisRepository caseAnalysisRepository;

    public CaseAnalysisBL(CaseAnalysisRepository caseAnalysisRepository) {
        this.caseAnalysisRepository = caseAnalysisRepository;
    }

    public CaseAnalysis saveAnalysis(String resultText, CaseInfo caseInfo, SocialWorker socialWorker, AnalysisType type ,String light) {
        CaseAnalysis analysis = new CaseAnalysis();
        analysis.setResultText(resultText);
        analysis.setCaseInfo(caseInfo);
        analysis.setSocialWorker(socialWorker);
        analysis.setAnalysisType(type);
        analysis.setLight(light);
        return caseAnalysisRepository.save(analysis);
    }

    public CaseAnalysis getAnalysis(CaseInfo caseInfo,AnalysisType type,Long id){
        Optional<CaseAnalysis> optionalCaseAnalysis = caseAnalysisRepository.findById(id);
        if (optionalCaseAnalysis.isPresent()){
            CaseAnalysis caseAnalysis = optionalCaseAnalysis.get();
            CaseInfo caseInfo2 = new CaseInfo();
            caseInfo2.setCaseInfoId(caseInfo.getCaseInfoId());
            caseAnalysis.setCaseInfo(caseInfo2);
            return caseAnalysis;
        }else{
            return null;
        }
    }

    public List<CaseAnalysis> getAllAnalysis(String caseInfoId, AnalysisType analysisType) {
        List<CaseAnalysis> caseAnalysis = caseAnalysisRepository.findByCaseInfo_CaseInfoIdAndAnalysisTypeOrderByCreateTimeDesc(caseInfoId, analysisType);
        
        // 方法 1: 如果你需要確保每個 CaseAnalysis 都有正確的 CaseInfo
        return caseAnalysis
            .stream()
            .map(c -> {
                // 如果 CaseInfo 為 null，則創建一個新的
                CaseInfo caseInfo = new CaseInfo();
                caseInfo.setCaseInfoId(caseInfoId);
                c.setCaseInfo(caseInfo);
                return c; // 重要：要返回修改後的對象
            })
            .collect(Collectors.toList()); // 收集結果
        }
}
