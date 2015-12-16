from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import wordgen
import urllib2

class GetHandler(webapp.RequestHandler):
    def get(self):
        resp = urllib2.urlopen('http://www.wordgenerator.net/application/p.php?type=2&id=dictionary_words&isSpace=false')
        resp_json = wordgen.jsonify(resp.read())
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(resp_json)

application = webapp.WSGIApplication(
        [('/words', GetHandler)],
        debug=True)

def main():
    run_wsgi_app(application)

if __name__ == '__main__':
    main()
