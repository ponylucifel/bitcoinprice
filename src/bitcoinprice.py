import requests
import sys

# check if argument is given
if (len(sys.argv)== 2 and len(sys.argv[1]) == 3):
    # grab command line argument for the currency type
    currency = str(sys.argv[1]).upper()

    # get current price from coindesk api
    r = requests.get(url='https://api.coindesk.com/v1/bpi/currentprice/' + currency + '.json')

    # translate the json file and grab information on bitcoin price only
    currencyJson = r.json()['bpi']

    # access the bitcoin price in string format with key "rate"
    print(currencyJson[currency]['rate']+ ' '+ currency  ) 
else:
    print("Invalid argument given.")
