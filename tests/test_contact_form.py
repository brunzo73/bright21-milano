import json
import unittest
from datetime import date, timedelta
from playwright.sync_api import sync_playwright


class ContactFormTests(unittest.TestCase):
    def test_required_name_guest_options_and_saved_booking_survives_email_failure(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1280, "height": 1800})
            bookings = []
            emails = []
            def save_booking(route):
                bookings.append(route.request.post_data_json)
                route.fulfill(status=201, body='', headers={'access-control-allow-origin': '*'})
            def reject_email(route):
                if route.request.method == 'OPTIONS':
                    route.fulfill(status=204, headers={'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST'})
                    return
                emails.append(route.request.post_data_json)
                route.fulfill(status=500, body='{}', content_type='application/json', headers={'access-control-allow-origin': '*'})
            page.route('**/rest/v1/bookings*', save_booking)
            page.route('https://formsubmit.co/ajax/**', reject_email)
            page.goto('http://localhost:8080')
            page.locator('#contact').scroll_into_view_if_needed()
            self.assertTrue(page.locator('#name').evaluate('(el) => el.required'))
            self.assertFalse(page.locator('#name').evaluate('(el) => el.checkValidity()'))
            self.assertEqual(page.locator('#guests').input_value(), '2')
            self.assertEqual(page.locator('#guests option').evaluate_all('(els) => els.map(el => el.value)'), ['1', '2', '3', '4'])
            page.locator('#name').fill('Form verification')
            page.locator('#email').fill('form-verification@example.com')
            page.locator('#guests').select_option('4')
            page.locator('#message').fill('Verification only')
            page.locator('#checkin').fill(str(date.today() + timedelta(days=10)))
            page.locator('#checkout').fill(str(date.today() + timedelta(days=12)))
            text = page.locator('#contact').inner_text()
            answers = {'What color is the sky?': 'blue', 'How many legs does a cat have?': '4', 'What is 2 + 2?': '4', 'Which animal says "meow"?': 'cat', 'What comes after Monday?': 'tuesday', 'How many days in a week?': '7'}
            answer = next(v for k, v in answers.items() if k in text)
            page.get_by_role('button', name=answer, exact=True).click()
            page.locator('#privacy').click()
            page.get_by_role('button', name='Check Availability', exact=True).click()
            page.wait_for_function('document.querySelector("#name").value === ""')
            self.assertEqual(bookings[0][0]['message'], 'Guests: 4\nVerification only')
            self.assertEqual(emails[0]['Guests'], '4')
            self.assertEqual(emails[0]['_cc'], 'lorenzo.vigo@gmail.com')
            self.assertEqual(emails[0]['_replyto'], 'form-verification@example.com')
            self.assertEqual(page.locator('#guests').input_value(), '2')
            self.assertEqual(page.url, 'http://localhost:8080/')
            page.locator('#contact').screenshot(path='/tmp/browser/contact-form/saved.png')
            browser.close()


if __name__ == '__main__':
    unittest.main()
