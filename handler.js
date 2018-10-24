'use strict';

const AWS = require('aws-sdk');
const comprehend = new AWS.Comprehend()
const s3 = new AWS.S3();

module.exports.getMyHistory = (event, context, callback) => {

    var positive = 0
    var negative = 0
    var neutral = 0
    var mixed = 0
    var sentiments = []

    s3.getObject(
        { Bucket: "balancin.sandbox", Key: "_chat_alone.txt" },
        function (error, data) {
            if (error != null) {
                console.log("Failed to retrieve an object: " + error);
            } else {
                console.log("Loaded " + data.ContentLength + " bytes");

                var messages = data.Body.toString().split("\n")
                console.log(messages.length)
                var messages = messages.slice(1301, 1400)
                const spectral = messages.length
                console.log(messages.length)

                new Promise(function (resolve, reject) {
                    for (var mi in messages) {
                        // console.log(mi)

                        var params = {
                            LanguageCode: "pt",
                            Text: messages[mi]
                        };

                        var sentimentsAnalysis = comprehend.detectSentiment(params).promise()
                        sentimentsAnalysis.then(function (data) {
                            sentiments.push(data.Sentiment)
                            // console.log(data.Sentiment);
                            if (sentiments.length == spectral)
                                resolve('ok')
                        }).catch(function (err) {
                            console.log(err);
                        });

                        if (mi == spectral) break;
                    }

                    // resolve('ok')

                }).then(() => {

                    for (var count in sentiments) {
                        if (sentiments[count] == 'POSITIVE') {
                            positive++
                        }
                        if (sentiments[count] == 'NEGATIVE') {
                            negative++
                        }
                        if (sentiments[count] == 'NEUTRAL') {
                            neutral++
                        }
                        if (sentiments[count] == 'MIXED') {
                            mixed++
                        }
                    }
                    console.log("positive: " + positive)
                    console.log("negative: " + negative)
                    console.log("neutral: " + neutral)
                    console.log("mixed: " + mixed)

                });


                console.log(positive)

            }
        }
    );

    console.log('eof')

    // callback(null, "some success message");

};