import json
import subprocess
import unittest
from pathlib import Path
from playwright.sync_api import sync_playwright


def response_for(message):
    source = Path('src/components/Chatbot.tsx').read_text()
    function = source.split('const getResponse = ', 1)[1].split('\n\nconst Chatbot', 1)[0]
    result = subprocess.run(
        ['bun', '-e', 'const getResponse = ' + function + '\nconsole.log(JSON.stringify(getResponse(' + json.dumps(message) + ')));'],
        check=True, capture_output=True, text=True,
    )
    return json.loads(result.stdout)


class MiloTests(unittest.TestCase):
    def test_starting_price_per_person(self):
        self.assertIn('€35 per person per night for 2 guests', response_for('What is the price?'))

    def test_checkin_time(self):
        self.assertIn('3:00 PM', response_for('check-in'))

    def test_checkout_time(self):
        self.assertIn('11:00 AM', response_for('check-out'))

    def test_maximum_two_guests(self):
        self.assertIn('up to 2 guests', response_for('How many guests?'))

    def test_booking_confirmation_window(self):
        self.assertIn('24 hours', response_for('booking'))

    def test_address(self):
        self.assertIn('Via Giovanni Battista Sammartini 21', response_for('Where is the apartment?'))

    def test_live_chat_answers_without_network(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={'width': 1280, 'height': 1800})
            page.goto('http://localhost:8080')
            page.get_by_role('button', name='Open Milo chat').click()
            requests = []
            page.on('request', lambda request: requests.append(request.url))
            field = page.get_by_placeholder('Scrivi il tuo messaggio...')
            field.fill('Where is the apartment?')
            page.get_by_role('button', name='Send message', exact=True).click()
            page.get_by_text('We are at Via Giovanni Battista Sammartini 21', exact=False).wait_for()
            field.fill('Quanto costa per notte?')
            field.press('Enter')
            page.get_by_text('Il prezzo parte da €35 a persona a notte', exact=False).wait_for()
            field.fill('booking')
            field.press('Enter')
            page.get_by_text('To check availability and book, please use the booking form', exact=False).wait_for()
            self.assertEqual(requests, [])
            self.assertEqual(field.input_value(), '')
            Path('/tmp/browser/milo').mkdir(parents=True, exist_ok=True)
            page.locator('[data-message-index]').last.screenshot(path='/tmp/browser/milo/booking-answer.png')
            page.get_by_role('button', name='Close Milo chat').click()
            self.assertTrue(page.get_by_role('button', name='Open Milo chat').is_visible())
            browser.close()


if __name__ == '__main__':
    unittest.main()