import os
import csv
import random

# Ensure the output directory exists
DATASETS_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets")
os.makedirs(DATASETS_DIR, exist_ok=True)

EMAILS_FILE = os.path.join(DATASETS_DIR, "emails.csv")
URLS_FILE = os.path.join(DATASETS_DIR, "urls.csv")

# ==========================================
# Email Dataset Generation (10,000 records)
# ==========================================

PHISHING_TEMPLATES = [
    "Urgent: Your account at {bank} has been suspended. Click here to verify: {url}",
    "Verify your {service} login immediately. Unrecognized activity detected from IP {ip}. Reset password: {url}",
    "You have received a tax refund of {amount} USD. Submit your details to claim: {url}",
    "Security Alert: Someone has requested a password change for your {service} ID. If not you, secure your account at {url}",
    "Congratulations! You won a {prize} from {brand}. Click here to claim your reward: {url}",
    "Action Required: Update your billing information for {service} to avoid service interruption: {url}",
    "Dear customer, your card ending in {digits} has been blocked. Call support or login here: {url}",
    "Invoice {invoice} for {amount} is overdue. View statement and pay now: {url}",
    "Crypto Alert: Your wallet has been accessed. Transfer your funds to a safe address: {url}",
    "Your package from {courier} could not be delivered due to incorrect address. Update details: {url}",
    "Final Warning: Your storage is full on {service}. Upgrade immediately or lose files: {url}",
    "Exclusive Offer: Refinance your mortgage at 1.5% interest rate. Pre-qualify today: {url}",
    "Attention: Win {amount} worth of Bitcoin by clicking on our promotional link: {url}",
    "Critical security patch required for your computer. Click to download the update: {url}",
    "Your payroll details need verification. Please update your bank details on the portal: {url}"
]

LEGITIMATE_TEMPLATES = [
    "Hi, just reminding you about our meeting tomorrow at {time}. Let me know if you can make it.",
    "Your weekly digest from {service} is ready. Here are your top recommendations for this week.",
    "Thank you for your order at {brand}. Your order number is #{digits} and will ship soon.",
    "Thanks for subscribing to our newsletter! Here is your free ebook link: {legit_url}",
    "Here is the project update for the {project} sprint. Let me know your thoughts by EOD.",
    "Your reservation at {service} has been confirmed for {time}. View details here: {legit_url}",
    "Hi {name}, I've shared the document '{project}' with you. Please review and leave comments.",
    "Your subscription to {service} has auto-renewed. View your receipt: {legit_url}",
    "Welcome to the {service} team! Here is the onboarding document to get you started.",
    "Reminder: Your appointment with Dr. {name} is scheduled for {time}.",
    "Your monthly energy statement for {brand} is now available. Log in to view: {legit_url}",
    "Here are the tickets for your flight {flight} to {city}. Have a great trip!",
    "Hi, can you send over the slides for the {project} presentation before our call?",
    "Your account statement for {bank} is ready. Login to your secure portal to download.",
    "Hi {name}, hope you're doing well. Just wanted to catch up on the details we discussed yesterday."
]

BANKS = ["Chase Bank", "Bank of America", "Wells Fargo", "Citibank", "Capital One", "HSBC", "Paypal"]
SERVICES = ["Netflix", "Amazon", "Apple", "Google", "Dropbox", "Microsoft 365", "Zoom", "Facebook", "LinkedIn"]
BRANDS = ["Walmart", "Target", "Best Buy", "Costco", "Amazon", "eBay"]
PRIZES = ["$1000 Gift Card", "iPhone 15 Pro", "Tesla Model 3", "iPad Air", "$500 Cash Reward"]
COURIERS = ["FedEx", "UPS", "DHL", "USPS", "Amazon Logistics"]
NAMES = ["John", "Sarah", "Emily", "David", "Michael", "Jessica", "James", "Robert", "Linda", "William"]
PROJECTS = ["Website Redesign", "Marketing Campaign", "Database Migration", "Product Launch", "Sales Review"]
CITIES = ["New York", "London", "Tokyo", "Paris", "San Francisco", "Chicago", "Sydney"]

PHISH_URLS = [
    "http://secure-chase-login-auth.com/verify",
    "http://netflix-billing-update-alert.net/login",
    "https://paypal-security-verification-portal.org",
    "http://verify-bankofamerica.co/signin",
    "http://apple-id-recovery-support.info",
    "https://microsoft365-password-reset.xyz/update",
    "http://dhl-package-tracking-update.com/status",
    "http://amazon-giftcard-promotions.net",
    "http://wallet-connect-ledger.com/restore",
    "http://irs-tax-refund-claim.gov.us/portal",
    "http://login.secure-bank-login.xyz",
    "http://update-credential-zoom.org",
    "http://drive-google-sharing-view.com",
    "http://signin-facebook-account-alert.net",
    "http://dropbox-storage-upgrade-deal.co"
]

LEGIT_URLS = [
    "https://www.chase.com",
    "https://www.netflix.com/youraccount",
    "https://www.paypal.com/signin",
    "https://www.bankofamerica.com",
    "https://appleid.apple.com",
    "https://login.microsoftonline.com",
    "https://www.dhl.com/en/express/tracking",
    "https://www.amazon.com/gp/css/homepage.html",
    "https://ledger.com",
    "https://www.irs.gov",
    "https://zoom.us/join",
    "https://drive.google.com",
    "https://www.facebook.com",
    "https://www.dropbox.com"
]

