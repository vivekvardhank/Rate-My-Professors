import sys
import requests
from bs4 import BeautifulSoup

def main():
    if len(sys.argv) != 2:
        print("Usage: python datascrap.py <URL>")
        return

    url = sys.argv[1]

    # Send an HTTP request to the webpage and get the response
    response = requests.get(url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the webpage content
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract all text content from the webpage
        page_text = soup.get_text()

        # Remove leading and trailing spaces and reduce multiple spaces to a single space
        cleaned_text = ' '.join(page_text.split())

        # Print the cleaned text content (this will be captured in the Node.js stdout)
        print(cleaned_text)

    else:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")

if __name__ == "__main__":
    main()
