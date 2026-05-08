package org.financial.financialaibackend.Controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.financial.financialaibackend.Entity.SocialWorker;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.socialWoker.SocialWorkerLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
@Slf4j
public class AccountController {

    @Autowired
    private SocialWorkerBL socialWorkerRegisterService;


    @PostMapping("/login")
    public ResponseEntity<SocialWorker> login(@RequestBody @Valid SocialWorkerLoginRequest loginRequest) {
        return ResponseEntity.ok(socialWorkerRegisterService.loginSocialWorker(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<SocialWorker> register(@RequestBody @Valid SocialWorker socialWorker) {
        return ResponseEntity.ok(socialWorkerRegisterService.registerSocialWorker(socialWorker));
    }

}
