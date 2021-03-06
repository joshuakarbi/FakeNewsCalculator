
from flask import Flask
from flask import request
from flask_cors import CORS
from random import randint
from trump_search import num_instances
from bing_search import article_title_search
import base64
import json
import urllib.request
import html2text

app = Flask(__name__)
CORS(app)

@app.route('/articleID/<articleURL>',methods=['GET'])
def parse_article(articleURL):
  #  encodedArticleURLfromHeader = request.args.get('articleURL',default = None,type=str)
    print (articleURL)

    if articleURL is not None:
        #decode base64
        decodedArticleURLfromHeader = base64.b64decode(articleURL).decode('utf-8')
        print(decodedArticleURLfromHeader)
        fp = urllib.request.urlopen(decodedArticleURLfromHeader)
        mybytes = fp.read()

        mystring = mybytes.decode("utf-8")
        fp.close()
        h = html2text.HTML2Text()

        sanitized_content = h.handle(mystring)
        article_title = sanitized_content[:100]

        print(h.handle(mystring))
        number_of_trumps = num_instances(sanitized_content, "Trump")
        bing_search_score = article_title_search(article_title)

        returnDict = {}

        returnDict.update({'decodedURL':decodedArticleURLfromHeader})
        returnDict.update({'score':number_of_trumps})
        returnDict.update({'frequency':bing_search_score})

        jsonDataAsString = json.dumps(returnDict)

        return jsonDataAsString


@app.route('/random',methods=['GET'])
def random():
    returnDict = {'score':randint(0,100)}
    return json.dumps(returnDict) 
