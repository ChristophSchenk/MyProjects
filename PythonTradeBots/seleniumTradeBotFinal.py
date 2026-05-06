from selenium import webdriver
import undetected_chromedriver as uc
from selenium.common.exceptions import StaleElementReferenceException
from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver.chrome.options import Options

import time

chrome_options = Options()
chrome_options.add_argument('--lang=en-US')
# chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-extensions")
chrome_options.add_argument("disable-infobars")
check_RWT = True

webdriver = uc.Chrome(options=chrome_options)
webdriver.implicitly_wait(10)
webdriver.get("https://www.csgoroll.com/en/withdraw/csgo/p2p")
webdriver.maximize_window()

time.sleep(3)
login_button = webdriver.find_element("css selector", 'button[data-test="auth-login-btn"]')
login_button.click()
time.sleep(120)
i = 0

# close_chat = webdriver.find_element("class name", "chat-close")
# time.sleep(1)
# close_chat.click()
# close_banner = webdriver.find_element("class name", "close-icon")
# close_banner.click()
# reject_cookies = webdriver.find_element("css selector", ".cky-btn.cky-btn-reject")
# reject_cookies.click()
# time.sleep(5)


while True:
    i += 1
    if (i > 10):
        i = 0
        try:
            trade_not_joinable = webdriver.find_element("css selector", '[aria-label="This trade is not joinable"]')
            if (trade_not_joinable):
                try:
                    order_by_selector = webdriver.find_elements("css selector", 'mat-select[role="combobox"]')
                    order_by_selector[1].click()
                    try:
                        best_deals = webdriver.find_element("id", "mat-option-2")
                        best_deals.click()
                    except Exception as e:   
                        pass  

                except Exception as e:
                    pass

                try:
                    order_by_selector = webdriver.find_elements("css selector", 'mat-select[role="combobox"]')
                    order_by_selector[1].click()
                    try:
                        highest_price = webdriver.find_elements("class name", "mat-option-text")
                        highest_price[0].click()
                    except Exception as e:   
                        pass  

                except Exception as e:
                    pass

        except Exception as e:
            pass  

    try: 
        skin = webdriver.find_elements("css selector", 'label[data-test="item-name"]')
        if skin:
            skin[0].click()

            try:
              withdraw_button = webdriver.find_element("css selector", 'button[color="accent"]')
              if withdraw_button:
                withdraw_button.click()
            except Exception as e:
                # Handle the case where withdraw_button is not found
                pass    

    except StaleElementReferenceException:
        pass  # Ignore StaleElementReferenceException
    except ElementClickInterceptedException:
        pass  # Ignore ElementClickInterceptedException