module.exports = {
    // twitter api
    consumer_key:         'CONSUMERKEY',
    consumer_secret:      'CONSUMERSECRET',
    access_token:         'ACCESSTOKEN',
    access_token_secret:  'ACCESSTOKENSECRET',
    // timeout_ms: 60*1000,

    // bing api
    accKey: 'PRIMARYACCOUNTKEY',

    // regEx for the photo request
    trigger: /(?:[^"']|^)(\bshow me a pic\b|\bshow me a picture\b|\bshow me a photo\b|\bshow me a photograph\b)(?!["'])/ig,

    // regEx for a question being asked
    questionRegEx: /[^A-Za-z0-9',.;:"'&%@#*()!\s]/ig,

    // variety of try again phrases to avoide duplicate tweet errors
    tryAgainPhrases:
    [
      ' please try again by tweeting: show me a photo',
      ' please try again by tweeting: show me a picture',
      ' please try again by tweeting: show me a photograph',
      ' please request again by asking: show me a photo',
      ' please request again by asking: show me a picture',
      ' please request again by asking: show me a photograph',
      ' to view an image, please tweet: show me a photo',
      ' to view an image, please tweet: show me a picture',
      ' to view an image, please tweet: show me a photograph',
      ' try again please. try tweeting: show me a photo',
      ' try again please. try tweeting: show me a picture',
      ' try again please. try tweeting: show me a photograph',
      ' please request again by tweeting: show me a photo',
      ' please request again by tweeting: show me a picture',
      ' please request again by tweeting: show me a photograph',
      ' to view a photograph, please tweet: show me a photo',
      ' to view a photograph, please tweet: show me a picture',
      ' to view a photograph, please tweet: show me a photograph'
    ],

    // questions that accompany the photograph
    questions:
    [
      'Want to ask the photo a question?',
      'Want to ask the photograph a question?',
      'Do you want to ask the photo a question?',
      'Do you have a question for the photograph?',
      'Any questions for the photograph?',
      'What\'s your question for the photograph?',
      'What\'s your question for the photo?',
      'A question for the photograph?',
      'A question for the photo?',
      'Care to ask the photo a question?',
      'Care to ask the photograph a question?',
      'Have a question for the photo?',
      'A question for the photograph?',
      'A question for the photo?'
    ],

    // affirmations for asking the photo a question
    questionResponses:
    [
      ' Photos ❤️💚💙 to be asked questions. Hope you have a wonderful day 😍 !',
      ' Great question 😍 ! Photos ❤️💚💙 to be asked questions! Hope you have an amazing day 😍 !',
      ' Photos ❤️💚💙 being asked questions. Have a wonderful day 😍 !',
      ' You\'re Awesome for asking the photo a question 😍 ! Hope you have a wonderful day! ❤️💚💙',
      ' Did you know how wonderful you are for asking the photograph a question ? Photos ❤️💚💙 being asked questions!',
      ' Questions make me SMILE & photos ❤️💚💙 being asked questions! Hope you have an amazing day! 😍',
      ' 🌈🌈🌈 Fantastic!!! Photos ❤️💚💙 being asked questions. Hope you have a super day 😍 !',
      ' A marvelous question for the photo ❤️💚💙 ! Hope you have a superb day 😍 !'
    ],

    // suggestions for asking questions to photographs
    questionSuggestions:
    [
      'Who or what do you see?',
      'When was this photograph taken — what is happening in the photograph?',
      'Where was this photograph taken?',
      'Why did the photographer select these particular elements to include in the photograph?',
       'What don\'t you see?',
       'Why did the photographer emphasize certain elements and not others?',
       'What\'s in focus?',
       'Is only one person or element in focus, or are many elements in focus?',
       'Why did the photographer take the picture at this moment?',
       'What happened before or after this picture was taken?',
       'Why did the photographer take the picture from this angle?',
       'What might the scene have looked like from another vantage point — from left, right, behind, above, or below?',
       'What is the photograph\'s composition?',
       'What moment in time does the photograph capture?',
       'What is the setting of this photograph?',
       'What is the focal point of the photograph?',
       'What did the photographer choose to include or exclude in the image?',
       'If the photographer had zoomed out or stood further away, what additional information could we see?',
       'How does the decision to frame only certain elements in the photograph affect the message conveyed by the photograph?',
       'Why was the photograph made at that exact moment?',
       'Why was the image of this moment chosen for display or publication over that of another?',
       'What happened just before this moment, or just after it?',
       'What was the photographer\'s thought process as they composed, framed, shot & selected this image?',
       'What do we know about this photograph?'
    ]
};
