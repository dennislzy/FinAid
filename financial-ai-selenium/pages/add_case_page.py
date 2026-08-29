from components.common.alert_message import AlertMessage
from pages.common.base_page import BasePage
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class CaseInfoPage(BasePage):

    # Locators for input fields
    CASE_NAME = (By.ID, "caseInfoName")
    CASE_ENGLISH_NAME = (By.ID, "caseInfoEnglishName")
    CASE_PHONE = (By.ID, "caseInfoPhone")
    CASE_HOME_PHONE = (By.ID, "caseInfoHomePhone")
    CASE_EMAIL = (By.ID, "caseInfoEmail")
    CASE_IDENTIFICATION = (By.ID, "caseInfoIdentification")
    CASE_POSTCODE = (By.ID, "caseInfoPostCode")
    CASE_ADDRESS = (By.ID, "caseInfoAddress")
    CASE_CITY = (By.ID, "caseInfoCity")
    CASE_BIRTH = (By.ID, "caseInfoBirth")
    CASE_EMERGENCY_CONTACT = (By.ID, "caseInfoEmergencyContact")
    CASE_EMERGENCY_PHONE = (By.ID, "caseInfoEmergencyPhone")
    CASE_EMERGENCY_RELATE = (By.ID, "caseInfoEmergencyRelate")
    CASE_CAREER = (By.ID, "caseInfoCareer")

    # Locators for dropdowns
    CASE_HOUSEHOLD_REGISTER_TIME = (By.ID, "caseInfoHouseholdRegisterTime")
    CASE_WELFARE_PROOF = (By.ID, "isWelfareIdentityProof")
    CASE_INDIGENOUS_STATUS = (By.ID, "isIndigenousOrNewResident")
    CASE_DISABILITY_STATUS = (By.ID, "isDisability")
    CASE_LIVE_STATUS = (By.ID, "caseInfoLiveStatus")
    CASE_GENDER = (By.ID, "caseInfoGender")

    # Locators for buttons
    BACK_TO_OVERVIEW = (By.ID, "back-to-overview")

    SUBMIT_BUTTON = (By.ID,'submit-button')

    def enter_case_name(self, name):
        """Enter the case's Chinese name."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_NAME)).send_keys(name)

    def enter_case_english_name(self, english_name):
        """Enter the case's English name."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_ENGLISH_NAME)).send_keys(english_name)

    def enter_case_phone(self, phone):
        """Enter the case's contact phone number."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_PHONE)).send_keys(phone)

    def enter_case_home_phone(self, home_phone):
        """Enter the case's home phone number."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_HOME_PHONE)).send_keys(home_phone)

    def enter_case_email(self, email):
        """Enter the case's email address."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_EMAIL)).send_keys(email)

    def enter_case_identification(self, identification):
        """Enter the case's identification number."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_IDENTIFICATION)).send_keys(identification)

    def enter_case_postcode(self, postcode):
        """Enter the case's postal code."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_POSTCODE)).send_keys(postcode)

    def enter_case_address(self, address):
        """Enter the case's address."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_ADDRESS)).send_keys(address)

    def enter_case_city(self, city):
        """Enter the case's city."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_CITY)).send_keys(city)

    def enter_case_birth(self, birth):
        """Enter the case's birth date."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_BIRTH)).send_keys(birth)

    def enter_case_emergency_contact(self, emergency_contact):
        """Enter the case's emergency contact name."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_EMERGENCY_CONTACT)).send_keys(emergency_contact)

    def enter_case_emergency_phone(self, emergency_phone):
        """Enter the emergency contact's phone number."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_EMERGENCY_PHONE)).send_keys(emergency_phone)

    def enter_case_emergency_relate(self, emergency_relate):
        """Enter the relationship between the emergency contact and the case."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_EMERGENCY_RELATE)).send_keys(emergency_relate)

    def enter_case_career(self, career):
        """Enter the case's occupation."""
        self.wait.until(EC.element_to_be_clickable(self.CASE_CAREER)).send_keys(career)

    def click_submit_button(self):
        """Click the submit button to add the case."""
        self.wait.until(EC.element_to_be_clickable(self.SUBMIT_BUTTON)).click()
        return AlertMessage(self.driver)

    def click_back_to_overview(self):
        """Click the 'Back to Overview' button."""
        self.wait.until(EC.element_to_be_clickable(self.BACK_TO_OVERVIEW)).click()

    def enter_case_info_register_time(self,value):

        self.wait.until(
            EC.element_to_be_clickable(self.CASE_HOUSEHOLD_REGISTER_TIME)
        ).click()

        self.wait.until(
            EC.element_to_be_clickable((By.ID,value))
        ).click()
    
    def enter_case_info_welfare_proof(self,value):

        self.wait.until(
            EC.element_to_be_clickable(self.CASE_WELFARE_PROOF)
        ).click()

        self.wait.until(
            EC.element_to_be_clickable((By.ID,value))
        ).click()
    
    def enter_case_info_indigenous_status(self,value):
        
        self.wait.until(
            EC.element_to_be_clickable(self.CASE_INDIGENOUS_STATUS)
        ).click()

        self.wait.until(
            EC.element_to_be_clickable((By.ID,value))
        ).click()
    
    def enter_case_info_disability_status(self,value):
        
        self.wait.until(
            EC.element_to_be_clickable(self.CASE_DISABILITY_STATUS)
        ).click()

        self.wait.until(
            EC.element_to_be_clickable((By.ID,value))
        ).click()
    
    def enter_case_info_live_status(self,value):
        
        self.wait.until(
            EC.element_to_be_clickable(self.CASE_LIVE_STATUS)
        ).click()

        self.wait.until(
            EC.element_to_be_clickable((By.ID,value))
        ).click()
    
    def enter_case_gender(self,value):
        
        self.wait.until(
            EC.element_to_be_clickable(self.CASE_GENDER)
        ).click()

        self.wait.until(
            EC.element_to_be_clickable((By.ID,value))
        ).click()
