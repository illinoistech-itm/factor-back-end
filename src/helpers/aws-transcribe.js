//aws-transcribe.js
const AWS = require("aws-sdk");
const fs = require("fs");
//let awsConfig = new AWS.Config();
const AWSConfig = {
	region: process.env.AWS_REGION, // This is the only AWS region outside the US that supports transcribe API
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
}; // sslEnabled: true, // This is optional

const s3 = new AWS.S3(AWSConfig);
const transcribe = new AWS.Transcribe(AWSConfig);

function storeAudioToBucket(path) {
	new Promise((resolve, reject) => {
		let audioName = path.trim("/")[-1];
		fs.readFile(path+'.wav', (err, data) => {    
	        const params = {
	            Body: data,
	            Bucket: process.env.S3_AUDIO_BUCKET,
	            Key: audioName,
	        };
	        s3.putObject(params, function (err, data) {
	            if (err) {
	                console.log(err, err.stack);
	                reject(err);
	            }
	            else {
	                resolve(params.Key);
	            }
	        });
	    });
	};
}

function transcribeAudio(audioName) {
	new Promise((resolve, reject) => {
		const s3URL = 'https://s3.amazonaws.com/' + process.env.S3_AUDIO_BUCKET + "/";
        const params = {
			LanguageCode: 'en-US',
			Media: {MediaFileUri: s3URL +audioName+ ""},
			MediaSampleRateHertz: 8000,
			MediaFormat: 'wav',
			TranscriptionJobName: TranscriptionJobName,
			OutputBucketName: audioName+"-text" //process.env.S3_TRANSCRIPTION_BUCKET
	  	};
        transcribe.startTranscriptionJob(params, function (err, data) {
	        if (err) {
	            console.log(err, err.stack);
	            reject(err);
	        }
	        else {
	            resolve(data);
	        }
	    });
	};
}

function retrieveTranscribedAudio(audioName) {
	new Promise((resolve, reject) => {
		const transcription = (typeof transcript === 'string' || transcript instanceof String) ? transcript : transcript.TranscriptionJob.TranscriptionJobName;
		
		const params = {
	        TranscriptionJobName: transcription,
	    };

	    transcribe.getTranscriptionJob(params, function (err, data) {
	        if (err) {
	            console.log(err, err.stack);
	            reject(err);
	        }
	        else {
	            resolve(data);
	        }
	    });
	};
}

module.exports = {
    storeAudioToBucket: storeAudioToBucket,
    transcribeAudio: transcribeAudio,
    retrieveTranscribedAudio: retrieveTranscribedAudio
};