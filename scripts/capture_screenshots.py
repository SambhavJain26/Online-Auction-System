import os
import time
from playwright.sync_api import sync_playwright

def capture():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, "docs", "screenshots")
    os.makedirs(output_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 840})
        page = context.new_page()

        # 01 Login Portal
        print("[1/5] Capturing Login Portal...")
        page.goto("http://localhost:3008/", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(output_dir, "01-login-portal.png"), full_page=False)

        # Login as Host
        print("[*] Logging in as League Host...")
        # Click "I am Host" if needed or fill host form
        # In index.ejs: host form action="/loginHost", inputs email, password
        host_email_input = page.locator('form[action="/loginHost"] input[name="email"]')
        host_pass_input = page.locator('form[action="/loginHost"] input[name="password"]')
        # Toggle to host panel
        register_btn = page.locator('#register')
        if register_btn.is_visible():
            register_btn.click()
            time.sleep(0.5)
        
        host_email_input.fill("host@auction.com")
        host_pass_input.fill("HostPass123!")
        page.locator('form[action="/loginHost"] button').click()
        page.wait_for_url("**/host", timeout=10000)
        time.sleep(1.5)

        # 02 Host Hub
        print("[2/5] Capturing Host Hub...")
        page.screenshot(path=os.path.join(output_dir, "02-host-hub.png"), full_page=False)

        # 03 Host Management Dashboard
        print("[3/5] Capturing Host Management Dashboard...")
        page.goto("http://localhost:3008/host/manageplayers", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(output_dir, "03-host-dashboard.png"), full_page=False)

        # Open second context for Franchise User
        print("[*] Logging in as Franchise User in parallel session...")
        user_context = browser.new_context(viewport={"width": 1280, "height": 840})
        user_page = user_context.new_page()
        user_page.goto("http://localhost:3008/", wait_until="networkidle")

        user_email_input = user_page.locator('form[action="/loginUser"] input[name="email"]')
        user_pass_input = user_page.locator('form[action="/loginUser"] input[name="password"]')
        user_email_input.fill("apex@nupl.com")
        user_pass_input.fill("Franchise123!")
        user_page.locator('form[action="/loginUser"] button').click()
        user_page.wait_for_url("**/users", timeout=10000)
        time.sleep(1.5)

        # 04 Live Bidding Room
        print("[4/5] Capturing Live Bidding Room...")
        user_page.goto("http://localhost:3008/users/nupl", wait_until="networkidle")
        time.sleep(2)
        user_page.screenshot(path=os.path.join(output_dir, "04-live-bidding-room.png"), full_page=False)

        # 05 Franchise Picks
        print("[5/5] Capturing Franchise Roster (Your Picks)...")
        user_page.goto("http://localhost:3008/users/nuplPicks", wait_until="networkidle")
        time.sleep(1.5)
        user_page.screenshot(path=os.path.join(output_dir, "05-franchise-picks.png"), full_page=False)

        browser.close()
        print("All screenshots successfully captured in docs/screenshots!")

if __name__ == "__main__":
    capture()