def generate_email_text(label):
    if label == "phishing":
        template = random.choice(PHISHING_TEMPLATES)
        return template.format(
            bank=random.choice(BANKS),
            service=random.choice(SERVICES),
            brand=random.choice(BRANDS),
            prize=random.choice(PRIZES),
            courier=random.choice(COURIERS),
            url=random.choice(PHISH_URLS) + f"?id={random.randint(10000, 99999)}",
            ip=f"{random.randint(100,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}",
            amount=f"{random.randint(50, 5000)}",
            digits=f"{random.randint(1000, 9999)}",
            invoice=f"INV-{random.randint(100000, 999999)}"
        )
    else:
        template = random.choice(LEGITIMATE_TEMPLATES)
        return template.format(
            time=f"{random.randint(1,12)}:{random.choice(['00', '15', '30', '45'])} {random.choice(['AM', 'PM'])}",
            service=random.choice(SERVICES),
            brand=random.choice(BRANDS),
            project=random.choice(PROJECTS),
            name=random.choice(NAMES),
            legit_url=random.choice(LEGIT_URLS),
            digits=f"{random.randint(1000, 9999)}",
            flight=f"{random.choice(['AA', 'DL', 'UA'])}{random.randint(100, 999)}",
            city=random.choice(CITIES),
            bank=random.choice(BANKS)
        )

# ==========================================
# URL Dataset Generation (10,000 records)
# ==========================================

URL_LEGIT_DOMAINS = [
    "google.com", "youtube.com", "facebook.com", "wikipedia.org", "yahoo.com", "amazon.com", 
    "twitter.com", "instagram.com", "linkedin.com", "reddit.com", "netflix.com", "github.com",
    "microsoft.com", "apple.com", "stackoverflow.com", "zoom.us", "dropbox.com", "paypal.com",
    "chase.com", "bankofamerica.com", "wellsfargo.com", "cnn.com", "nytimes.com", "spotify.com",
    "medium.com", "quora.com", "adobe.com", "salesforce.com", "slack.com", "cloudflare.com"
]

URL_PHISH_SUBDOMAINS = [
    "secure", "update", "verify", "login", "signin", "account", "support", "billing", "free", 
    "banking", "recovery", "alert", "security", "webapps", "service", "portal"
]

URL_PHISH_DOMAINS = [
    "paypal-update-alert", "chase-secure-login", "wellsfargo-verify-account", "netflix-billing-renew",
    "apple-id-support-recovery", "amazon-giftcard-reward", "microsoft-password-reset", "google-drive-share",
    "dropbox-file-download", "coinbase-restore-wallet", "dhl-shipping-status", "irs-refund-claim",
    "bankofamerica-auth", "facebook-security-check", "linkedin-jobs-portal"
]

URL_TLDS = [".com", ".net", ".org", ".co", ".xyz", ".info", ".online", ".tech", ".ru", ".biz", ".cc"]

URL_PATHS = [
    "/login", "/signin", "/verify", "/update", "/billing", "/account/secure", "/reset-password",
    "/index.php", "/share/docs", "/payment/invoice", "/promo/free", "/settings/security"
]

def generate_url(label):
    if label == "legitimate":
        domain = random.choice(URL_LEGIT_DOMAINS)
        path = random.choice(["", "/", "/about", "/contact", "/search?q=test", "/docs", "/profile", "/post/" + str(random.randint(1,1000))])
        # Legitimate URLs are almost always HTTPS
        protocol = "https://" if random.random() < 0.98 else "http://"
        url = protocol + domain + path
    else:
        # Phishing URLs
        protocol = "http://" if random.random() < 0.60 else "https://"
        
        # Build a typical suspicious URL
        has_subdomain = random.random() < 0.70
        sub = random.choice(URL_PHISH_SUBDOMAINS) + "." if has_subdomain else ""
        
        domain = random.choice(URL_PHISH_DOMAINS)
        # Maybe add a random string or suffix to domain
        if random.random() < 0.5:
            domain += f"-{random.randint(100, 9999)}"
            
        tld = random.choice(URL_TLDS)
        
        path = random.choice(URL_PATHS)
        if random.random() < 0.5:
            path += f"?id={random.randint(1000, 99999)}&ref={random.choice(URL_PHISH_SUBDOMAINS)}"
            
        url = protocol + sub + domain + tld + path
        
    return url

# ==========================================
# Main Writer Loop
# ==========================================

def main():
    print("Generating email dataset...")
    # Generate 5,000 legitimate and 5,000 phishing emails (total 10,000)
    emails = []
    for _ in range(5000):
        emails.append((generate_email_text("legitimate"), "legitimate"))
        emails.append((generate_email_text("phishing"), "phishing"))
    
    # Shuffle dataset
    random.shuffle(emails)
    
    with open(EMAILS_FILE, mode="w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Email Text", "Label"])
        writer.writerows(emails)
    print(f"Saved {len(emails)} emails to {EMAILS_FILE}")

    print("Generating URL dataset...")
    # Generate 5,000 legitimate and 5,000 phishing URLs (total 10,000)
    urls = []
    for _ in range(5000):
        urls.append(("legitimate", generate_url("legitimate")))
        urls.append(("phishing", generate_url("phishing")))
        
    random.shuffle(urls)
    
    # URL columns: URL, URL Length, HTTPS, Special Characters, Label
    # Special characters: number of hyphens, dots, underscores, question marks, equals, ampersands, @
    with open(URLS_FILE, mode="w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["URL", "URL Length", "HTTPS", "Special Characters", "Label"])
        
        for label, url in urls:
            length = len(url)
            https = 1 if url.startswith("https://") else 0
            # Count special characters
            special_chars = sum(url.count(char) for char in ["-", ".", "_", "?", "=", "&", "@", "%"])
            writer.writerow([url, length, https, special_chars, label])
            
    print(f"Saved {len(urls)} URLs to {URLS_FILE}")
    print("Dataset generation complete!")

if __name__ == "__main__":
    main()
