import unittest
from datetime import date, timedelta
from playwright.sync_api import sync_playwright


class ContactFormTests(unittest.TestCase):
    def test_guests_capped_at_two_and_honeypot_rejects_bots(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1280, "height": 1800})
            emails = []
            supabase_calls = []

            def accept_email(route):
                if route.request.method == 'OPTIONS':
                    route.fulfill(status=204, headers={'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST'})
                    return
                emails.append(route.request.post_data_json)
                route.fulfill(status=200, body='{"success":"true"}', content_type='application/json', headers={'access-control-allow-origin': '*'})

            def record_supabase(route):
                supabase_calls.append(route.request.url)
                route.fulfill(status=200, body='[]', headers={'access-control-allow-origin': '*'})

            page.route('https://formsubmit.co/ajax/**', accept_email)
            page.route('**/supabase.co/**', record_supabase)
            page.goto('http://localhost:8080')
            page.locator('#contact').scroll_into_view_if_needed()
            self.assertTrue(page.locator('#name').evaluate('(el) => el.required'))
            self.assertEqual(page.locator('#guests').input_value(), '2')
            self.assertEqual(page.locator('#guests option').evaluate_all('(els) => els.map(el => el.value)'), ['1', '2'])
            self.assertNotIn('Security Verification', page.locator('#contact').inner_text())
            self.assertEqual(page.locator('input[name="_honey"]').evaluate('(el) => getComputedStyle(el).display'), 'none')
            page.locator('#name').fill('Form verification')
            page.locator('#email').fill('form-verification@example.com')
            page.locator('#guests').select_option('2')
            page.locator('#message').fill('Verification only')
            page.locator('#checkin').fill(str(date.today() + timedelta(days=10)))
            page.locator('#checkout').fill(str(date.today() + timedelta(days=12)))
            page.locator('#privacy').click()
            page.get_by_role('button', name='Check Availability', exact=True).click()
            page.wait_for_function('document.querySelector("#name").value === ""')
            self.assertEqual(len(emails), 1)
            self.assertEqual(supabase_calls, [])
            self.assertEqual(emails[0]['Guests'], '2')
            self.assertEqual(emails[0]['_honey'], '')
            self.assertEqual(emails[0]['_cc'], 'lorenzo.vigo@gmail.com')
            self.assertEqual(emails[0]['_replyto'], 'form-verification@example.com')
            self.assertEqual(emails[0]['Name'], 'Form verification')
            self.assertEqual(emails[0]['Check-in'], str(date.today() + timedelta(days=10)))
            self.assertIn('Booking request sent!', page.locator('body').inner_text())
            self.assertEqual(page.locator('#guests').input_value(), '2')
            self.assertEqual(page.url, 'http://localhost:8080/')
            page.locator('#contact').screenshot(path='/tmp/browser/contact-form/saved.png')
            browser.close()

    def test_email_failure_keeps_the_data_and_shows_an_error(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1280, "height": 1800})

            def reject_email(route):
                if route.request.method == 'OPTIONS':
                    route.fulfill(status=204, headers={'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST'})
                    return
                route.fulfill(status=500, body='{}', content_type='application/json', headers={'access-control-allow-origin': '*'})

            page.route('https://formsubmit.co/ajax/**', reject_email)
            page.goto('http://localhost:8080')
            page.locator('#contact').scroll_into_view_if_needed()
            page.locator('#name').fill('Keep my data')
            page.locator('#email').fill('keep@example.com')
            page.locator('#checkin').fill(str(date.today() + timedelta(days=10)))
            page.locator('#checkout').fill(str(date.today() + timedelta(days=12)))
            page.locator('#privacy').click()
            page.get_by_role('button', name='Check Availability', exact=True).click()
            page.wait_for_function('document.body.innerText.includes("Unable to send your request")')
            self.assertEqual(page.locator('#name').input_value(), 'Keep my data')
            self.assertNotIn('Booking request sent!', page.locator('body').inner_text())
            browser.close()

    def test_filled_honeypot_silently_drops_the_request(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1280, "height": 1800})
            emails = []

            def record_email(route):
                emails.append(route.request.post_data_json)
                route.fulfill(status=200, body='{"success":"true"}', content_type='application/json', headers={'access-control-allow-origin': '*'})

            page.route('https://formsubmit.co/ajax/**', record_email)
            page.goto('http://localhost:8080')
            page.locator('#contact').scroll_into_view_if_needed()
            page.locator('#name').fill('Spam bot')
            page.locator('#email').fill('bot@example.com')
            page.locator('#checkin').fill(str(date.today() + timedelta(days=10)))
            page.locator('#checkout').fill(str(date.today() + timedelta(days=12)))
            page.locator('#privacy').click()
            page.locator('input[name="_honey"]').evaluate('(el) => { const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set; setter.call(el, "bot"); el.dispatchEvent(new Event("input", { bubbles: true })); }')
            page.get_by_role('button', name='Check Availability', exact=True).click()
            page.wait_for_timeout(1500)
            self.assertEqual(emails, [])
            self.assertEqual(page.locator('#name').input_value(), 'Spam bot')
            browser.close()


if __name__ == '__main__':
    unittest.main()
