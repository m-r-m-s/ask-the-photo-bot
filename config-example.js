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
    ]
};
