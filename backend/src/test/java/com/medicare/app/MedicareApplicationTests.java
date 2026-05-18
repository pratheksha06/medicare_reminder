package com.medicare.app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/medicare_test",
    "app.jwt.secret=TestSecretKeyForJWTTokenGenerationMustBeLongEnough",
    "spring.mail.host=localhost",
    "spring.mail.port=25",
    "twilio.account.sid=TEST",
    "twilio.auth.token=TEST",
    "twilio.phone.number=+10000000000"
})
class MedicareApplicationTests {

    @Test
    void contextLoads() {
    }
}
