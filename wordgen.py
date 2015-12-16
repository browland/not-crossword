import re

def jsonify(resp):
    split = re.split('<br><p style="text-align: center;font-size: 12px;font-weight: 500;"><b>&nbsp;Definition:</b> |</p>,', resp)

    json = '['
    curr_answer = None
    curr_clue = None
    for i, thing in enumerate(split):
        if i % 2 == 0:
            # it's an answer
            curr_answer = thing
        else:
            # it's a clue
            curr_clue = thing
            json += '{"clue": "%s", "answer": "%s"},' % (curr_clue, curr_answer)
    json = json[0:-1] + ']' # strip last comma
    return json
